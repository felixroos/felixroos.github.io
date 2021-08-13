import { Chord, Note } from '@tonaljs/tonal';
import { topNoteSort } from '../rhythmical/deprecated';
import { ValueChild } from '../rhythmical/helpers/objects';
import { voicingsInRange } from '../rhythmical/voicings/voicingsInRange';

export const lefthandBad = {
  "m7": ['3m 5P 7m 9M', '-2M 2M 3m 5P', '7m 9M 10m 12P'],
  "7": ['3M 6M 7m 9M', '-2M 2M 3M 6M', '7m 9M 10M 13M'],
  "^7": ['3M 5P 7M 9M', '-2m 2M 3M 5P', '7M 9M 10M 12P'],
}

export function chordReducer(events: ValueChild<string>[], event: ValueChild<string>, index: number, array: ValueChild<string>[]): ValueChild<string>[] {
  if (typeof event.value === 'string') {
    const { intervals, tonic } = Chord.get(event.value);
    const notes = intervals.map(interval => Note.transpose(tonic + '3', interval));
    return events.concat(notes.map(note => ({ ...event, value: note })));
  }
  return events;
}

export const voicingDictionaryReducer = (dictionary) => (events, event) => {
  if (typeof event.value !== 'string') {
    return events;
  }
  const { tonic, aliases } = Chord.get(event.value);
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!symbol) {
    console.log(`no voicings found for chord "${event.value}"`);
    return events;
  }
  let intervals;
  const voicings = dictionary[symbol].map(i => i.split(' ')); // split interval strings
  const root = tonic + '3';
  const bass = tonic + '2';
  if (!events.length) { // first chord => just use first voicing
    intervals = voicings[0];
  } else { // not first chord => find smoothest voicing
    const lastNote = events[events.length - 1].value; // last voiced note (top note)
    // calculates the distance between the last note and the given voicings top note
    const diff = (voicing) => Math.abs(Note.midi(lastNote) - Note.midi(Note.transpose(root, voicing[voicing.length - 1])));
    // sort voicings by lowest top note difference
    intervals = voicings.sort((a, b) => diff(a) - diff(b))[0];
  }
  // transpose to root
  const notes = intervals.map((interval) =>
    Note.transpose(root, interval)
  );
  return events.concat([{ ...event, value: bass }]).concat(notes.map((note) => ({ ...event, value: note })));
}

// old version with bass note

export const voicingReducer = (dictionary, range, sorter = topNoteSort) => (events, event) => {
  if (typeof event.value !== 'string') {
    return events
  }
  let voicings = voicingsInRange(event.value, dictionary, range);
  const { tonic, aliases } = Chord.get(event.value);
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!symbol) {
    console.log(`no voicings found for chord "${event.value}"`);
    return events;
  }
  const bass = tonic + '2';
  let notes;
  if (!events.length) {
    notes = voicings[Math.ceil(voicings.length / 2)];
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    notes = voicings.sort(sorter(events))[0];
  }
  return events.concat([{ ...event, value: bass }]).concat(notes.map((note) => ({ ...event, value: note })));
}
import { Chord } from '@tonaljs/tonal';
import { voicingsInRange } from './voicingsInRange';

export function getBestVoicing(chordSymbol, dictionary, range, sorter, lastVoicing?) {
  let voicings = voicingsInRange(chordSymbol, dictionary, range);
  const { aliases } = Chord.get(chordSymbol);
  const symbol = Object.keys(dictionary).find(_symbol => aliases.includes(_symbol));
  if (!symbol) {
    console.log(`no voicings found for chord "${chordSymbol}"`);
    return [];
  }
  let notes;
  if (!lastVoicing?.length) {
    //notes = voicings[Math.ceil(voicings.length / 2)]; // pick middle voicing..
    notes = voicings[0]; // pick lowest voicing..
  } else {
    // calculates the distance between the last note and the given voicings top note
    // sort voicings with differ
    notes = voicings.sort(sorter(lastVoicing))[0];
  }
  return notes;
}
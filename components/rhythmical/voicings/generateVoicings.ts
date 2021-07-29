import { Note } from '@tonaljs/tonal';
import { convertRhythm } from '../tree/convertRhythm';
import { RhythmNode, RhythmObject } from '../util';
import { guidetones, lefthand, VoicingDictionary } from './dictionary';
import { getBestVoicing } from './getBestVoicing';


export function topNoteDiff(lastVoicing) {
  const diff = (voicing) => Math.abs(Note.midi(lastVoicing[lastVoicing.length - 1]) - Note.midi(voicing[voicing.length - 1]));
  return (a, b) => diff(a) - diff(b)
}

export function generateVoicings(
  tree: RhythmNode<string>,
  dictionary: VoicingDictionary,
  range: string[],
  sorter = topNoteDiff
) {
  let lastVoicing = [];
  return convertRhythm(tree, (r, i, c, parent) => {
    if (typeof r !== 'string' || !!(parent as RhythmObject<string>).chord) {
      return r; // no chord symbol or already part of a voicing
    }
    const voicing = getBestVoicing(r, dictionary, range, sorter, lastVoicing);
    lastVoicing = [...voicing];
    return {
      chord: r, // prevent infinite loop
      parallel: voicing,
    };
  })
}

export const voicingFactory = (dictionary, range = ['D3', 'A4'], sorter = topNoteDiff) => (tree) => generateVoicings(tree, dictionary, range, sorter);

export const lefthandVoicings = voicingFactory(lefthand);
export const guideToneVoicings = voicingFactory(guidetones);


// NEW SHIT


// EXPERIMENTAL SECTION


// this function is just an imagined implementation
/* export function generateVoicingsImmutable(tree: RhythmNode<string>, dictionary, range, sorter = topNoteDiff) {
  return editRhythmImmutable(tree, { lastVoicing: [] },
    (chord, { parent, lastVoicing }) => {
      if (typeof chord !== 'string' || !!parent?.chord) {
        return chord; // no chord symbol or already part of a voicing
      }
      const voicing = getBestVoicing(chord, dictionary, range, sorter, lastVoicing);
      lastVoicing = [...voicing];
      return {
        chord, // prevent infinite loop
        parallel: voicing,
      };
    })
} */
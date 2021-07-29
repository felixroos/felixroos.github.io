/* 
export function generateVoicings(tree: RhythmNode<string>, dictionary, range, sorter = topNoteDiff) {
  let lastVoicing = [];
  return editRhythm(tree, (r, path, parent) => {
    if (typeof r !== 'string' || !!parent.chord) {
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


test('chordVoicings',()=>{

}) */
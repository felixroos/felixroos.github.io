
export declare type VoicingDictionary = {
  [symbol: string]: string[]
}

export declare interface Voicing {
  search(chord: string, range?: string[], dictionary?: VoicingDictionary): string[][],
  get(chord: string, range: string[], dictionary: VoicingDictionary, voiceLeading: VoiceLeading, lastVoicing?: string[]): string[],
  analyze(voicing: string[]): {
    topNote: string,
    bottomNote: string,
    midiAverage: number
  }
  analyzeTransition(from: string[], to: string[]): {
    topNoteDiff: number,
    bottomNoteDiff: number,
    movement: number
  }
  intervalSets(chordSymbol: string, dictionary: VoicingDictionary)
  searchSets(intervalSets: string[][], range: string[], root: string)
  enharmonicEquivalent(note: string, pitchClass: string): string
}

export declare interface VoiceLeading {
  [name: string]: (lastVoicing: string[], voicings: string[][]) => string[]
}

import { PcSet, Scale } from '@tonaljs/tonal';

// get chroma for given scale => respects root (Scale.get().chroma does not)
export default (scale) => PcSet.get(Scale.get(scale).notes).chroma;
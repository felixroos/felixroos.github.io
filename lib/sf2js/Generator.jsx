// http://www.synthfont.com/SFSPEC21.PDF page 38
export const generators = {
  0: 'startAddrOffset',
  1: 'endAddrOffset',
  2: 'startloopAddrsOffset',
  3: 'endloopAddrsOffset',
  4: 'startAddrsCoarseOffset',
  5: 'modLfoToPitch',
  6: 'vibLfoToPitch',
  7: 'modEnvToPitch',
  8: 'initialFilterFc',
  9: 'initialFilterQ',
  10: 'modLfoToFilterFc',
  11: 'modEnvToFilterFc',
  12: 'endAddrsCoarseOffset',
  13: 'modLfoToVolume',
  14: 'unused1',
  15: 'chorusEffectsSend',
  16: 'reverbEffectsSend',
  17: 'pan',
  18: 'unused2',
  19: 'unused3',
  20: 'unused4',
  21: 'delayModLFO',
  22: 'freqModLFO',
  23: 'delayVibLFO',
  24: 'freqVibLFO',
  25: 'delayModEnv',
  26: 'attackModEnv',
  27: 'holdModEnv',
  28: 'decayModEnv',
  29: 'sustainModEnv',
  30: 'releaseModEnv',
  31: 'keyNumToModEnvHold',
  32: 'keyNumToModEnvDecay',
  33: 'delayVolEnv',
  34: 'attackVolEnv',
  35: 'holdVolEnv',
  36: 'decayVolEnv',
  37: 'sustainVolEnv',
  38: 'releaseVolEnv',
  39: 'keyNumToVolEnvHold',
  40: 'keyNumToVolEnvDecay',
  41: 'instrument',
  42: 'reserved1',
  43: 'keyRange',
  44: 'velRange',
  45: 'startloopAddrsCoarseOffset',
  46: 'keyNum',
  47: 'velocity',
  48: 'initialAttenuation',
  49: 'reserved2',
  50: 'endloopAddrsCoarseOffset',
  51: 'coarseTune',
  52: 'fineTune',
  53: 'sampleID',
  54: 'sampleModes',
  55: 'reserved3',
  56: 'scaleTuning',
  57: 'exclusiveClass',
  58: 'overridingRootKey',
  59: 'unused5',
  60: 'endOper',
};

function Generator({ entry }) {
  const [key, value] = entry;
  const name = generators[key];
  /*   if (name === 'sampleID') {
    return null;
  } */
  let valueStr;
  if (['keyRange', 'velRange'].includes(name)) {
    valueStr = `${name}: ${value.range.lo} - ${value.range.hi}`;
  } else {
    valueStr = `${name}: ${value.amount}`;
  }
  return (
    <div className="bg-slate-200 text-black text-xs rounded-md whitespace-nowrap px-1 mr-1 mb-1">
      {valueStr}
    </div>
  );
}
export default Generator;
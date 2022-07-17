import { SoundFont2 } from 'soundfont2';

export async function loadSoundfont(url) {
  // load some sf2 file into an array buffer:
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  // convert buffer to Uint8Array:
  const data = new Uint8Array(buffer);
  // parse the sf2 file:
  // return new SoundFont2(data);
  return new SoundFont2(data);
}

export function applyOptions(ctx, source, options) {
  const {
    start,
    startLoop,
    endLoop,
    sampleRate,
    originalPitch,
    pitchCorrection,
    midi,
    type,
    sampleModes = 0,
    overridingRootKey,
    fineTune = 0,
    ...rest
  } = options;
  // console.log('options', options);
  const rootKey =
    overridingRootKey !== undefined && overridingRootKey !== -1
      ? overridingRootKey
      : originalPitch;

  // const baseDetune = 100 * rootKey + pitchCorrection - fineTune;
  const baseDetune = 100 * rootKey + pitchCorrection - fineTune;
  const cents = midi * 100 - baseDetune;
  /*   console.log('baseDetune', baseDetune);
  console.log('originalPitch', originalPitch);
  console.log('pitchCorrection', pitchCorrection);
  console.log('fineTune', fineTune);
  console.log('midi', midi);
  console.log('cents', cents); */
  const playbackRate = 1.0 * Math.pow(2, cents / 1200);
  source.playbackRate.value = playbackRate;
  const loopStart = startLoop; // - start;
  const loopEnd = endLoop; // - start;
  if (loopEnd > loopStart && sampleModes === 1) {
    source.loopStart = loopStart / sampleRate;
    source.loopEnd = loopEnd / sampleRate;
    source.loop = true;
  } else if (sampleModes === 3) {
    console.warn('unimplemented sampleMode 3 (play till end on note off)');
  }
  // type === sampleModes ?
  const unimplemented = Object.keys(rest).filter(
    (k) => !['name', 'instrument', 'keyRange', 'sampleID', 'end'].includes(k)
  );
  if (unimplemented.length) {
    console.warn(
      'unimplemented options:',
      Object.fromEntries(unimplemented.map((key) => [key, rest[key]]))
    );
  }
  return source;
}

export function getBufferSourceFromSample(ctx, sample, midi, options = {}) {
  const { header, data: int16 } = sample;
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    // scale Int16Array between -1 and 1
    float32[i] = int16[i] / 32768;
  }
  const buffer = ctx.createBuffer(1, float32.length, header.sampleRate);
  const channelData = buffer.getChannelData(0);
  channelData.set(float32);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  options = { ...header, ...options, midi }; // merge sample header and options
  applyOptions(ctx, source, options);
  return source;
}

export const startSample = (
  ctx,
  sample,
  pitch,
  time = ctx.currentTime,
  options
) => {
  let source = getBufferSourceFromSample(ctx, sample, pitch, options);
  let gain = ctx.createGain();
  gain.connect(ctx.destination);
  source.connect(gain);
  source.start(time);
  return () => {
    if (!gain || !source) {
      // already stopped / not started
      return;
    }
    const end = ctx.currentTime + 0.1;
    gain.gain.linearRampToValueAtTime(0, end);
    source.stop(end);
    source = undefined;
    gain = undefined;
  };
};

export function readableGenerators(unreadable) {
  return Object.fromEntries(
    Object.entries(unreadable).map(([key, value]) => {
      const name = generators[key];
      if (['keyRange', 'velRange'].includes(name)) {
        return [name, value.range];
      }
      return [name, value.value];
    })
  );
}

export const getActiveZones = (preset, midi) => {
  // console.log('preset', preset);
  const isActiveZone = (zone) =>
    !zone.keyRange || (zone.keyRange.lo <= midi && midi <= zone.keyRange.hi);
  const activeZones = preset.zones
    .filter((pzone) => isActiveZone(pzone) && pzone.instrument)
    .map((pzone) =>
      pzone.instrument.zones
        .filter((izone) => isActiveZone(izone))
        .map((izone) => ({
          ...izone,
          presetZoneGenerators: pzone.generators,
          instrumentZoneGenerators: izone.generators,
          presetZone: pzone,
          mergedGenerators: readableGenerators({
            ...(preset.globalZone?.generators || {}),
            ...pzone.generators,
            ...(pzone.instrument.globalZone?.generators || {}),
            ...izone.generators,
          }),
        }))
    )
    .flat();
  // console.log('activeZones', activeZones);
  return activeZones;
};

export const startPresetNote = (ctx, preset, midi, time = ctx.currentTime) => {
  const zones = getActiveZones(preset, midi);
  // console.log('start zones', zones);
  const sources = zones.map((zone) =>
    getBufferSourceFromSample(ctx, zone.sample, midi, zone.mergedGenerators)
  );
  let gain = ctx.createGain();
  gain.gain.value = 0.5;
  gain.connect(ctx.destination);
  sources.forEach((source) => {
    source.connect(gain);
    source.start(time);
  });
  // console.log('sources', sources);
  return () => {
    const end = ctx.currentTime + 0.1;
    gain.gain.linearRampToValueAtTime(0, end);
    sources.forEach((source) => {
      source.stop(end);
      source = undefined;
    });
    gain = undefined;
    // console.log('stop zones', zones);
  };
};

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

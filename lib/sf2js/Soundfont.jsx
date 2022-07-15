import { useRef } from 'react';
import { startSample } from './sf2js';
import useSoundfont from './useSoundfont';
import useAudioContext from '../useAudioContext';

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

function SampleButton({ sample }) {
  const ctx = useAudioContext();
  const stopHandle = useRef();
  return (
    <button
      className="text-white bg-sky-600 border-2 border-sky-800  p-2 m-1 rounded-md"
      onMouseDown={() => {
        console.log('sample', sample);
        stopHandle.current = startSample(ctx, sample, 48);
      }}
      onMouseUp={() => stopHandle.current?.()}
      onMouseOut={() => stopHandle.current?.()}
    >
      {sample.header.name}
    </button>
  );
}

function Instrument({ instrument }) {
  return (
    <div className="bg-lime-600 border-2 border-lime-800 text-white rounded-lg m-1 p-1">
      <span>
        #{instrument.header.bagIndex} {instrument.header.name}
      </span>
      <div className="space-y-1">
        {instrument.zones.map((zone, j) => {
          return (
            <div
              key={j}
              className="border border-lime-800 p-1 rounded-lg flex justify-between items-start"
            >
              {/*!!Object.keys(zone.modulators).length && (
                <div>modulators: {JSON.stringify(zone.modulators)}</div>
              )*/}
              <div className="flex flex-wrap items-center">
                {Object.entries(zone.generators).map((entry, k) => (
                  <Generator entry={entry} key={k} />
                ))}
              </div>
              <SampleButton sample={zone.sample} />
            </div>
          );
        })}
      </div>
    </div>
  );
}

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

function Soundfont({ url, type, slice }) {
  const { font } = useSoundfont(url);
  if (type === 'sample') {
    return (
      <div>
        {font?.samples
          ?.filter((sample) => sample.data.length > 0)
          ?.map((sample, i) => (
            <SampleButton sample={sample} key={i} />
          ))}
      </div>
    );
  }
  if (type === 'instrument') {
    /* const generatorKeys = font?.instruments
      .reduce((acc, instrument) => {
        return acc.concat(
          instrument.zones.map((zone) => Object.keys(zone.generators)).flat()
        );
      }, [])
      .flat()
      .filter((k, i, a) => a.indexOf(k) === i)
      .map((k) => parseInt(k))
      .sort((a, b) => a - b);
    console.log('generatorKeys', generatorKeys); */
    return (
      <div
        style={{ maxHeight: '600px', overflow: 'auto' }}
        className="border border-white p-2 rounded-lg"
      >
        {font?.instruments?.map((instrument, i) => (
          <Instrument instrument={instrument} key={i} />
        ))}
      </div>
    );
  }
  if (type === 'preset') {
    // console.log('font', font);
    let presets = font?.presets;
    if (slice) {
      presets = presets?.slice(0, slice);
    }
    return (
      <div>
        {presets?.map((preset, i) => (
          <div
            key={i}
            className="bg-violet-500 border-2 border-violet-900 text-white rounded-lg m-1 p-1"
          >
            <div className="flex justify-between">
              <span>
                #{preset.header.bagIndex} {preset.header.name}
              </span>
              <small>
                bank: {preset.header.bank}, preset: {preset.header.preset},
                library: {preset.header.library}, genre: {preset.header.genre},
                morphology: {preset.header.morphology}
              </small>
            </div>
            {preset.zones.map((zone, j) => (
              <div
                key={j}
                className="border border-violet-900 p-1 rounded-lg flex-col mb-1"
              >
                <div className="flex flex-wrap items-center">
                  {Object.entries(zone.generators).map((generator, k) => (
                    <Generator entry={generator} key={k} />
                  ))}
                </div>
                <Instrument instrument={zone.instrument} key={j} />
              </div>
            ))}
          </div>
        ))}
      </div>
    );
  }

  return null;
}

export default Soundfont;

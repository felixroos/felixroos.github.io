import { useState, useRef } from 'react';
import useAudioContext from '../useAudioContext';
import Instrument from './Instrument';
import KeySelect from './KeySelect';
import Preset from './Preset';
import SampleButton from './SampleButton';
import useSoundfont from './useSoundfont';
import { toMidi } from './util';
import { getActiveZones, startPresetNote, startSample } from './sf2js';

function Soundfont({ url, type, slice }) {
  const { font } = useSoundfont(url);
  const ctx = useAudioContext();
  const stopHandle = useRef();
  const [presetIndex, setPresetIndex] = useState(0);
  const [selectedKey, setSelectedKey] = useState();
  if (type === 'sample') {
    return (
      <div>
        {font?.samples
          ?.filter((sample) => sample.data.length > 0)
          ?.map((sample, i) => (
            <SampleButton
              sample={sample}
              key={i}
              ctx={ctx}
              options={{ sampleModes: 1 }}
            />
          ))}
      </div>
    );
  }
  if (type === 'instrument') {
    return (
      <div
        style={{ maxHeight: '600px', overflow: 'auto' }}
        className="border border-white p-2 rounded-lg"
      >
        {font?.instruments?.map((instrument, i) => (
          <Instrument instrument={instrument} key={i} ctx={ctx} />
        ))}
      </div>
    );
  }
  let presets = font?.presets.sort((a, b) => {
    if (a.header.bank === b.header.bank) {
      return a.header.preset - b.header.preset;
    }
    return a.header.bank - b.header.bank;
  });
  // console.log('font', font);
  if (slice) {
    presets = presets?.slice(0, slice);
  }
  if (type === 'preset') {
    return (
      <div>
        {presets?.map((preset, i) => (
          <Preset key={i} preset={preset} ctx={ctx} />
        ))}
      </div>
    );
  }
  if (type === 'preset-select') {
    return (
      <>
        <KeySelect
          onChange={(keys) => setSelectedKey(keys[0])}
          onNoteOn={(key) => {
            console.log('note on', key);
            const midi = toMidi(key);
            stopHandle.current = startPresetNote(
              ctx,
              presets[presetIndex],
              midi
            );
          }}
          onNoteOff={(key) => {
            console.log('note off', key);
            stopHandle.current?.();
          }}
        />
        <select
          className="border border-white p-2 rounded-lg text-black"
          value={presetIndex}
          onChange={(e) => {
            const index = e.target.value;
            console.log('preset', presets[index]);
            setPresetIndex(index);
          }}
        >
          {presets?.map((preset, i) => (
            <option key={i} value={i}>
              {preset.header.name}
            </option>
          ))}
        </select>
        {presets && presetIndex !== undefined && (
          <Preset
            preset={presets[presetIndex]}
            ctx={ctx}
            activeKey={selectedKey}
          />
        )}
      </>
    );
  }

  return null;
}

export default Soundfont;

import Generator from './Generator';
import Instrument from './Instrument';
import { toMidi } from './util';

function Preset({ preset, ctx, activeKey }) {
  const midi = activeKey ? toMidi(activeKey) : undefined;
  return (
    <div className="bg-violet-500 border-2 border-violet-900 text-white rounded-lg m-1 p-1">
      <div className="flex justify-between">
        <span>
          {/* #{preset.header.bagIndex}  */}
          {preset.header.name}
        </span>
        <small>
          bank: {preset.header.bank}, preset: {preset.header.preset}, library:{' '}
          {preset.header.library}, genre: {preset.header.genre}, morphology:{' '}
          {preset.header.morphology}
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
          {zone.instrument && (
            <Instrument
              instrument={zone.instrument}
              key={j}
              ctx={ctx}
              midi={midi}
            />
          )}
        </div>
      ))}
    </div>
  );
}

export default Preset;

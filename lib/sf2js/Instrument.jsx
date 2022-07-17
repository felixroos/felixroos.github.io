import SampleButton from './SampleButton';
import Generator from './Generator';
import { classNames } from '../../components/layout/classNames';
import { readableGenerators } from './sf2js';

const isZoneActive = (zone, midi) => {
  return (
    midi === undefined ||
    !zone.keyRange ||
    (zone.keyRange.lo <= midi && midi <= zone.keyRange.hi)
  );
};

function Instrument({ instrument, ctx, midi }) {
  return (
    <div className="bg-lime-500 border-2 border-lime-700 text-slate-700 rounded-lg m-1 p-1">
      <span>
        {/* #{instrument.header.bagIndex}  */}
        {instrument.header.name}
      </span>
      {instrument.globalZone && (
        <div className="flex flex-wrap items-center">
          {Object.entries(instrument.globalZone.generators).map((entry, k) => (
            <Generator entry={entry} key={k} />
          ))}
        </div>
      )}
      <div className="space-y-1">
        {instrument.zones.map((zone, j) => {
          return (
            <div
              key={j}
              className={classNames(
                'border border-lime-800 p-1 rounded-lg flex justify-between items-start',
                !isZoneActive(zone, midi) && 'opacity-20'
              )}
            >
              {/*!!Object.keys(zone.modulators).length && (
                <div>modulators: {JSON.stringify(zone.modulators)}</div>
              )*/}
              <div className="flex flex-wrap items-center">
                {Object.entries(zone.generators).map((entry, k) => (
                  <Generator entry={entry} key={k} />
                ))}
              </div>
              {zone.sample && (
                <SampleButton
                  sample={zone.sample}
                  ctx={ctx}
                  options={readableGenerators(zone.generators)}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default Instrument;

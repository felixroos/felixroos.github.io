import { generators } from './sf2js';

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
    valueStr = `${name}: ${value.value}`;
  }
  return (
    <div className="bg-slate-200 text-black text-xs rounded-md whitespace-nowrap px-1 mr-1 mb-1">
      {valueStr}
    </div>
  );
}
export default Generator;

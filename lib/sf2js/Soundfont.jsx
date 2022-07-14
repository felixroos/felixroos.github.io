import { useRef } from 'react';
import { startSample } from './sf2js';
import useSoundfont from './useSoundfont';
import useAudioContext from '../useAudioContext';

function Soundfont({ url }) {
  const { font } = useSoundfont(url);
  const ctx = useAudioContext();
  const stopHandle = useRef();
  return (
    <div>
      {font?.samples
        ?.filter((sample) => sample.data.length > 0)
        ?.map((sample, i) => (
          <button
            className="text-gray-900 bg-slate-200 dark:bg-slate-700 dark:text-white  p-2 m-1 rounded-md"
            key={i}
            onMouseDown={() => {
              console.log('sample', sample);
              stopHandle.current = startSample(ctx, sample, 48);
            }}
            onMouseUp={() => stopHandle.current?.()}
            onMouseOut={() => stopHandle.current?.()}
          >
            {sample.header.name}
          </button>
        ))}
    </div>
  );
}

export default Soundfont;

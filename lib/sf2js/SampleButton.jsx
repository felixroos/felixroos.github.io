import { useRef } from 'react';
import { startSample } from './sf2js';

function SampleButton({ sample, ctx }) {
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

export default SampleButton;

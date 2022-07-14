import { useRef, useEffect, useState } from 'react';

function useAudioContext() {
  const [ctx, setCtx] = useState<any>();
  useEffect(() => {
    setCtx(new AudioContext());
  }, []);

  return ctx;
}

export default useAudioContext;

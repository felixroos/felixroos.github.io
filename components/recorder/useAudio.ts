import { useState, useEffect } from 'react';

export function useAudio(_audio?) {
  const [audio, setAudio] = useState<HTMLAudioElement | undefined>(_audio);
  const [state, setState] = useState('pause');
  useEffect(() => {
    if (audio) {
      const states = ['playing', 'play', 'pause'];
      states.forEach(_state => audio.addEventListener(_state, () => setState(_state)))
      return () => states.forEach((_state,) => audio.removeEventListener(_state, null));
    }
  }, [audio])
  return { audio, setAudio, state }
}
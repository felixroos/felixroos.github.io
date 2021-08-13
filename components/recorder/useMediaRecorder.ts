import { useState, useRef } from 'react';
import canUseDOM from '../canUseDOM';

import { useUserMedia } from './useUserMedia';

const MediaRecorder = canUseDOM() ? window?.['MediaRecorder'] as any : undefined; // for ts

export function useMediaRecorder({ onStart, onStop, onData }: { onStart?: any, onStop?: any, onData?: any }) {
  const [recorder, setRecorder] = useState<any>();
  const [state, setState] = useState<string>('inactive');
  const { getStream } = useUserMedia({ audio: true, video: false });
  const audioChunks = useRef([]); // this will contain the recorded chunks
  async function start(timeslices?, _stream?) {
    const stream = _stream || await getStream(true); // request stream using our custom hook
    audioChunks.current = [];
    const _recorder = new MediaRecorder(stream);
    onStart && onStart(_recorder);
    _recorder.start(timeslices); // start recording with timeslices
    setRecorder(_recorder);
    setState(_recorder.state);
    // called every timeslices (ms)
    _recorder.addEventListener('dataavailable', (event) => {
      audioChunks.current.push(event.data);
      onData && onData(event, audioChunks.current);
    });
    _recorder.addEventListener('stop', () => {
      onStop && onStop(audioChunks.current);
      setState(_recorder.state);
    });
  }
  async function stop() {
    if (recorder) {
      recorder.stop();
      (await getStream()).getTracks().forEach(track => track.stop());
    }
  }
  return { start, stop, state };
}

import { useState } from 'react';

export function useUserMedia(constraints) {
  const [stream, setStream] = useState<MediaStream | undefined>();
  function getStream(refresh = false) {
    if (stream && !refresh) {
      return stream;
    }
    return navigator.mediaDevices.getUserMedia(constraints).then((_stream) => {
      setStream(_stream);
      return _stream;
    });
  }
  return { stream, getStream };
}

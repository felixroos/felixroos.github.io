import React, { useState } from 'react';
import canUseDOM from '../canUseDOM';
import { Waveform } from './Waveform';
import { useMediaRecorder } from './useMediaRecorder';
import Fab from '@material-ui/core/Fab';
import StopIcon from '@material-ui/icons/Stop';
import MicIcon from '@material-ui/icons/Mic';
import PlayArrowIcon from '@material-ui/icons/PlayArrow';
import BackspaceIcon from '@material-ui/icons/Backspace';
import { useAudio } from './useAudio';

export const Recorder = ({ hideWaveform }: { hideWaveform?: boolean }) => {
  const [pcm, setPcm] = useState<Float32Array | undefined>();
  const { audio, setAudio, state: audioState } = useAudio();

  const { start, stop, state } = useMediaRecorder({
    onStop: async (audioChunks) => {
      const audioBlob = new Blob(audioChunks);
      setPcm(await getPCM(audioBlob));
      const audioUrl = URL.createObjectURL(audioBlob);
      const _audio = new Audio(audioUrl);
      setAudio(_audio);
    },
    onData: async (_, audioChunks) => {
      const audioBlob = new Blob(audioChunks);
      setPcm(await getPCM(audioBlob));
    },
  });
  return (
    <React.Fragment>
      {state === 'inactive' && !audio && (
        <Fab color="primary" onClick={() => start(200)}>
          <MicIcon />
        </Fab>
      )}
      {state === 'recording' && (
        <Fab color="primary" onClick={() => stop()}>
          <StopIcon />
        </Fab>
      )}
      {audio && audioState === 'pause' && (
        <Fab color="primary" onClick={() => audio.play()}>
          <PlayArrowIcon />
        </Fab>
      )}
      {audio && audioState !== 'pause' && (
        <Fab
          color="primary"
          onClick={() => {
            audio.pause();
            audio.currentTime = 0;
          }}
        >
          <StopIcon />
        </Fab>
      )}
      {audio && (
        <Fab
          color="primary"
          onClick={() => {
            audio?.pause();
            setAudio(undefined);
            setPcm(undefined);
          }}
          style={{ marginLeft: 10 }}
        >
          <BackspaceIcon />
        </Fab>
      )}
      <br />
      <br />
      {pcm && !hideWaveform && <Waveform pcm={pcm} />}
    </React.Fragment>
  );
};

const audioContext = canUseDOM() ? new AudioContext() : null;

function getPCM(blob): Promise<Float32Array> {
  return new Promise((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.onloadend = () => {
      const arrayBuffer = fileReader.result as ArrayBuffer;
      // Convert array buffer into audio buffer
      audioContext?.decodeAudioData(arrayBuffer, (audioBuffer) => {
        // Do something with audioBuffer
        const pcm = audioBuffer.getChannelData(0);
        resolve(pcm);
      });
    };
    fileReader.onerror = reject;
    fileReader.readAsArrayBuffer(blob);
  });
}

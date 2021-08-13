import { useEffect, useState } from 'react';
import WebMidi from 'webmidi';
import enableWebMidi from './enableWebMidi';

export default function useWebMidi({ ready, connected, disconnected }: any) {
  const [loading, setLoading] = useState(true);
  const [outputs, setOutputs] = useState<any[]>(WebMidi?.outputs || []);
  useEffect(() => {
    enableWebMidi().then(() => {
      // Reacting when a new device becomes available
      WebMidi.addListener('connected', (e) => {
        setOutputs([...WebMidi.outputs]);
        connected?.(WebMidi, e);
      });

      // Reacting when a device becomes unavailable
      WebMidi.addListener('disconnected', (e) => {
        setOutputs([...WebMidi.outputs]);
        disconnected?.(WebMidi, e);
      });
      ready?.(WebMidi);
      setLoading(false);
    }).catch(err => {
      //throw new Error("Web Midi could not be enabled...");
      console.warn('Web Midi could not be enabled..');
      return;
    });
  }, [ready, connected, disconnected/* , outputs */]);
  const outputByName = (name) => WebMidi.getOutputByName(name);
  return { loading, outputs, outputByName };
}

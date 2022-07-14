import { useState, useEffect } from 'react';
import { loadSoundfont } from './sf2js';

function useSoundfont(url) {
  const [font, setFont] = useState(null);
  useEffect(() => {
    let skip = false;
    loadSoundfont(url).then((f) => !skip && setFont(f));
    return () => {
      skip = true;
    };
  }, [url]);
  return { font };
}
export default useSoundfont;

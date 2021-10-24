import { useEffect, useState } from 'react';

function usePropState(propValue) {
  const [state, setState] = useState(propValue);
  useEffect(() => {
    setState(propValue);
  }, [propValue]);
  return [state, setState];
}

export default usePropState;

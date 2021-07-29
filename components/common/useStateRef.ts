import { useRef, useState, useCallback } from 'react';

// just like https://www.npmjs.com/package/react-usestateref but with the ref as first element

export default function useStateRef(initialValue): any {
  const [state, setState] = useState<any>(initialValue);
  const ref = useRef<any>(state);
  const dispatch = useCallback((value) => {
    ref.current = typeof value === "function" ?
      value(ref.current) : value;
    setState(ref.current);
  }, []);
  return [ref, dispatch, state];
}
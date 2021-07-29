import React, { useState, useRef, useEffect } from "react";

export function useGenerator(init, autostart = true, loop = true) {
  const [state, setState] = useState<any>();
  const [previous, setPrevious] = useState<any>();

  const generator = useRef<any>();
  useEffect(() => {
    if (!state || (loop && state?.done)) {
      generator.current = init();
      if (autostart) {
        setState(generator.current.next());
      } else {
        setState(generator.current);
      }
    }
  }, [state]);
  function next() {
    setPrevious({ ...state });
    const _state = generator.current?.next();
    setState(_state);
    return _state;
  }
  function reset() {
    setPrevious(undefined);
    setState(undefined);
  }
  return [state, next, reset, previous];
}

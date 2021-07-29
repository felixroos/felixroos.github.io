import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { useGenerator } from './useGenerator';

export default function GeneratorStepper({ init, onChange, hideFinish }: any) {
  const [state, nextValue, resetGenerator, previous] = useGenerator(init, true, false);
  useEffect(() => {
    onChange(state?.value, previous?.value);
  }, [state?.value]);
  function finish() {
    let p = state;
    let count = 0;
    while (!p.done) {
      p = nextValue();
      ++count;
    }
    console.log('took', count, 'steps');
  }
  return (
    <>
      <Button color="primary" onClick={() => !state?.done && nextValue()}>
        {state?.done ? 'done' : 'step'}
      </Button>
      <Button color="primary" onClick={() => resetGenerator()}>
        reset
      </Button>
      {!hideFinish && (
        <Button color="primary" onClick={() => finish()}>
          finish
        </Button>
      )}
    </>
  );
}

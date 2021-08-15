import { Button } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import canUseDOM from '../canUseDOM';

const audioContext = canUseDOM() ? new AudioContext() : null;

export default function AudioWorklet({ src, name, output, params }) {
  const [workletNode, setWorkletNode] = useState<any>();

  useEffect(() => {
    applyParams(params, workletNode);
  }, [params, workletNode]);

  async function start() {
    audioContext.resume();
    try {
      await audioContext.audioWorklet.addModule(src);
      const _workletNode = new AudioWorkletNode(audioContext, name);
      _workletNode.connect(output || audioContext.destination);
      setWorkletNode(_workletNode);
    } catch (error) {
      console.log('error', error);
    }
  }
  function stop() {
    workletNode?.disconnect();
    setWorkletNode(null);
  }
  const button = !workletNode ? (
    <Button color="primary" onClick={() => start()}>
      start
    </Button>
  ) : (
    <Button color="primary" onClick={() => stop()}>
      stop
    </Button>
  );

  return button;
}

function applyParams(params, node) {
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      const param = node?.parameters?.get(key);
      if (param) {
        param.value = value;
      }
    });
  }
}

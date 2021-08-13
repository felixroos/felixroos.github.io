import React, { useEffect, useState } from 'react';

export function Waveform({ pcm, playhead }: { pcm?: Float32Array; playhead?: any }) {
  const [canvasRef, setCanvasRef] = useState<HTMLCanvasElement | undefined>();

  useEffect(() => {
    if (pcm && canvasRef) {
      drawPCM(pcm, canvasRef, playhead);
    }
  }, [pcm, canvasRef, playhead]);

  function prettyCanvas(width, height, style) {
    return {
      width: width * 2,
      height: height * 2,
      style: { width, height, ...style },
    };
  }
  return <canvas ref={setCanvasRef} {...prettyCanvas(640, 200, { /* backgroundColor: '#BFBFBF' */ })} />;
}

function drawPCM(values, canvas, playhead) {
  const ctx = canvas.getContext('2d');
  let { width: clientWidth, height: clientHeight } = canvas;
  canvas.width = clientWidth;
  const scale = 2;
  ctx.scale(scale, scale);
  clientWidth /= scale; // scale down for pretty canvas
  clientHeight /= scale;
  const absoluteValues = true; // if false, we will retain the true waveform
  const valuesPerPixel = values.length / clientWidth;
  const blockSize = 1; // width of one sample block
  let max = 0;
  const averageValues = [];
  for (let x = 0; x < clientWidth; x += blockSize) {
    const area = values.slice(Math.floor(x * valuesPerPixel), Math.ceil((x + blockSize) * valuesPerPixel));
    const areaReducer = absoluteValues ? (sum, v) => sum + Math.abs(v) : (sum, v) => sum + v;
    const value = area.reduce(areaReducer, 0) / area.length;
    max = max < value ? value : max;
    averageValues.push(value);
  }
  averageValues.forEach((value, index) => {
    const height = (((value / max) * clientHeight) / 2) * 0.9;
    ctx.beginPath();
    ctx.strokeStyle = `#2D2F37`;
    ctx.fillStyle = `#4752B1`;
    const args = [index * blockSize, clientHeight / 2 - (absoluteValues ? height / 2 : 0), blockSize, height];
    const borderRadius = Math.floor(Math.min(args[2], args[3]) / 2);
    ctx.fillRect(index * blockSize, clientHeight / 2 - (absoluteValues ? height / 2 : 0), blockSize, height);
    ctx.stroke();
  });
  if (playhead) {
    ctx.beginPath();
    const x = playhead * clientWidth;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, clientHeight);
    ctx.stroke();
  }
}

import { scaleLinear } from 'd3-scale';
import { useRef } from 'react';
import canUseDOM from '../canUseDOM';
import useFrame from '../common/useFrame';

export function draw(canvas: HTMLCanvasElement, callback) {
  // const canvas = document.getElementById(canvasID) as HTMLCanvasElement;
  const context = canvas.getContext('2d');
  const w = canvas.clientWidth;
  const h = canvas.clientHeight;
  context.clearRect(0, 0, w, h);
  callback(context, w, h);
}

function work(n) {
  const start = performance.now();
  let a = [];
  for (let i = 0; i < n; i++) {
    a = [...a].sort().concat(Math.sin(i));
  }
  const took = performance.now() - start;
  console.log(`n iterations took ${took.toFixed(2)}ms`);
}

const ctx = canUseDOM() && new AudioContext();

function beep(t = ctx.currentTime + 0.01, duration = 0.1, frequency = 440) {
  const o = ctx.createOscillator();
  o.frequency.value = frequency;
  o.connect(ctx.destination);
  o.start(t);
  o.stop(t + duration);
}

export function IntervalPlot({ overlap = 0, period = 0.5, hideOutput }) {
  const intervalRef = useRef<any>();
  const times = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>();
  const maxSeconds = 4;
  const maxBars = maxSeconds / period + 1;
  const frame = useFrame(() => {
    draw(canvasRef.current, (context, w, h) => {
      const timeRange = [ctx.currentTime - maxSeconds, ctx.currentTime];
      const x = scaleLinear().domain(timeRange).range([0, w]);
      const slice = h / maxBars;
      const y = scaleLinear()
        .domain([times.current.length, times.current.length - maxBars])
        .range([0, h + 1]);
      const width = (seconds) => w - x(ctx.currentTime - seconds);
      let phase = times.current[0];
      times.current.forEach((start, i) => {
        context.strokeStyle = 'transparent';
        const next = times.current[i + 1] || ctx.currentTime;
        const last = times.current[i - 1] || start - period - overlap;
        const lastEnd = Math.max(last + period + overlap, start);
        const px = x(start);
        const py = y(i);
        const end = start + period + overlap;
        if (end < next) {
          const uncovered = next - end;
          context.fillStyle = 'darkred';
          context.fillRect(x(end), py, width(uncovered), slice);
        }
        context.strokeStyle = 'darkgray';
        context.strokeRect(px, py, width(period + overlap), slice);
        context.strokeStyle = 'darkgray';
        context.beginPath();
        context.moveTo(px, 0);
        context.lineTo(px, py);
        context.stroke();
        if (!hideOutput) {
          context.fillStyle = 'darkseagreen';
          context.fillRect(x(lastEnd), py, width(end - lastEnd), slice);
          while (phase < end) {
            context.strokeStyle = phase >= start ? 'darkseagreen' : 'darkred';
            context.beginPath();
            context.moveTo(x(phase), py + slice);
            context.lineTo(x(phase), h);
            context.stroke();
            phase += period;
          }
        }
        context.strokeStyle = 'black';
        context.beginPath();
        context.moveTo(x(ctx.currentTime), 0);
        context.lineTo(x(ctx.currentTime), h);
        context.stroke();
      });
    });
  });
  return (
    <>
      <button
        className="text-white bg-sky-600 border-2 border-sky-800 p-2 m-1 rounded-md"
        onClick={() => {
          frame.start();
          let phase;
          let minLatency = 0.01;
          intervalRef.current && clearInterval(intervalRef.current);
          intervalRef.current = setInterval(() => {
            times.current.push(ctx.currentTime);
            phase = phase || ctx.currentTime;
            while (phase < ctx.currentTime + period + overlap) {
              phase >= ctx.currentTime &&
                beep(phase + minLatency, period * 0.5);
              phase += period;
            }
          }, period * 1000);
        }}
      >
        <span>play</span>
      </button>
      <button
        className="text-white bg-sky-600 border-2 border-sky-800 p-2 m-1 rounded-md"
        onClick={() => {
          clearInterval(intervalRef.current);
          frame.stop();
        }}
      >
        <span>stop</span>
      </button>
      <button
        className="text-white bg-sky-600 border-2 border-sky-800 p-2 m-1 rounded-md"
        onClick={() => work(2000)}
      >
        <span>do light work</span>
      </button>
      <button
        className="text-white bg-sky-600 border-2 border-sky-800 p-2 m-1 rounded-md"
        onClick={() => work(3000)}
      >
        <span>do hard work</span>
      </button>
      <canvas height="400" width="600" ref={canvasRef} />
    </>
  );
}

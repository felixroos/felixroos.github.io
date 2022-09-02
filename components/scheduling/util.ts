import { scaleLinear } from 'd3-scale';
import { useRef } from 'react';
import useFrame from '../common/useFrame';
import canUseDOM from '../canUseDOM';

export function draw(canvas: HTMLCanvasElement, callback) {
  const w = Math.round(canvas.clientWidth);
  const h = Math.round(canvas.clientHeight);
  canvas.width = w;
  canvas.height = h;
  const context = canvas.getContext('2d');
  context.clearRect(0, 0, w, h);
  callback(context, w, h);
}

export function work(n) {
  const start = performance.now();
  let a = [];
  for (let i = 0; i < n; i++) {
    a = [...a].sort().concat(Math.sin(i));
  }
  const took = performance.now() - start;
  console.log(`n iterations took ${took.toFixed(2)}ms`);
}

export const ctx = canUseDOM() && new AudioContext();

export function beep(
  t = ctx.currentTime + 0.01,
  duration = 0.1,
  frequency = 440
) {
  const o = ctx.createOscillator();
  o.frequency.value = frequency;
  o.connect(ctx.destination);
  o.start(t);
  o.stop(t + duration);
}

export function usePlot({
  overlap = 0,
  period = 0.5,
  interval,
  hideOutput,
  onFrame,
}: any) {
  interval = interval || period;
  const times = useRef<number[]>([]);
  const canvasRef = useRef<HTMLCanvasElement>();
  const maxSeconds = 4;
  const maxBars = maxSeconds / interval + 1;
  const frame = useFrame(() => {
    onFrame?.(times);
    draw(canvasRef.current, (context, w, h) => {
      const timeRange = [ctx.currentTime - maxSeconds, ctx.currentTime];
      const x = scaleLinear().domain(timeRange).range([0, w]);
      const slice = (h / maxBars) * 0.9;
      const y = scaleLinear()
        .domain([times.current.length, times.current.length - maxBars])
        .range([0, h + 1]);
      const width = (seconds) => w - x(ctx.currentTime - seconds);
      let phase = times.current[0];
      times.current.forEach((start, i) => {
        context.strokeStyle = 'transparent';
        const next = times.current[i + 1] || ctx.currentTime;
        const last = times.current[i - 1] || start - interval - overlap;
        const lastEnd = Math.max(last + interval + overlap, start);
        const px = x(start);
        const py = y(i);
        const end = start + interval + overlap;
        if (end < next) {
          const uncovered = next - end;
          context.fillStyle = 'darkred';
          context.fillRect(x(end), py, width(uncovered), slice);
        }
        context.strokeStyle = 'darkgray';
        context.strokeRect(px, py, width(interval + overlap), slice);
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
      });
    });
  });
  return { frame, times, canvasRef };
}

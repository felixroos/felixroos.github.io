import { Note, Interval } from '@tonaljs/tonal';
import { interpolateRainbow } from 'd3-scale-chromatic';
import { TinyColor } from '@ctrl/tinycolor';

export default function getNodes(notes, pitches = [], tonic?, relative = false) {
  const stroke = 'steelblue';
  const strokeWidth = 3;
  const t = pitches.indexOf(pitches.find(n => Note.get(n).chroma === Note.get(tonic).chroma));
  const harmonicColor = (match) => new TinyColor(interpolateRainbow((((Note.chroma(match) + 9) * 7) % 12) / 12)).lighten(20).toHexString()
  const relativeColor = (match) => new TinyColor(interpolateRainbow(((pitches.indexOf(match) + 3 + t) % pitches.length) / notes.length)).lighten(20).toHexString()
  const relativeColors = false;
  const colorFn = relative && relativeColors ? relativeColor : harmonicColor;
  return notes.map((pc, i, pcs) => {
    const match = (pitches || []).find((p) => Note.get(p).chroma === Note.get(pc).chroma);
    const isTonic = tonic && Note.get(tonic).chroma === Note.get(pc).chroma;
    const pitch = match ? match : Note.get(pc).pc;
    return {
      id: Note.get(pc).chroma,
      label: relative && tonic ? Interval.distance(tonic, pitch) : pitch,
      value: i / pcs.length,
      style: isTonic ? { stroke, strokeWidth } : {},
      fill: match ? colorFn(match) : 'rgba(255,255,255,0.5)',
    };
  });
}
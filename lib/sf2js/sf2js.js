import { SoundFont2 } from 'soundfont2';

export async function loadSoundfont(url) {
  // load some sf2 file into an array buffer:
  const buffer = await fetch(url).then((res) => res.arrayBuffer());
  // convert buffer to Uint8Array:
  const data = new Uint8Array(buffer);
  // parse the sf2 file:
  return SoundFont2.from(data);
}

export function getBufferSourceFromSample(ctx, sample, pitch) {
  const { header, data: int16 } = sample;
  const float32 = new Float32Array(int16.length);
  for (let i = 0; i < int16.length; i++) {
    // scale Int16Array between -1 and 1
    float32[i] = int16[i] / 32768;
  }
  const buffer = ctx.createBuffer(1, float32.length, header.sampleRate);
  const channelData = buffer.getChannelData(0);
  channelData.set(float32);
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const baseDetune = header.originalPitch - header.pitchCorrection / 100.0;
  const playbackRate =
    1.0 * Math.pow(2, (100.0 * (pitch - baseDetune)) / 1200.0);
  source.playbackRate.value = playbackRate;
  const loopStart = header.startLoop - header.start;
  if (header.endLoop > header.startLoop) {
    source.loopStart = loopStart / header.sampleRate;
    source.loopEnd = (header.endLoop - header.start) / header.sampleRate;
    source.loop = true;
  }
  return source;
}

export const startSample = (ctx, sample, pitch, time = ctx.currentTime) => {
  let source = getBufferSourceFromSample(ctx, sample, pitch);
  let gain = ctx.createGain();
  gain.connect(ctx.destination);
  source.connect(gain);
  source.start(time);
  return () => {
    if (!gain || !source) {
      // already stopped / not started
      return;
    }
    const end = ctx.currentTime + 0.1;
    gain.gain.linearRampToValueAtTime(0, end);
    source.stop(end);
    source = undefined;
    gain = undefined;
  };
};

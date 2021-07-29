import canUseDOM from "../canUseDOM"
import { useReducer, useMemo } from 'react'
import * as Tone from "tone"
const { PolySynth, Synth } = Tone
// Tone.context.latencyHint = 'balanced'
// Tone.context.lookAhead = 0.1

interface SynthAction {
  type?: string,
  notes?: any, // TODO: type
  time?: any,
  velocity?: number | number[],
};

export default function useSynth(props: { synth?: any, options?: any, voices?: number } = {}) {
  let { synth, options, voices } = props;
  synth = synth || useMemo(() => {
    return canUseDOM() &&
      new PolySynth({
        maxPolyphony: voices || 3, voice: Synth, options: {
          volume: -12,
          oscillator: { type: "sine" },
          envelope: {
            attack: 0.001,
            decay: 0.1,
            sustain: 0.6,
            release: 0.1
          },
          ...options
        }
      }).toDestination()
  }, []);
  const [state, dispatch] = useReducer(
    (state, action: SynthAction) => {
      const { type, notes, time, velocity } = { time: "+0.01", velocity: 1, ...action };

      function attackWithVelocity(notes: any, time: any, velocity: number | number[] = 1) {
        if (typeof velocity === 'number') {
          synth.triggerAttack(notes, time, velocity)
        } else {
          notes.forEach((n, i) => velocity[i] && synth.triggerAttack([n], time, velocity[i]))
        }
      }
      switch (type) {
        case "ATTACK":
          attackWithVelocity(notes, time, velocity)
          return { ...state, notes: state.notes.concat(notes) }
        case "RELEASE":
          synth.triggerRelease(notes, time)
          return {
            ...state,
            notes: state.notes.filter((n) => !notes.includes(n)),
          }
        case "RELEASE_ALL":
          synth.releaseAll();
          return {
            ...state,
            notes: [],
          }
        case "SET_NOTES":
          synth.releaseAll();
          attackWithVelocity(notes, time, velocity)
          /* const attack = notes.filter(n => !state.notes.includes(n));
          const release = state.notes.filter(n => !notes.includes(n));
          if (attack.length > 0) { attackWithVelocity(attack, time, velocity) }
          if (release.length > 0) { synth.triggerRelease(release, time) } */
          return {
            ...state,
            notes
          }
        default:
          return state
      }
    },
    { notes: [] },
  )
  return {
    triggerAttackRelease: (notes, duration, time = "+0.01", velocity = 0.8) => synth.triggerAttackRelease(notes, duration, time, velocity),
    attack: (action: SynthAction) => dispatch({ type: "ATTACK", ...action }),
    release: (action: SynthAction) => dispatch({ type: "RELEASE", ...action }),
    releaseAll: () => dispatch({ type: "RELEASE_ALL" }),
    setNotes: (action: SynthAction) => dispatch({ type: "SET_NOTES", ...action }),
    notes: state.notes,
    synth
  }
}
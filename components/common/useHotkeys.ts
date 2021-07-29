import { useEffect, useRef, useState } from "react";
import useKeyHandler from "./useKeyHandler";

export default function useHotKeys({ keys, state, mute, down, up }: any) {
  const hold = useRef<[string, any][]>([]);
  const mutableState = useRef<any>(state);
  const [held, setHeld] = useState([]);
  // update ref on state change => needed to keep the callbacks free from state dependencies
  // => adding dependencies will cause the event listeners to miss events while updating
  useEffect(() => {
    mutableState.current = state;
  }, [state])
  useKeyHandler(
    {
      disabled: mute,
      down: (e) => {
        const keyIndex = keys.indexOf(e.key);
        if (keyIndex !== -1) {
          e.preventDefault();
        }
        if (keyIndex !== -1 && !hold.current.find(([key]) => key === e.key)) {
          const press: [string, any] = [e.key, mutableState.current];
          hold.current = [...hold.current, press];
          down?.(press, keyIndex, hold.current);
          setHeld([...hold.current]);
        }
      },
      up: (e) => {
        const keyIndex = keys.indexOf(e.key);
        if (keyIndex !== -1) {
          e.preventDefault();
        }
        const pressed = hold.current.find(([key]) => key === e.key);
        if (!!pressed) {
          hold.current = hold.current.filter(([key]) => key !== e.key);
          up?.(pressed, keyIndex, hold.current);
          setHeld([...hold.current]);
        }
      },
    }
  )
  return [held];
}

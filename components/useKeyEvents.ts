import { KeyboardEvent, useEffect } from "react"

export function useKeyEvents({ downHandler, upHandler }: {
  downHandler: (e: globalThis.KeyboardEvent) => void,
  upHandler: (e: globalThis.KeyboardEvent) => void
}
): void {
  useEffect(() => {
    window.addEventListener("keydown", downHandler)
    window.addEventListener("keyup", upHandler)
    return () => {
      window.removeEventListener("keydown", downHandler)
      window.removeEventListener("keyup", upHandler)
    }
  }, [downHandler, upHandler])
}

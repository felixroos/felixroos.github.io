import React, { useState } from "react"
import useFrame from "./useFrame"

export default function AnimationFrame(props) {
  const [time, setTime] = useState({
    fromStart: 0,
    fromFirstStart: 0,
    progress: 0,
    delta: null,
  })
  const frame = useFrame(setTime, props.autostart)
  return props.children({ ...frame, time })
}

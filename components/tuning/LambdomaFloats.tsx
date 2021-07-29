import React from "react"
import { maxFractionSize } from "./tuning"
import { Lambdoma } from "./Lambdoma"
import Fraction from "fraction.js"

export function LambdomaFloats(props) {
  const { floats } = props
  const isEqual = (a, b) => {
    return new Fraction(a).equals(b)
  }
  const maxSize = maxFractionSize(floats)
  props = {
    hideExtensions: true,
    hideZeroes: true,
    ...props,
    cols: maxSize[0],
    rows: maxSize[1],
    angle: 45,
    filter: ([value, top, bottom]) =>
      floats.find((float) => isEqual(float, value)),
  }
  return <Lambdoma {...props} />
}

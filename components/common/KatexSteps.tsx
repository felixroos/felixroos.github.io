import React from 'react';
import { InlineMath } from 'react-katex';

export default function KatexSteps(props) {
  const { steps } = props;
  const katexSteps = (steps) => steps.filter((s, i, a) => a.indexOf(s) === i).join(' = ');
  return <InlineMath>{`${katexSteps(steps)}`}</InlineMath>;
}

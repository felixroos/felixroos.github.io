import React from 'react';
import AnimationFrame from '../common/AnimationFrame';
import Lattice3D from './Lattice3D';

export default function LatticeAnimated(props) {
  return (
    <AnimationFrame autostart={true}>
      {({ time }) => {
        const angle = time.fromStart / 50;
        return <Lattice3D width={300} {...props} angles={props.rotator?.(angle) || [angle, angle / 2, angle / 3]} />;
      }}
    </AnimationFrame>
  );
}

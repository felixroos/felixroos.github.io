import { Canvas, MeshProps, useFrame } from '@react-three/fiber';
import React, { useRef, useState } from 'react';

function Box(props) {
  // This reference will give us direct access to the THREE.Mesh object
  const ref = useRef<MeshProps>();
  // Set up state for the hovered and active state
  const [hovered, setHover] = useState(false);
  const [active, setActive] = useState(false);
  // Subscribe this component to the render-loop, rotate the mesh every frame
  
  // useFrame((state, delta) => (ref.current.rotation.x += 0.01));

  // Return the view, these are regular Threejs elements expressed in JSX
  return (
    <mesh
      {...props}
      ref={ref}
      scale={active ? 1.5 : 1}
      onClick={(event) => setActive(!active)}
      onPointerOver={(event) => setHover(true)}
      onPointerOut={(event) => setHover(false)}
    >
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={hovered ? 'hotpink' : 'orange'} />
    </mesh>
  );
}
export function LatticeThree() {
  return (
    <Canvas>
      <ambientLight />
      <pointLight position={[10, 10, 10]} />
      <Box position={[1.2, 0, 0]} />
    </Canvas>
  );
}

export default LatticeThree;
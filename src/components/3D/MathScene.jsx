import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { Text, Box, Torus, Sphere } from "@react-three/drei";
import * as THREE from "three";

const RotatingShape = ({ position, shape, color }) => {
  const meshRef = useRef();

  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.x += 0.01;
      meshRef.current.rotation.y += 0.01;
      meshRef.current.position.y =
        position[1] + Math.sin(state.clock.elapsedTime + position[0]) * 0.2;
    }
  });

  return (
    <group ref={meshRef} position={position}>
      {shape === "box" && (
        <Box args={[0.5, 0.5, 0.5]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Box>
      )}
      {shape === "torus" && (
        <Torus args={[0.3, 0.1, 16, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Torus>
      )}
      {shape === "sphere" && (
        <Sphere args={[0.3, 32, 32]}>
          <meshStandardMaterial
            color={color}
            emissive={color}
            emissiveIntensity={0.3}
          />
        </Sphere>
      )}
    </group>
  );
};

const FloatingFormula = ({ position, formula }) => {
  const textRef = useRef();

  useFrame((state) => {
    if (textRef.current) {
      textRef.current.position.y =
        position[1] +
        Math.sin(state.clock.elapsedTime * 0.5 + position[0]) * 0.3;
      textRef.current.rotation.y =
        Math.sin(state.clock.elapsedTime * 0.3) * 0.1;
    }
  });

  return (
    <Text
      ref={textRef}
      position={position}
      fontSize={0.3}
      color="#ffffff"
      anchorX="center"
      anchorY="middle"
      outlineWidth={0.02}
      outlineColor="#000000"
    >
      {formula}
    </Text>
  );
};

export default function MathScene() {
  return (
    <>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} />
      <pointLight position={[-10, -10, -10]} intensity={0.5} color="#ffffff" />

      <RotatingShape position={[-2, 0, 0]} shape="box" color="#ffffff" />
      <RotatingShape position={[0, 1, -1]} shape="torus" color="#ffffff" />
      <RotatingShape position={[2, -1, 0]} shape="sphere" color="#ffffff" />
      <RotatingShape position={[-1, -1.5, 1]} shape="box" color="#ffffff" />
      <RotatingShape
        position={[1.5, 1.5, -0.5]}
        shape="torus"
        color="#ffffff"
      />

      <FloatingFormula position={[-1, 2, 0]} formula="∫" />
      <FloatingFormula position={[1, -2, 0]} formula="∑" />
      <FloatingFormula position={[0, 0, 2]} formula="π" />
    </>
  );
}




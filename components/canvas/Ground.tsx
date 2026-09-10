"use client";

import { MeshReflectorMaterial } from "@react-three/drei";
import { useSceneStore } from "@/store/useSceneStore";

export default function Ground() {
  const lowPower = useSceneStore((s) => s.lowPower);

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.001, 0]} receiveShadow={!lowPower}>
      <planeGeometry args={[120, 120]} />
      {lowPower ? (
        <meshStandardMaterial color="#08080a" roughness={0.85} metalness={0.4} />
      ) : (
        <MeshReflectorMaterial
          blur={[400, 120]}
          resolution={768}
          mixBlur={1}
          mixStrength={35}
          roughness={0.75}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#050506"
          metalness={0.6}
          mirror={0.35}
        />
      )}
    </mesh>
  );
}

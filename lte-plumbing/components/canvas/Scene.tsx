"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial, ContactShadows, AdaptiveDpr, AdaptiveEvents } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import PlumbingRig from "@/components/canvas/PlumbingRig";
import CameraRig from "@/components/canvas/CameraRig";
import { useSceneStore } from "@/store/useSceneStore";

function Ground({ lowPower }: { lowPower: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow={!lowPower}>
      <planeGeometry args={[80, 80]} />
      {lowPower ? (
        <meshStandardMaterial color="#08080a" roughness={0.85} metalness={0.3} />
      ) : (
        <MeshReflectorMaterial
          blur={[300, 100]}
          resolution={768}
          mixBlur={1}
          mixStrength={30}
          roughness={0.8}
          depthScale={1}
          minDepthThreshold={0.85}
          color="#07080b"
          metalness={0.5}
          mirror={0.3}
        />
      )}
    </mesh>
  );
}

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.32} />
      <directionalLight position={[5, 7, 4]} intensity={1.7} color="#eef1ff" castShadow shadow-mapSize={[1024, 1024]} />
      <pointLight position={[-3, 2.4, -2]} intensity={1.8} color="#2a8cff" distance={9} />
      <pointLight position={[2.8, 1.4, -1.8]} intensity={1.4} color="#ff2233" distance={8} />
    </>
  );
}

function SceneContents() {
  const lowPower = useSceneStore((s) => s.lowPower);

  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 5, 22]} />
      <Lighting />
      <Environment resolution={256} environmentIntensity={0.6}>
        <Lightformer form="rect" intensity={3} color="#eef1ff" position={[0, 5, -3]} scale={[8, 4, 1]} />
        <Lightformer form="rect" intensity={1} color="#2a8cff" position={[-4, 2, 3]} scale={[3, 4, 1]} rotation-y={Math.PI / 3} />
        <Lightformer form="rect" intensity={1} color="#ff2233" position={[4, 1.5, -1]} scale={[1.2, 4, 1]} rotation-y={-Math.PI / 2.4} />
        <Lightformer form="ring" intensity={1.4} color="#ffffff" position={[0, 1.2, 2.6]} scale={3} />
      </Environment>
      <Suspense fallback={null}>
        <PlumbingRig />
      </Suspense>
      <Ground lowPower={lowPower} />
      <ContactShadows position={[0, 0.001, 0]} opacity={0.5} scale={10} blur={2.2} far={3} />
      <CameraRig />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.6} luminanceThreshold={0.6} luminanceSmoothing={0.2} mipmapBlur />
          <Vignette eskil={false} offset={0.18} darkness={0.9} />
        </EffectComposer>
      )}
      <AdaptiveDpr pixelated={false} />
      <AdaptiveEvents />
    </>
  );
}

export default function Scene() {
  const lowPower = useSceneStore((s) => s.lowPower);
  const setLowPower = useSceneStore((s) => s.setLowPower);

  useEffect(() => {
    const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
    const narrow = window.innerWidth < 768;
    const cores = navigator.hardwareConcurrency ?? 8;
    setLowPower(Boolean(reducedMotion || narrow || cores <= 4));
  }, [setLowPower]);

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={lowPower ? [1, 1.25] : [1, 1.8]}
        gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
        camera={{ fov: 32, near: 0.1, far: 50, position: [3.4, 1.6, 3.2] }}
        shadows={!lowPower}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

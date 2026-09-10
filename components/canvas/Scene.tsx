"use client";

import { Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer, AdaptiveDpr, AdaptiveEvents, ContactShadows } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette } from "@react-three/postprocessing";
import Car from "@/components/canvas/Car";
import Ground from "@/components/canvas/Ground";
import CameraRig from "@/components/canvas/CameraRig";
import LondonMap from "@/components/canvas/LondonMap";
import { useSceneStore } from "@/store/useSceneStore";

function Lighting() {
  return (
    <>
      <ambientLight intensity={0.18} />
      <directionalLight
        position={[6, 8, 4]}
        intensity={1.4}
        color="#e9ecff"
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -3]} intensity={6} color="#d31027" distance={12} />
      <pointLight position={[3, 1.2, -2]} intensity={4} color="#3a5cff" distance={10} />
    </>
  );
}

function SceneContents() {
  const setAssetsReady = useSceneStore((s) => s.setAssetsReady);
  const lowPower = useSceneStore((s) => s.lowPower);
  useEffect(() => {
    setAssetsReady(true);
  }, [setAssetsReady]);

  return (
    <>
      <color attach="background" args={["#050506"]} />
      <fog attach="fog" args={["#050506", 6, 26]} />
      <Lighting />
      {/* Procedural studio environment — no external HDRI fetch, fully controlled lighting. */}
      <Environment resolution={lowPower ? 64 : 256} environmentIntensity={0.7}>
        <Lightformer form="rect" intensity={3.2} color="#dfe6ff" position={[0, 5, -3]} scale={[9, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffffff" position={[-4, 2.5, 3]} scale={[4, 3, 1]} rotation-y={Math.PI / 3} />
        <Lightformer form="rect" intensity={2.4} color="#d31027" position={[4.5, 1.5, -1]} scale={[1.5, 5, 1]} rotation-y={-Math.PI / 2.4} />
        <Lightformer form="ring" intensity={1.2} color="#3a5cff" position={[0, 0.6, 4]} scale={5} />
        <Lightformer form="rect" intensity={0.6} color="#ffffff" position={[0, -2, 0]} scale={[10, 10, 1]} rotation-x={Math.PI / 2} />
      </Environment>
      <Suspense fallback={null}>
        <Car />
      </Suspense>
      <Ground />
      {!lowPower && (
        <ContactShadows position={[0, 0, 0]} opacity={0.55} scale={14} blur={2.4} far={4} />
      )}
      <LondonMap />
      <CameraRig />
      {!lowPower && (
        <EffectComposer multisampling={0}>
          <Bloom intensity={0.55} luminanceThreshold={0.65} luminanceSmoothing={0.2} mipmapBlur />
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

  return (
    <div className="pointer-events-none fixed inset-0 z-0">
      <Canvas
        dpr={lowPower ? [1, 1.25] : [1, 1.8]}
        gl={{ antialias: !lowPower, powerPreference: "high-performance" }}
        camera={{ fov: 32, near: 0.1, far: 60, position: [4.6, 1.7, 3.6] }}
        shadows={!lowPower}
      >
        <SceneContents />
      </Canvas>
    </div>
  );
}

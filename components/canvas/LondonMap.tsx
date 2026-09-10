"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/store/useSceneStore";
import { LONDON_ROUTE, localT } from "@/lib/timeline";

const GRID_LINES = 14;
const GRID_EXTENT = 6;

function buildGrid() {
  const points: number[] = [];
  for (let i = -GRID_LINES; i <= GRID_LINES; i++) {
    const o = (i / GRID_LINES) * GRID_EXTENT;
    points.push(o, 0, -GRID_EXTENT, o, 0, GRID_EXTENT);
    points.push(-GRID_EXTENT, 0, o, GRID_EXTENT, 0, o);
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.Float32BufferAttribute(points, 3));
  return geometry;
}

export default function LondonMap() {
  const group = useRef<THREE.Group>(null);
  const gridMatRef = useRef<THREE.LineBasicMaterial>(null);
  const routeGeomRef = useRef<THREE.BufferGeometry>(null);
  const pinRef = useRef<THREE.Mesh>(null);

  const gridGeometry = useMemo(buildGrid, []);
  const fullRoute = useMemo(() => LONDON_ROUTE.map((p) => new THREE.Vector3(...p)), []);
  const routePositions = useMemo(() => {
    const arr = new Float32Array(fullRoute.length * 3);
    fullRoute.forEach((p, i) => p.toArray(arr, i * 3));
    return arr;
  }, [fullRoute]);

  useFrame(() => {
    const { progress } = useSceneStore.getState();
    const t = localT(progress, 0.87, 0.99);
    const opacity = Math.min(1, t * 2.2);

    if (group.current) group.current.visible = opacity > 0.01;
    if (gridMatRef.current) gridMatRef.current.opacity = opacity * 0.5;

    const drawCount = Math.max(2, Math.round(t * fullRoute.length));
    routeGeomRef.current?.setDrawRange(0, drawCount);

    if (pinRef.current) {
      const visible = t > 0.85;
      pinRef.current.visible = visible;
      const pulse = 1 + Math.sin(performance.now() * 0.004) * 0.15;
      pinRef.current.scale.setScalar(visible ? pulse : 0);
    }
  });

  return (
    <group ref={group} position={[0, 0.015, -1]} visible={false}>
      <lineSegments geometry={gridGeometry}>
        <lineBasicMaterial ref={gridMatRef} color="#3a3a40" transparent opacity={0} />
      </lineSegments>
      <line>
        <bufferGeometry ref={routeGeomRef}>
          <bufferAttribute attach="attributes-position" args={[routePositions, 3]} />
        </bufferGeometry>
        <lineBasicMaterial color="#ff2233" toneMapped={false} linewidth={2} />
      </line>
      <mesh ref={pinRef} position={fullRoute[fullRoute.length - 1]}>
        <sphereGeometry args={[0.07, 16, 16]} />
        <meshStandardMaterial color="#ff2233" emissive="#ff2233" emissiveIntensity={2.4} toneMapped={false} />
      </mesh>
    </group>
  );
}

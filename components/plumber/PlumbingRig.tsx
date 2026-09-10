"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { usePlumberStore } from "@/store/usePlumberStore";
import { getCutawayFocus, getLeakIntensity, getRigExitOffset, getWrenchProgress } from "@/lib/plumber/timeline";

const STEEL = { color: "#9ca1a8", metalness: 0.75, roughness: 0.42 } as const;
const COPPER = { color: "#c98a54", metalness: 0.65, roughness: 0.46 } as const;
const JOINT = new THREE.Vector3(0.55, 1.3, 0);
const DROPLET_COUNT = 36;
const FLOW_COUNT = 18;
const dummy = new THREE.Object3D();

function Pipework() {
  const pipeCurve = useMemo(
    () =>
      new THREE.CatmullRomCurve3([
        new THREE.Vector3(0, 0.1, 0),
        new THREE.Vector3(0, 1.3, 0),
        new THREE.Vector3(0.55, 1.3, 0),
        new THREE.Vector3(1.05, 1.3, 0),
      ]),
    []
  );

  return (
    <group>
      {/* Vertical riser */}
      <mesh position={[0, 0.75, 0]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 1.5, 20]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
      {/* Horizontal branch */}
      <mesh position={[0.8, 1.3, 0]} rotation={[0, 0, Math.PI / 2]} castShadow>
        <cylinderGeometry args={[0.075, 0.075, 0.5, 20]} />
        <meshStandardMaterial {...COPPER} />
      </mesh>
      {/* Flange rings */}
      {[
        [0, 1.48, 0],
        [0.55, 1.3, 0],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.11, 0.025, 12, 24]} />
          <meshStandardMaterial {...STEEL} />
        </mesh>
      ))}
      {/* Base flange to floor */}
      <mesh position={[0, 0.02, 0]}>
        <cylinderGeometry args={[0.16, 0.18, 0.05, 24]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      {/* Valve wheel at the joint — leak / fix focal point */}
      <mesh position={[JOINT.x, JOINT.y, JOINT.z + 0.12]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.14, 0.02, 8, 20]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <FlowBeads curve={pipeCurve} />
    </group>
  );
}

function FlowBeads({ curve }: { curve: THREE.CatmullRomCurve3 }) {
  const ref = useRef<THREE.InstancedMesh>(null);

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < FLOW_COUNT; i++) {
      const t = (time * 0.12 + i / FLOW_COUNT) % 1;
      const p = curve.getPointAt(t);
      dummy.position.copy(p);
      dummy.scale.setScalar(0.028);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, FLOW_COUNT]}>
      <sphereGeometry args={[1, 8, 8]} />
      <meshStandardMaterial color="#5ec4ff" emissive="#2aa0ff" emissiveIntensity={1.4} toneMapped={false} />
    </instancedMesh>
  );
}

function LeakBurst() {
  const ref = useRef<THREE.InstancedMesh>(null);
  const matRef = useRef<THREE.MeshStandardMaterial>(null);
  const seeds = useMemo(
    () =>
      Array.from({ length: DROPLET_COUNT }, (_, i) => ({
        phase: i / DROPLET_COUNT,
        vx: (Math.sin(i * 12.9) * 0.5 + 0.15) * 0.9,
        vy: 0.9 + Math.abs(Math.cos(i * 5.7)) * 0.6,
        vz: Math.cos(i * 7.3) * 0.45,
      })),
    []
  );

  useFrame((state) => {
    const mesh = ref.current;
    if (!mesh) return;
    const leak = getLeakIntensity(usePlumberStore.getState().progress);
    if (matRef.current) matRef.current.opacity = leak;
    mesh.visible = leak > 0.02;
    if (!mesh.visible) return;
    const time = state.clock.elapsedTime;
    for (let i = 0; i < DROPLET_COUNT; i++) {
      const s = seeds[i];
      const t = (time * 1.6 + s.phase) % 1;
      dummy.position.set(
        JOINT.x + s.vx * t,
        JOINT.y + s.vy * t - 2.2 * t * t,
        JOINT.z + 0.12 + s.vz * t
      );
      dummy.scale.setScalar(0.02 * (1 - t) * leak);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, DROPLET_COUNT]}>
      <sphereGeometry args={[1, 6, 6]} />
      <meshStandardMaterial ref={matRef} color="#bfe6ff" transparent opacity={0} toneMapped={false} />
    </instancedMesh>
  );
}

function Wrench() {
  const group = useRef<THREE.Group>(null);
  const restPos = new THREE.Vector3(1.9, 1.75, 0.55);
  const workPos = new THREE.Vector3(JOINT.x + 0.05, JOINT.y, JOINT.z + 0.2);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const w = getWrenchProgress(usePlumberStore.getState().progress);
    g.position.lerpVectors(restPos, workPos, w);
    g.rotation.z = THREE.MathUtils.degToRad(-40) + w * THREE.MathUtils.degToRad(-70);
    g.rotation.x = THREE.MathUtils.degToRad(90);
    g.visible = w > 0.01;
  });

  return (
    <group ref={group}>
      <mesh position={[0, -0.22, 0]}>
        <boxGeometry args={[0.045, 0.4, 0.02]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0, 0.02, 0]}>
        <boxGeometry args={[0.13, 0.09, 0.03]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[-0.045, 0.07, 0]}>
        <boxGeometry args={[0.02, 0.05, 0.03]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
      <mesh position={[0.045, 0.07, 0]}>
        <boxGeometry args={[0.02, 0.05, 0.03]} />
        <meshStandardMaterial {...STEEL} />
      </mesh>
    </group>
  );
}

function BoilerUnit() {
  const dialRef = useRef<THREE.Mesh>(null);
  const coilRef = useRef<THREE.Mesh>(null);
  const panelRef = useRef<THREE.Mesh>(null);

  useFrame(() => {
    const focus = getCutawayFocus(usePlumberStore.getState().progress);
    for (const ref of [dialRef, coilRef, panelRef]) {
      const mat = ref.current?.material as THREE.MeshStandardMaterial | undefined;
      if (mat) mat.emissiveIntensity = 0.3 + focus * 2.2;
    }
  });

  return (
    <group position={[-1.4, 0.05, 0]}>
      <RoundedBox args={[0.7, 0.9, 0.28]} radius={0.04} smoothness={4} position={[0, 0.95, -0.05]} castShadow>
        <meshStandardMaterial color="#cfd2d8" metalness={0.55} roughness={0.35} />
      </RoundedBox>
      <mesh ref={panelRef} position={[0, 1.25, 0.1]}>
        <boxGeometry args={[0.4, 0.16, 0.02]} />
        <meshStandardMaterial color="#1a2230" emissive="#3a5cff" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={dialRef} position={[-0.15, 0.95, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.015, 10, 24]} />
        <meshStandardMaterial color="#ff2233" emissive="#ff2233" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
      <mesh ref={coilRef} position={[0.15, 0.85, 0.15]}>
        <cylinderGeometry args={[0.05, 0.05, 0.22, 16]} />
        <meshStandardMaterial color="#ffb020" emissive="#ffb020" emissiveIntensity={0.3} toneMapped={false} />
      </mesh>
    </group>
  );
}

export default function PlumbingRig() {
  const exitGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const { progress, ctaProgress } = usePlumberStore.getState();
    const target = getRigExitOffset(progress) * (1 - ctaProgress);
    const g = exitGroup.current;
    if (g) g.position.y = THREE.MathUtils.damp(g.position.y, target, 3, delta);
  });

  return (
    <group ref={exitGroup}>
      <Pipework />
      <LeakBurst />
      <Wrench />
      <BoilerUnit />
    </group>
  );
}

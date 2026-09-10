"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { RoundedBox } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/store/useSceneStore";
import { getCutawayFocus, getLeakIntensity, getRigExitOffset, getWrenchProgress } from "@/lib/timeline";

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
    const leak = getLeakIntensity(useSceneStore.getState().progress);
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

const WRENCH_METAL = { color: "#c7ccd3", metalness: 0.95, roughness: 0.16 } as const;
const WRENCH_GRIP = { color: "#1c1e22", metalness: 0.1, roughness: 0.75 } as const;

function Wrench() {
  const group = useRef<THREE.Group>(null);
  const restPos = new THREE.Vector3(1.9, 1.75, 0.55);
  const workPos = new THREE.Vector3(JOINT.x + 0.04, JOINT.y, JOINT.z + 0.16);

  useFrame(() => {
    const g = group.current;
    if (!g) return;
    const w = getWrenchProgress(useSceneStore.getState().progress);
    g.position.lerpVectors(restPos, workPos, w);
    g.rotation.z = THREE.MathUtils.degToRad(-35) + w * THREE.MathUtils.degToRad(-65);
    g.rotation.x = THREE.MathUtils.degToRad(90);
    g.visible = w > 0.01;
  });

  // An adjustable-spanner silhouette: tapered chrome head with an open jaw, matte grip handle.
  return (
    <group ref={group}>
      {/* Grip handle, slightly tapered */}
      <mesh position={[0, -0.24, 0]} castShadow>
        <cylinderGeometry args={[0.016, 0.021, 0.34, 12]} />
        <meshStandardMaterial {...WRENCH_GRIP} />
      </mesh>
      {/* Neck transitioning into the head */}
      <mesh position={[0, -0.03, 0]}>
        <cylinderGeometry args={[0.022, 0.016, 0.1, 12]} />
        <meshStandardMaterial {...WRENCH_METAL} />
      </mesh>
      {/* Head block */}
      <RoundedBox args={[0.15, 0.1, 0.04]} radius={0.015} smoothness={3} position={[0, 0.05, 0]}>
        <meshStandardMaterial {...WRENCH_METAL} />
      </RoundedBox>
      {/* Fixed jaw */}
      <RoundedBox args={[0.035, 0.09, 0.045]} radius={0.008} smoothness={2} position={[-0.06, 0.11, 0]}>
        <meshStandardMaterial {...WRENCH_METAL} />
      </RoundedBox>
      {/* Adjustable jaw, angled slightly open */}
      <RoundedBox
        args={[0.035, 0.08, 0.045]}
        radius={0.008}
        smoothness={2}
        position={[0.058, 0.1, 0]}
        rotation={[0, 0, THREE.MathUtils.degToRad(10)]}
      >
        <meshStandardMaterial {...WRENCH_METAL} />
      </RoundedBox>
    </group>
  );
}

function BoilerUnit() {
  const dialMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const coilMatRef = useRef<THREE.MeshStandardMaterial>(null);
  const readoutMatRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(() => {
    const focus = getCutawayFocus(useSceneStore.getState().progress);
    if (dialMatRef.current) dialMatRef.current.emissiveIntensity = focus * 1.8;
    if (coilMatRef.current) coilMatRef.current.emissiveIntensity = 0.15 + focus * 1.6;
    if (readoutMatRef.current) readoutMatRef.current.emissiveIntensity = 0.6 + focus * 1.4;
  });

  return (
    <group position={[-1.4, 0.05, 0]}>
      {/* Casing — glossy premium appliance shell */}
      <RoundedBox args={[0.7, 0.9, 0.28]} radius={0.05} smoothness={4} position={[0, 0.95, -0.05]} castShadow>
        <meshPhysicalMaterial color="#e4e6ea" metalness={0.3} roughness={0.28} clearcoat={1} clearcoatRoughness={0.12} />
      </RoundedBox>
      {/* Recessed dark bezel for the control panel */}
      <RoundedBox args={[0.44, 0.2, 0.03]} radius={0.015} smoothness={3} position={[0, 1.25, 0.095]}>
        <meshStandardMaterial color="#101318" metalness={0.4} roughness={0.5} />
      </RoundedBox>
      {/* Thin LCD-style readout, not a flat block of colour */}
      <mesh position={[0, 1.27, 0.115]}>
        <boxGeometry args={[0.3, 0.035, 0.005]} />
        <meshStandardMaterial ref={readoutMatRef} color="#0d2a2e" emissive="#3fe0d0" emissiveIntensity={0.6} toneMapped={false} />
      </mesh>
      {/* Small indicator buttons */}
      {[-0.14, -0.06, 0.02].map((x, i) => (
        <mesh key={i} position={[x, 1.2, 0.115]}>
          <cylinderGeometry args={[0.012, 0.012, 0.008, 12]} />
          <meshStandardMaterial color="#3a3f47" metalness={0.6} roughness={0.4} />
        </mesh>
      ))}
      {/* Temperature dial — neutral brushed metal, glows red only when highlighted */}
      <mesh position={[-0.15, 0.95, 0.15]} rotation={[Math.PI / 2, 0, 0]}>
        <torusGeometry args={[0.08, 0.013, 10, 28]} />
        <meshStandardMaterial ref={dialMatRef} color="#8d9299" metalness={0.85} roughness={0.3} emissive="#ff2233" emissiveIntensity={0} />
      </mesh>
      <mesh position={[-0.15, 0.95, 0.15]} rotation={[0.4, 0, 0]}>
        <boxGeometry args={[0.005, 0.06, 0.005]} />
        <meshStandardMaterial color="#ff2233" emissive="#ff2233" emissiveIntensity={0.8} toneMapped={false} />
      </mesh>
      {/* Heat exchanger coil — brass, warms only when highlighted */}
      <mesh position={[0.15, 0.85, 0.15]}>
        <cylinderGeometry args={[0.045, 0.045, 0.22, 20]} />
        <meshStandardMaterial ref={coilMatRef} color="#8a6a3f" metalness={0.8} roughness={0.35} emissive="#ffb020" emissiveIntensity={0.15} />
      </mesh>
      {/* Corner fixings for detail */}
      {[
        [-0.32, 0.58, 0.095],
        [0.32, 0.58, 0.095],
        [-0.32, 1.32, 0.095],
        [0.32, 1.32, 0.095],
      ].map((p, i) => (
        <mesh key={i} position={p as [number, number, number]}>
          <cylinderGeometry args={[0.012, 0.012, 0.01, 10]} />
          <meshStandardMaterial color="#6a6e75" metalness={0.7} roughness={0.4} />
        </mesh>
      ))}
    </group>
  );
}

export default function PlumbingRig() {
  const exitGroup = useRef<THREE.Group>(null);

  useFrame((_, delta) => {
    const { progress, ctaProgress } = useSceneStore.getState();
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

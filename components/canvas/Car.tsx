"use client";

import { useEffect, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { useGLTF } from "@react-three/drei";
import * as THREE from "three";
import { useSceneStore } from "@/store/useSceneStore";
import {
  getActiveService,
  getBrakeCamWeight,
  getCarDriveOffset,
  getHeadlightGlow,
  getHoodOpen,
} from "@/lib/timeline";

const MODEL_URL = "/models/car-concept.glb";
const HOOD_MAX_ANGLE = 1.15; // radians; flip sign if the hinge opens the wrong way
const WHEEL_RADIUS = 0.34;

type NodeMap = Record<string, THREE.Object3D>;
type MatMap = Record<string, THREE.Material>;

export default function Car() {
  const { nodes, materials, scene } = useGLTF(MODEL_URL, "/draco/") as unknown as {
    nodes: NodeMap;
    materials: MatMap;
    scene: THREE.Object3D;
  };

  const group = useRef<THREE.Group>(null);
  const hoodOpenRef = useRef(0);
  const wheelSpinRef = useRef(0);
  const brakeGlowRef = useRef(0);
  const headlightGlowRef = useRef(0);

  const hood = nodes.BodyHood as THREE.Object3D | undefined;
  const wheelFL = nodes.WheelFrontL as THREE.Object3D | undefined;
  const wheelFR = nodes.WheelFrontR as THREE.Object3D | undefined;
  const wheelRL = nodes.WheelRearL as THREE.Object3D | undefined;
  const wheelRR = nodes.WheelRearR as THREE.Object3D | undefined;

  const headlightMat = materials.Headlight as THREE.MeshStandardMaterial | undefined;
  const brakeDiscMat = materials.Disc as THREE.MeshStandardMaterial | undefined;
  const brakeCaliperMat = materials.Brake as THREE.MeshStandardMaterial | undefined;

  useEffect(() => {
    headlightMat?.emissive.set("#fff3e0");
    brakeDiscMat?.emissive.set("#ff2233");
    brakeCaliperMat?.emissive.set("#ff2233");
    if (headlightMat) headlightMat.emissiveIntensity = 0.4;
    if (brakeDiscMat) brakeDiscMat.emissiveIntensity = 0;
    if (brakeCaliperMat) brakeCaliperMat.emissiveIntensity = 0;
  }, [headlightMat, brakeDiscMat, brakeCaliperMat]);

  useFrame((_, delta) => {
    const { progress, stageId, ctaProgress } = useSceneStore.getState();

    // Bonnet: real node rotation on its hinge, damped for a mechanical, weighted feel.
    const targetHood = getHoodOpen(progress);
    hoodOpenRef.current += (targetHood - hoodOpenRef.current) * Math.min(1, delta * 4);
    if (hood) hood.rotation.x = hoodOpenRef.current * HOOD_MAX_ANGLE;

    // Wheels: continuous roll while "driving", derived from the car's actual forward travel.
    const driving = stageId === "drive" || stageId === "driveAway";
    if (driving) {
      wheelSpinRef.current += (delta * 3.2) / WHEEL_RADIUS;
    }
    for (const w of [wheelFL, wheelFR, wheelRL, wheelRR]) {
      if (w) w.rotation.x = -wheelSpinRef.current;
    }

    // Car root: drives forward for real during the "drive" and "driveAway" stages.
    if (group.current) {
      group.current.position.z = getCarDriveOffset(progress);
    }

    // Headlights: subtle story glow, full beam on the closing CTA shot.
    const targetGlow = Math.max(getHeadlightGlow(progress), ctaProgress * 2.2);
    headlightGlowRef.current += (targetGlow - headlightGlowRef.current) * Math.min(1, delta * 3);
    if (headlightMat) {
      headlightMat.emissiveIntensity = 0.4 + headlightGlowRef.current;
    }

    // Brakes: emissive pulse on disc + caliper while the "brakes" service is in focus.
    const activeService = getActiveService(progress);
    const targetBrakeWeight = activeService === "brakes" ? getBrakeCamWeight(progress) : 0;
    brakeGlowRef.current += (targetBrakeWeight - brakeGlowRef.current) * Math.min(1, delta * 5);
    const glow = brakeGlowRef.current;
    if (brakeDiscMat) brakeDiscMat.emissiveIntensity = glow * 1.8;
    if (brakeCaliperMat) brakeCaliperMat.emissiveIntensity = glow * 2.4;
  });

  return (
    <group ref={group} dispose={null}>
      <primitive object={scene} />
    </group>
  );
}

useGLTF.preload(MODEL_URL, "/draco/");

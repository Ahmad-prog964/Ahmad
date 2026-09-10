"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useSceneStore } from "@/store/useSceneStore";
import {
  CTA_CAM,
  WHEEL_CAM,
  getActiveService,
  getBrakeCamWeight,
  getCameraState,
} from "@/lib/timeline";

const tmpTarget = new THREE.Vector3();
const tmpPos = new THREE.Vector3();

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 0.65, 0.3));
  const introOffset = useRef(0);

  useFrame((_, delta) => {
    const { progress, ctaProgress, introDone } = useSceneStore.getState();
    const base = getCameraState(progress);

    tmpPos.set(...base.position);
    tmpTarget.set(...base.target);
    let fov = base.fov;

    const activeService = getActiveService(progress);
    const brakeWeight = activeService === "brakes" ? getBrakeCamWeight(progress) : 0;
    if (brakeWeight > 0) {
      tmpPos.lerp(new THREE.Vector3(...WHEEL_CAM.pos), brakeWeight);
      tmpTarget.lerp(new THREE.Vector3(...WHEEL_CAM.target), brakeWeight);
    }

    if (ctaProgress > 0) {
      tmpPos.lerp(new THREE.Vector3(...CTA_CAM.pos), ctaProgress);
      tmpTarget.lerp(new THREE.Vector3(...CTA_CAM.target), ctaProgress);
      fov = fov + (CTA_CAM.fov - fov) * ctaProgress;
    }

    // Pre-intro: camera drifts in from darkness before the user can scroll.
    if (!introDone) {
      introOffset.current += delta;
      const t = Math.min(1, introOffset.current / 3.4);
      const ease = t * t * (3 - 2 * t);
      tmpPos.lerp(new THREE.Vector3(2, 2.4, 9), 1 - ease);
      fov = 46 + (fov - 46) * ease;
    }

    // Idle cursor parallax — small, never fights the scroll-driven motion.
    const parallaxX = pointer.x * 0.18;
    const parallaxY = pointer.y * 0.1;

    const lambda = introDone ? 3.2 : 1.6;
    camera.position.x = THREE.MathUtils.damp(camera.position.x, tmpPos.x + parallaxX, lambda, delta);
    camera.position.y = THREE.MathUtils.damp(camera.position.y, tmpPos.y + parallaxY, lambda, delta);
    camera.position.z = THREE.MathUtils.damp(camera.position.z, tmpPos.z, lambda, delta);

    targetRef.current.x = THREE.MathUtils.damp(targetRef.current.x, tmpTarget.x, lambda, delta);
    targetRef.current.y = THREE.MathUtils.damp(targetRef.current.y, tmpTarget.y, lambda, delta);
    targetRef.current.z = THREE.MathUtils.damp(targetRef.current.z, tmpTarget.z, lambda, delta);
    camera.lookAt(targetRef.current);

    if ("fov" in camera) {
      const cam = camera as THREE.PerspectiveCamera;
      cam.fov = THREE.MathUtils.damp(cam.fov, fov, 3, delta);
      cam.updateProjectionMatrix();
    }
  });

  return null;
}

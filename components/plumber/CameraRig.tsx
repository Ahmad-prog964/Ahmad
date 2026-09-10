"use client";

import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { usePlumberStore } from "@/store/usePlumberStore";
import { CTA_CAM, getCameraState } from "@/lib/plumber/timeline";

const tmpPos = new THREE.Vector3();
const tmpTarget = new THREE.Vector3();

export default function CameraRig() {
  const { camera, pointer } = useThree();
  const targetRef = useRef(new THREE.Vector3(0, 1, 0));
  const introOffset = useRef(0);

  useFrame((_, delta) => {
    const { progress, ctaProgress, introDone } = usePlumberStore.getState();
    const base = getCameraState(progress);

    tmpPos.set(...base.position);
    tmpTarget.set(...base.target);
    let fov = base.fov;

    if (ctaProgress > 0) {
      tmpPos.lerp(new THREE.Vector3(...CTA_CAM.pos), ctaProgress);
      tmpTarget.lerp(new THREE.Vector3(...CTA_CAM.target), ctaProgress);
      fov = fov + (CTA_CAM.fov - fov) * ctaProgress;
    }

    if (!introDone) {
      introOffset.current += delta;
      const t = Math.min(1, introOffset.current / 3.2);
      const ease = t * t * (3 - 2 * t);
      tmpPos.lerp(new THREE.Vector3(1, 2.6, 8), 1 - ease);
      fov = 46 + (fov - 46) * ease;
    }

    const parallaxX = pointer.x * 0.15;
    const parallaxY = pointer.y * 0.08;

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

"use client";

import { create } from "zustand";
import type { StageId } from "@/lib/timeline";

interface SceneState {
  assetsReady: boolean;
  introDone: boolean;
  progress: number; // 0..1 across the whole cinematic film section
  stageId: StageId;
  ctaProgress: number; // 0..1, independent, drives the closing CTA shot
  hoveredService: string | null;
  lowPower: boolean;

  setAssetsReady: (v: boolean) => void;
  setIntroDone: (v: boolean) => void;
  setProgress: (v: number) => void;
  setStageId: (v: StageId) => void;
  setCtaProgress: (v: number) => void;
  setHoveredService: (v: string | null) => void;
  setLowPower: (v: boolean) => void;
}

export const useSceneStore = create<SceneState>((set) => ({
  assetsReady: false,
  introDone: false,
  progress: 0,
  stageId: "hero",
  ctaProgress: 0,
  hoveredService: null,
  lowPower: false,

  setAssetsReady: (v) => set({ assetsReady: v }),
  setIntroDone: (v) => set({ introDone: v }),
  setProgress: (v) => set({ progress: v }),
  setStageId: (v) => set({ stageId: v }),
  setCtaProgress: (v) => set({ ctaProgress: v }),
  setHoveredService: (v) => set({ hoveredService: v }),
  setLowPower: (v) => set({ lowPower: v }),
}));

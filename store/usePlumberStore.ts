"use client";

import { create } from "zustand";
import type { StageId } from "@/lib/plumber/timeline";

interface PlumberState {
  introDone: boolean;
  progress: number;
  stageId: StageId;
  ctaProgress: number;
  lowPower: boolean;
  setIntroDone: (v: boolean) => void;
  setProgress: (v: number) => void;
  setStageId: (v: StageId) => void;
  setCtaProgress: (v: number) => void;
  setLowPower: (v: boolean) => void;
}

export const usePlumberStore = create<PlumberState>((set) => ({
  introDone: false,
  progress: 0,
  stageId: "hero",
  ctaProgress: 0,
  lowPower: false,
  setIntroDone: (v) => set({ introDone: v }),
  setProgress: (v) => set({ progress: v }),
  setStageId: (v) => set({ stageId: v }),
  setCtaProgress: (v) => set({ ctaProgress: v }),
  setLowPower: (v) => set({ lowPower: v }),
}));

import { clamp01, localT, smoothstep, sampleCameraKeyframes, getRangeVisibility, type CamKey, type Vec3 } from "@/lib/scrollMath";

export type StageId = "hero" | "approach" | "leak" | "fix" | "inside" | "services" | "callout" | "area";

export interface Stage {
  id: StageId;
  start: number;
  end: number;
  label: string;
}

export const STAGES: Stage[] = [
  { id: "hero", start: 0.0, end: 0.07, label: "PLUMBING & HEATING.\nDONE RIGHT, DAY OR NIGHT." },
  { id: "approach", start: 0.07, end: 0.16, label: "" },
  { id: "leak", start: 0.16, end: 0.3, label: "BURST PIPE? LEAKING TAP?\nBOILER ON THE BLINK?" },
  { id: "fix", start: 0.3, end: 0.44, label: "WE FIX IT ON THE SPOT." },
  { id: "inside", start: 0.44, end: 0.58, label: "DIAGNOSED. REPAIRED. GUARANTEED." },
  { id: "services", start: 0.58, end: 0.78, label: "" },
  { id: "callout", start: 0.78, end: 0.88, label: "WE COME TO YOU.\n24/7 — day or night." },
  { id: "area", start: 0.88, end: 1.0, label: "WE COME TO YOU.\nGet in touch today." },
];

export function getStage(progress: number): Stage {
  const p = clamp01(progress);
  return STAGES.find((s) => p >= s.start && p < s.end) ?? STAGES[STAGES.length - 1];
}

export function getStageVisibility(progress: number, stageId: StageId) {
  const stage = STAGES.find((s) => s.id === stageId);
  return stage ? getRangeVisibility(progress, stage) : 0;
}

/**
 * Camera keyframes across the whole film — orbiting the pipe rig, then the boiler cutaway.
 * The rig is small (~2m across), so distances here are deliberately much shorter than a
 * car-scale scene; keep every target-to-position distance >= ~1.5 units to avoid clipping
 * into the pipework at these focal lengths.
 */
export const CAMERA_KEYFRAMES: CamKey[] = [
  { t: 0.0, pos: [3.0, 1.6, 3.0], target: [0, 1.0, 0], fov: 30 },
  { t: 0.07, pos: [2.7, 1.5, 2.7], target: [0, 1.0, 0], fov: 30 },
  { t: 0.16, pos: [2.1, 1.4, 2.1], target: [0.25, 1.05, 0], fov: 27 },
  { t: 0.3, pos: [1.7, 1.35, 1.75], target: [0.5, 1.15, 0], fov: 25 },
  { t: 0.44, pos: [1.35, 1.3, 1.5], target: [0.55, 1.15, 0.05], fov: 23 },
  { t: 0.58, pos: [-0.3, 1.2, 1.6], target: [-1.4, 1.0, 0.05], fov: 26 },
  { t: 0.78, pos: [1.9, 1.55, 2.7], target: [-0.2, 1.0, 0], fov: 28 },
  { t: 0.88, pos: [0, 1.9, 3.7], target: [0, 0.9, 0], fov: 32 },
  { t: 0.94, pos: [0, 3.3, 1.7], target: [0, 0, -1.2], fov: 36 },
  { t: 1.0, pos: [0, 4.7, 0.2], target: [0, 0, 0], fov: 40 },
];

export function getCameraState(progress: number) {
  return sampleCameraKeyframes(CAMERA_KEYFRAMES, progress);
}

/** 0..1 leak intensity — builds through "leak", cut off sharply once the wrench tightens in "fix". */
export function getLeakIntensity(progress: number) {
  const building = smoothstep(localT(progress, 0.17, 0.28));
  const shutOff = 1 - smoothstep(localT(progress, 0.32, 0.38));
  return progress < 0.32 ? building : building * shutOff;
}

/** 0 (off to the side) .. 1 (tightened onto the joint), during "fix". */
export function getWrenchProgress(progress: number) {
  return smoothstep(localT(progress, 0.29, 0.4));
}

/** 0..1 crossfade into the boiler cutaway view during "inside". */
export function getCutawayFocus(progress: number) {
  return smoothstep(localT(progress, 0.44, 0.5)) * (1 - smoothstep(localT(progress, 0.76, 0.82)));
}

const SERVICE_SLOT_COUNT = 6;

/**
 * Which of the 6 service slots is active during the "services" stage, as a plain index
 * (-1 outside the stage) — kept business-agnostic so any business's own `services` array,
 * of the same length, can be indexed by it.
 */
export function getActiveServiceIndex(progress: number) {
  const stage = STAGES.find((s) => s.id === "services")!;
  if (progress < stage.start || progress >= stage.end) return -1;
  const t = localT(progress, stage.start, stage.end);
  return Math.min(SERVICE_SLOT_COUNT - 1, Math.floor(t * SERVICE_SLOT_COUNT));
}

/** The rig sinks out of frame once the story moves to "callout"/"area" text, so it stops crowding those shots. */
export function getRigExitOffset(progress: number) {
  return -smoothstep(localT(progress, 0.76, 0.9)) * 3.5;
}

export const CTA_CAM: { pos: Vec3; target: Vec3; fov: number } = {
  pos: [1.6, 1.35, 1.75],
  target: [0.5, 1.15, 0],
  fov: 24,
};

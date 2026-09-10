import { CAR } from "@/lib/carGeometry";

export type StageId =
  | "hero"
  | "approach"
  | "drive"
  | "frontStop"
  | "bonnetOpen"
  | "engineBay"
  | "services"
  | "driveAway"
  | "london";

export interface Stage {
  id: StageId;
  start: number;
  end: number;
  label: string;
}

/** Ordered stage ranges across the single continuous scroll-scrubbed film, progress 0..1. */
export const STAGES: Stage[] = [
  { id: "hero", start: 0.0, end: 0.07, label: "MOBILE MECHANIC.\nWE COME TO YOU." },
  { id: "approach", start: 0.07, end: 0.16, label: "" },
  { id: "drive", start: 0.16, end: 0.3, label: "" },
  { id: "frontStop", start: 0.3, end: 0.37, label: "SOMETHING WRONG?" },
  { id: "bonnetOpen", start: 0.37, end: 0.47, label: "WE FIND THE PROBLEM." },
  { id: "engineBay", start: 0.47, end: 0.58, label: "DIAGNOSTICS. ELECTRICAL. ENGINE." },
  { id: "services", start: 0.58, end: 0.76, label: "" },
  { id: "driveAway", start: 0.76, end: 0.86, label: "WE COME TO YOU.\nHome. Workplace. Roadside." },
  { id: "london", start: 0.86, end: 1.0, label: "MOBILE MECHANIC\nACROSS LONDON" },
];

/** Fade a stage's text in for the first quarter of its range, hold, fade out the last quarter. */
export function getStageVisibility(progress: number, stageId: StageId) {
  const stage = STAGES.find((s) => s.id === stageId);
  if (!stage) return 0;
  const span = stage.end - stage.start;
  const inEnd = stage.start + span * 0.25;
  const outStart = stage.end - span * 0.25;
  if (progress < stage.start || progress > stage.end) return 0;
  if (stage.start === 0) return progress > outStart ? 1 - smoothstep(localT(progress, outStart, stage.end)) : 1;
  if (progress < inEnd) return smoothstep(localT(progress, stage.start, inEnd));
  if (progress > outStart) return 1 - smoothstep(localT(progress, outStart, stage.end));
  return 1;
}

export function getStage(progress: number): Stage {
  const p = clamp01(progress);
  return STAGES.find((s) => p >= s.start && p < s.end) ?? STAGES[STAGES.length - 1];
}

export function clamp01(v: number) {
  return Math.min(1, Math.max(0, v));
}

/** Remap progress within [a,b] to a 0..1 local t, clamped. */
export function localT(p: number, a: number, b: number) {
  if (b <= a) return 0;
  return clamp01((p - a) / (b - a));
}

export function smoothstep(t: number) {
  return t * t * (3 - 2 * t);
}

/**
 * Forward drive offset (meters) applied to the car root — real translation, not a camera trick.
 * During "drive" this is a there-and-back bump (the car creeps forward with the camera, then
 * settles back to its resting spot) so every later stage's camera keyframes stay valid relative
 * to a car sitting at z=0. Only the final "driveAway" pull leaves a lasting offset, since nothing
 * after it depends on the car's exact position.
 */
export function getCarDriveOffset(progress: number) {
  const driveT = localT(progress, 0.18, 0.3);
  const driving = smoothstep(1 - Math.abs(driveT - 0.5) * 2) * 1.1;
  const pullingAway = smoothstep(localT(progress, 0.78, 0.86)) * 9;
  return (driving + pullingAway) * CAR.frontSign * -1;
}

type Vec3 = readonly [number, number, number];

interface CamKey {
  t: number;
  pos: Vec3;
  target: Vec3;
  fov: number;
}

const frontZ = CAR.frontZ * CAR.frontSign;
const rearZ = CAR.rearZ * CAR.frontSign;

/** Camera keyframes across the whole film. Interpolated with per-segment smoothstep easing. */
export const CAMERA_KEYFRAMES: CamKey[] = [
  { t: 0.0, pos: [4.6, 1.7, 3.6], target: [0, 0.65, 0.3], fov: 32 },
  { t: 0.07, pos: [4.2, 1.6, 3.2], target: [0, 0.65, 0.3], fov: 32 },
  { t: 0.16, pos: [2.9, 1.35, 2.6], target: [0, 0.65, 0.6], fov: 30 },
  { t: 0.3, pos: [0.6, 1.05, frontZ + 2.6], target: [0, 0.7, frontZ], fov: 28 },
  { t: 0.37, pos: [2.6, 2.3, frontZ + 2.6], target: [0, 0.5, frontZ * 0.35], fov: 28 },
  { t: 0.47, pos: [1.8, 2.1, frontZ + 1.6], target: [0, 0.5, frontZ * 0.2], fov: 26 },
  { t: 0.58, pos: [2.8, 1.9, frontZ + 2.9], target: [0, 0.6, frontZ * 0.4], fov: 28 },
  { t: 0.76, pos: [0, 1.4, frontZ + 3.2], target: [0, 0.7, frontZ], fov: 30 },
  { t: 0.86, pos: [0, 3.0, 1.6], target: [0, 0, -1.5], fov: 38 },
  { t: 1.0, pos: [0, 5.2, 0.15], target: [0, 0, 0], fov: 42 },
];

export function getCameraState(progress: number) {
  const p = clamp01(progress);
  const keys = CAMERA_KEYFRAMES;
  let i = 0;
  while (i < keys.length - 2 && p > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const segT = smoothstep(localT(p, a.t, b.t));
  const position = lerp3(a.pos, b.pos, segT);
  const target = lerp3(a.target, b.target, segT);
  const fov = a.fov + (b.fov - a.fov) * segT;
  return { position, target, fov };
}

function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

/** Bonnet hinge rotation 0 (closed) .. 1 (open), across bonnetOpen -> services, closing during driveAway. */
export function getHoodOpen(progress: number) {
  const open = localT(progress, 0.36, 0.47);
  const close = 1 - localT(progress, 0.76, 0.82);
  return Math.min(smoothstep(open), progress < 0.76 ? 1 : smoothstep(close));
}

/** Subtle ambient headlight glow that builds from the approach onward (full beam reserved for the CTA). */
export function getHeadlightGlow(progress: number) {
  return 0.28 * smoothstep(localT(progress, 0.07, 0.16));
}

export const SERVICE_IDS = [
  "diagnostics",
  "servicing",
  "brakes",
  "battery",
  "engine-repairs",
  "electrical",
] as const;
export type ServiceId = (typeof SERVICE_IDS)[number];

/** Which service bucket is active during the `services` stage, or null outside it. */
export function getActiveService(progress: number): ServiceId | null {
  const stage = STAGES.find((s) => s.id === "services")!;
  if (progress < stage.start || progress >= stage.end) return null;
  const t = localT(progress, stage.start, stage.end);
  const idx = Math.min(SERVICE_IDS.length - 1, Math.floor(t * SERVICE_IDS.length));
  return SERVICE_IDS[idx];
}

/** 0..1 bump, peaking mid-bucket, used to blend the camera toward the front-left wheel during "brakes". */
export function getBrakeCamWeight(progress: number) {
  const stage = STAGES.find((s) => s.id === "services")!;
  if (progress < stage.start || progress >= stage.end) return 0;
  const bucketSize = (stage.end - stage.start) / SERVICE_IDS.length;
  const brakeIndex = SERVICE_IDS.indexOf("brakes");
  const bucketStart = stage.start + bucketSize * brakeIndex;
  const bucketEnd = bucketStart + bucketSize;
  const t = localT(progress, bucketStart, bucketEnd);
  return smoothstep(1 - Math.abs(t - 0.5) * 2);
}

export const WHEEL_CAM: { pos: Vec3; target: Vec3 } = {
  pos: [-2.2, 0.85, frontZ - 0.7],
  target: [-CAR.width * 0.5 + 0.15, 0.35, frontZ - 1.35],
};

export const REAR_Z = rearZ;
export const FRONT_Z = frontZ;

/** Closing CTA shot — the car returns to frame, headlights full beam. */
export const CTA_CAM: { pos: Vec3; target: Vec3; fov: number } = {
  pos: [0, 1.05, frontZ + 2.1],
  target: [0, 0.75, frontZ],
  fov: 26,
};

/** Abstract route for the stylised London section — not real street data. */
export const LONDON_ROUTE: Vec3[] = [
  [-3.6, 0.02, -2.4],
  [-2.1, 0.02, -1.6],
  [-1.4, 0.02, -0.4],
  [-0.2, 0.02, -0.1],
  [0.9, 0.02, -1.1],
  [2.0, 0.02, -0.6],
  [3.2, 0.02, -1.8],
];

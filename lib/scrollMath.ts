/** Shared scroll/timeline math used by every business's story timeline. */

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

export type Vec3 = readonly [number, number, number];

export function lerp3(a: Vec3, b: Vec3, t: number): Vec3 {
  return [a[0] + (b[0] - a[0]) * t, a[1] + (b[1] - a[1]) * t, a[2] + (b[2] - a[2]) * t];
}

export interface CamKey {
  t: number;
  pos: Vec3;
  target: Vec3;
  fov: number;
}

/** Interpolate a sorted camera-keyframe list at progress `p`, smoothstep-eased per segment. */
export function sampleCameraKeyframes(keys: CamKey[], p: number) {
  const progress = clamp01(p);
  let i = 0;
  while (i < keys.length - 2 && progress > keys[i + 1].t) i++;
  const a = keys[i];
  const b = keys[i + 1];
  const segT = smoothstep(localT(progress, a.t, b.t));
  return {
    position: lerp3(a.pos, b.pos, segT),
    target: lerp3(a.target, b.target, segT),
    fov: a.fov + (b.fov - a.fov) * segT,
  };
}

export interface StageRange {
  start: number;
  end: number;
}

/** Fade in for the first quarter of a stage's range, hold, fade out the last quarter. */
export function getRangeVisibility(progress: number, stage: StageRange) {
  const span = stage.end - stage.start;
  const inEnd = stage.start + span * 0.25;
  const outStart = stage.end - span * 0.25;
  if (progress < stage.start || progress > stage.end) return 0;
  if (stage.start === 0) return progress > outStart ? 1 - smoothstep(localT(progress, outStart, stage.end)) : 1;
  if (progress < inEnd) return smoothstep(localT(progress, stage.start, inEnd));
  if (progress > outStart) return 1 - smoothstep(localT(progress, outStart, stage.end));
  return 1;
}

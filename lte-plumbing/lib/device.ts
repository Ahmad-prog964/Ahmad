export function hasWebGL() {
  if (typeof window === "undefined") return true;
  try {
    const canvas = document.createElement("canvas");
    return !!(
      canvas.getContext("webgl2") ||
      canvas.getContext("webgl") ||
      canvas.getContext("experimental-webgl")
    );
  } catch {
    return false;
  }
}

export function isLowPowerDevice() {
  if (typeof window === "undefined") return false;
  const cores = navigator.hardwareConcurrency ?? 8;
  const mem = (navigator as Navigator & { deviceMemory?: number }).deviceMemory ?? 8;
  const narrow = window.innerWidth < 768;
  const reducedMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
  return reducedMotion || cores <= 4 || mem <= 4 || narrow;
}

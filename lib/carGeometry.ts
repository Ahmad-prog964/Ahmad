/**
 * Measured from public/models/car-concept.glb (Khronos "CarConcept" sample asset,
 * CC-BY 4.0, © Darmstadt Graphics Group GmbH — see public/models/CREDITS.md).
 *
 * bboxMin (-1.27, 0, -1.94) / bboxMax (1.27, 1.15, 2.42) in local units.
 * The model rests on y = 0. CAR_FRONT_SIGN flips which end (+Z or -Z) is the
 * front/bonnet — verified visually once the scene renders; flip this single
 * constant if the car is discovered to be facing the wrong way.
 */
export const CAR = {
  width: 2.55,
  height: 1.15,
  length: 4.36,
  frontZ: 2.42,
  rearZ: -1.94,
  frontSign: 1 as 1 | -1,
};

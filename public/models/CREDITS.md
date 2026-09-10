# 3D Model Credits

## car-concept.glb

- **Source:** ["CarConcept"](https://github.com/KhronosGroup/glTF-Sample-Assets/tree/main/Models/CarConcept) from the Khronos Group glTF-Sample-Assets repository.
- **Author:** © 2024, Darmstadt Graphics Group GmbH (model and textures: Eric Chadwick). Khronos/3D Commerce logo usage © Khronos Group.
- **License:** [Creative Commons Attribution 4.0 International (CC-BY 4.0)](https://creativecommons.org/licenses/by/4.0/)
- **Modifications:** Textures resized to 1024px and converted to WebP, and geometry Draco-compressed for web delivery via `@gltf-transform/cli`. Node hierarchy and names (body panels, `BodyHood`, `WheelFrontL/R`, `WheelRearL/R`, brake discs/pads, `BodyHeadlights`, doors) were preserved unmodified so the site can drive real hinge/wheel/brake animations from the original rig.

**Status: placeholder asset.** This is a stand-in used to build and prove out the real interaction rig (hood hinge rotation, wheel roll, brake-disc/caliper highlight, headlight emissive). Swap in the final branded vehicle GLB — matching the same node-naming convention — when available; the camera and animation code will continue to work unchanged as long as equivalent node names exist.

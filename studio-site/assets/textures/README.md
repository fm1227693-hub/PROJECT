# `assets/textures/`

Optional PBR maps. `js/core/materials.js` generates roughness/normal/metalness/detail
maps procedurally on canvas at boot (brushed metal, fine grain, anisotropic streaks),
which keeps the payload at zero and avoids colour-space mistakes.

To use real maps instead, drop them here and reference them in `MaterialLib`
(`js/core/materials.js`). Rules:

* colour maps (`map`, `emissiveMap`) → `texture.colorSpace = THREE.SRGBColorSpace`
* data maps (`roughnessMap`, `metalnessMap`, `normalMap`, `aoMap`) → leave as
  `NoColorSpace` (the default) or the shading will be wrong
* 1024² is plenty for anything this close to camera; set `anisotropy` to
  `renderer.capabilities.getMaxAnisotropy()` for grazing angles
* CC0 sources: Poly Haven textures, ambientCG

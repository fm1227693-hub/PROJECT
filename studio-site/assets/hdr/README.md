# `assets/hdr/`

Drop **`studio.hdr`** here and it replaces the procedural studio IBL automatically
(`js/core/config.js → ASSETS.hdri`, loaded by `js/core/env.js` through `HDRLoader` +
`PMREMGenerator`). If the file is missing, slow (>4 s) or fails to decode, the build
falls back to the procedural studio — no error, no blank lighting.

## Recommended (CC0)

Poly Haven — *Studio Small 09*:

```
curl -L -o assets/hdr/studio.hdr \
  https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr
```

* Licence: CC0 (no attribution required) — https://polyhaven.com/license
* 1k is enough: the map is convolved by PMREM, so higher resolutions add bytes, not detail.
* Alternates that suit this look: `studio_small_03`, `studio_large`, `photo_studio_loft_hall`.

## Using a different file

Change `ASSETS.hdri` in `js/core/config.js` to the new path. Keep it same-origin:
a cross-origin HDRI needs `crossOrigin` support on the host plus correct CORS headers.

> Note: the mapping is set manually after load
> (`hdr.mapping = THREE.EquirectangularReflectionMapping`) because r185's `HDRLoader`
> does not set it. `RGBELoader` is deprecated in this version — do not switch back.

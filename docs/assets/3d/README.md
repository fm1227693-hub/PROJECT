# `assets/3d/`

Drop **`hero.glb`** here to replace the procedural hero sculpture. `js/core/scene.js`
loads it with `GLTFLoader` at boot and hands it to `SculptureStage.attachModel()`,
which auto-scales it to the monolith's height, recentres it on the plinth and rebuilds
its materials as polished chrome with the same liquid-displacement shader injection —
so an imported model still reacts to scroll velocity, pointer and section atmosphere.

If the file is missing, nothing happens: the procedural figure stays.

## Sourcing (licence-checked only)

* **Poly Haven — Models**: CC0. e.g. https://polyhaven.com/models
* **Sketchfab**: only download assets whose licence you have read on the asset page.
  CC-BY requires attribution — record the author and licence in this file when used.
* Never hotlink a third-party CDN from production.

## Preparation

1. Export glTF-Binary (`.glb`), Y-up, metres, origin at the base of the object.
2. Compress: `gltf-transform optimize in.glb hero.glb --compress draco` (or meshopt).
3. Budget: ≤ 2 MB, ≤ 120k triangles, no embedded animation you do not use.
4. Strip materials you do not need — they are replaced at runtime anyway.

| File        | Licence | Author | Notes                |
|-------------|---------|--------|----------------------|
| _(none yet)_| —       | —      | procedural fallback  |

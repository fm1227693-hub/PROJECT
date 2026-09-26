# Asset pipeline

Everything the experience draws is **procedural by default** — geometry, materials,
environment lighting, textures and the 2D generative art are generated at runtime,
so the site ships with zero binary payload and works offline.

The folders below are the *upgrade path*: drop real assets in and they are picked up
automatically, with a graceful fallback if a file is missing.

| Folder      | Used for                                    | Optional? | Fallback                          |
|-------------|---------------------------------------------|-----------|-----------------------------------|
| `hdr/`      | Image-based lighting (`.hdr` equirect)      | yes       | procedural studio IBL (`js/core/env.js`) |
| `3d/`       | hero sculpture (`hero.glb`)                 | yes       | procedural monolith (`js/core/geometry.js`) |
| `textures/` | PBR maps (roughness/normal/metalness)       | yes       | procedural canvas maps (`js/core/materials.js`) |
| `images/`   | OG image, favicons, static plates           | yes       | —                                 |
| `videos/`   | showreel source (if a real film is supplied)| yes       | live generative film render       |
| `fonts/`    | self-hosted Inter Tight / JetBrains Mono    | yes       | Google Fonts CDN                  |

## Licensing rules

* **Poly Haven** — CC0, no attribution required. Preferred source for HDRIs and textures.
* **Sketchfab** — only assets whose licence is explicitly verified (CC0 / CC-BY with
  attribution recorded in this file). Never hotlink; download, optimise, self-host.
* **Brand work** — never ship a client's asset without written permission.

## Optimisation checklist

* `.hdr` → 1k or 2k is plenty for IBL (it is blurred by PMREM anyway). 1k ≈ 1.5 MB.
* `.glb` → Draco/meshopt compressed, ≤ 2 MB, single material set, no animation tracks
  you do not use. Keep the mesh under ~120k triangles.
* textures → 1024² max for PBR maps, `.jpg`/`.webp` for colour, `.png` only for masks.
* video → H.264 + WebM, ≤ 8 MB for a loop, `preload="metadata"`.

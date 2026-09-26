# `assets/videos/`

The showreel is currently a **live generative film render** (`painters.film`):
anamorphic lights, volumetric sweeps, film-stock grain and a burned-in timecode,
drawn per frame on canvas. It stays sharp at any size, costs one canvas, and needs no
video decode.

If a real showreel is supplied, drop it here and swap the reel painter for a
`<video>` texture:

```
showreel.mp4   H.264, 1080p, ≤ 8 MB, muted, playsinline, preload="metadata"
showreel.webm  VP9 fallback
```

Rules: never autoplay with sound; keep `muted playsinline loop` for background use;
serve WebM + MP4; poster frame required so the preloader has something honest to show.

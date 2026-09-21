// Capability detection, evaluated once on mount.
// Everything motion-related keys off this object instead of sniffing user agents.

const mq = (q) => (typeof window !== 'undefined' && window.matchMedia ? window.matchMedia(q).matches : false)

export function getCapabilities() {
  const reduced = mq('(prefers-reduced-motion: reduce)')
  const fine = mq('(hover: hover) and (pointer: fine)')
  const coarse = mq('(pointer: coarse)') || (typeof navigator !== 'undefined' && navigator.maxTouchPoints > 0 && !fine)
  const desktop = mq('(min-width: 64rem)')
  const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1

  return {
    reduced,
    fine,
    touch: coarse,
    desktop,
    /** Smooth scrolling + pinned scenes: desktop, fine pointer, motion allowed. */
    smooth: desktop && fine && !reduced,
    /** Pinned, scrubbed set-pieces. Touch devices get a lighter, unpinned variant. */
    pin: desktop && !reduced,
    /** Custom cursor + pointer parallax. Never on touch. */
    cursor: fine && !reduced,
    /** Scale factor for every parallax distance. */
    parallax: reduced ? 0 : coarse ? 0.4 : 1,
    /** WebGL pixel ratio budget. */
    dpr: Math.min(dpr, coarse ? 1 : 1.5),
  }
}

/**
 * True only when the browser exposes hardware-accelerated WebGL.
 * Software renderers (SwiftShader, llvmpipe) would burn the main thread for a
 * decorative object, so callers keep the CSS fallback instead.
 */
export function hasUsableWebGL() {
  try {
    const canvas = document.createElement('canvas')
    const opts = { failIfMajorPerformanceCaveat: true, powerPreference: 'high-performance' }
    const gl = canvas.getContext('webgl2', opts) || canvas.getContext('webgl', opts)
    if (!gl) return false
    const info = gl.getExtension('WEBGL_debug_renderer_info')
    const renderer = info ? String(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)) : ''
    gl.getExtension('WEBGL_lose_context')?.loseContext()
    return !/swiftshader|llvmpipe|software/i.test(renderer)
  } catch {
    return false
  }
}

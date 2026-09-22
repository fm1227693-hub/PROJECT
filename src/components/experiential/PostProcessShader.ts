/**
 * LUSION — PostProcessShader — ULTRA LIGHTWEIGHT
 * Previously caused lag via texImage2D per frame + getImageData
 * Now: CSS filter based chromatic aberration, WebGL optional and disabled by default
 * Formulas preserved but executed via cheap CSS
 */

export interface PostProcessShaderOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

// Lightweight CSS-based chromatic aberration — no canvas pixel manipulation
export function applyChromaticAberration2D(
  element: HTMLElement,
  dispersion: number,
  velocity: number
): void {
  const d = Math.min(dispersion * 120, 3)
  const v = Math.min(velocity * 0.3, 2)

  if (d < 0.01 && v < 0.05) {
    element.style.filter = 'none'
    element.style.transform = 'none'
    return
  }

  // Cheap CSS filter — GPU accelerated, no getImageData
  const blur = Math.min(velocity * 0.04, 2)
  const scale = 1 + Math.min(velocity * 0.0003, 0.02)

  element.style.filter = `blur(${blur}px) drop-shadow(${d}px 0px 0px rgba(255,0,80,0.12)) drop-shadow(${-d}px 0px 0px rgba(0,200,255,0.12))`
  element.style.transform = `scale(${scale})`
  element.style.willChange = 'filter, transform'
}

export function calculateDispersion(progress: number): number {
  if (progress < 0.18) return 0
  if (progress <= 0.4) {
    return Math.sin(((progress - 0.18) / 0.22) * Math.PI) * 0.015
  }
  if (progress < 0.72) {
    return 0.008 + Math.sin(progress * 8) * 0.002
  }
  return Math.max(0, 0.008 * (1 - (progress - 0.72) / 0.13))
}

// Optional WebGL shader — disabled by default for performance, kept for API compatibility
export class PostProcessShader {
  private enabled = false
  constructor(_options: PostProcessShaderOptions) {
    // Disabled for lag-free mode — use CSS path instead
    this.enabled = false
  }

  public render(_sourceCanvas: HTMLCanvasElement, _uniforms: { time: number; progress: number; velocity: number; dispersion: number }): void {
    if (!this.enabled) return
  }

  public destroy(): void {
    this.enabled = false
  }
}

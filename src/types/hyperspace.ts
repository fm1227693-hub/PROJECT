/**
 * LUSION — Hyperspace Types — Strict TypeScript, no any
 * High-performance HTML5 Canvas Frame-Scrubber + WebGL chromatic aberration
 */

export interface HyperspacePhase {
  index: 1 | 2 | 3 | 4 | 5
  name: 'GATE' | 'PLUNGE' | 'TUNNEL' | 'DECELERATION' | 'EXPANSION'
  progressRange: [number, number]
}

export interface FrameScrubberProps {
  videoSrc: string
  totalFrames: number
  currentProgress: number
  scrollVelocity: number
  isHovering?: boolean
  className?: string
  onFrameUpdate?: (frameIndex: number) => void
}

export interface CanvasFrameScrubberRef {
  canvas: HTMLCanvasElement | null
  video: HTMLVideoElement | null
  getCurrentFrame: () => number
  seekToFrame: (frameIndex: number) => void
}

export interface LenisScrubDriverOptions {
  lerp?: number
  wheelMultiplier?: number
  smoothWheel?: boolean
  infinite?: boolean
  easing?: (t: number) => number
}

export interface LenisScrubDriverReturn {
  lenis: import('lenis').default | null
  scrollProgress: number
  scrollVelocity: number
  scrollY: number
  scrollTo: (target: number | string | HTMLElement, options?: Record<string, unknown>) => void
}

export interface MediaFrame {
  index: number
  bitmap: ImageBitmap | null
  timestamp: number
  loaded: boolean
}

export interface MediaFrameLoaderOptions {
  videoSrc: string
  totalFrames: number
  preloadCount?: number
  onProgress?: (loaded: number, total: number) => void
  onComplete?: () => void
}

export interface MediaFrameLoaderReturn {
  frames: MediaFrame[]
  video: HTMLVideoElement | null
  isLoading: boolean
  isComplete: boolean
  progress: number
  getFrame: (index: number) => MediaFrame | null
  preload: () => Promise<void>
  destroy: () => void
}

export interface HyperspaceOverlayProps {
  progress: number
  phase?: number
  scrollVelocity: number
  isHovering?: boolean
  className?: string
}

export interface AstronautPortalExperienceProps {
  videoSrc?: string
  totalFrames?: number
  className?: string
}

export interface PostProcessUniforms {
  uTime: number
  uProgress: number
  uScrollVelocity: number
  uDispersion: number
  uResolution: [number, number]
}

export interface DrawImageCoverOptions {
  sourceWidth: number
  sourceHeight: number
  destWidth: number
  destHeight: number
}

export interface DrawImageCoverResult {
  sx: number
  sy: number
  sWidth: number
  sHeight: number
  dx: number
  dy: number
  dWidth: number
  dHeight: number
}

export interface ScrollMetrics {
  scrollY: number
  velocity: number
  progress: number
  direction: number
  deltaTime: number
}

export type HyperspaceRealm = 'QUANTUM_MATRIX' | 'NEON_CYBER' | 'CRYSTAL_SHARDS' | 'COBALT_VOID'

export interface RealmConfig {
  id: HyperspaceRealm
  colorPrimary: string
  colorSecondary: string
  progressRange: [number, number]
  name: string
}

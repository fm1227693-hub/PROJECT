/**
 * LUSION — Project Types
 * Production-ready TypeScript interfaces for portfolio entries
 */

export interface ProjectTag {
  label: string
  color?: string
}

export interface ProjectMedia {
  type: 'video' | 'image' | 'webgl'
  src: string
  poster?: string
  alt?: string
}

export interface Project {
  id: string
  title: string
  subtitle?: string
  category: string
  tags: string[] // e.g., ['WEB', 'DESIGN', 'DEVELOPMENT', '3D'] or ['WEB', 'DC7RA']
  media: ProjectMedia
  color: string // fallback bg
  year?: string
  link?: string
  featured?: boolean
}

export interface ProjectCardProps {
  project: Project
  index: number
  onHoverChange?: (hovering: boolean, index: number) => void
}

export interface ParallaxProjectGridProps {
  projects?: Project[]
  className?: string
}

export interface EditorialBreakProps {
  scrollProgress?: number
  className?: string
}

export type ProjectCategory = 'AI PRODUCT' | 'DATA VIZ' | 'WEB3 MOTION' | 'EVENT BRANDING' | 'EXPERIMENTAL 3D' | 'LAB R&D' | 'WEB' | 'DESIGN' | 'DEVELOPMENT' | '3D'

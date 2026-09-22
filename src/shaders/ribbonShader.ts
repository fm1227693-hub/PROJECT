import { elasticWarpVert } from './elasticWarp.vert'
import { elasticWarpFrag } from './elasticWarp.frag'

export const ribbonVertexShader = elasticWarpVert
export const ribbonFragmentShader = elasticWarpFrag

export default {
  vertex: ribbonVertexShader,
  fragment: ribbonFragmentShader,
}

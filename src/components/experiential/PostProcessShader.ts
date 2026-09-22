/**
 * LUSION — PostProcessShader — WebGL/GLSL chromatic aberration & lens distortion
 * High-performance post-processing for 120 FPS kinetic scrubbing
 */

export interface PostProcessShaderOptions {
  canvas: HTMLCanvasElement
  width: number
  height: number
}

export class PostProcessShader {
  private gl: WebGL2RenderingContext | null = null
  private program: WebGLProgram | null = null
  private quadBuffer: WebGLBuffer | null = null
  private texture: WebGLTexture | null = null
  private timeUniform: WebGLUniformLocation | null = null
  private progressUniform: WebGLUniformLocation | null = null
  private velocityUniform: WebGLUniformLocation | null = null
  private dispersionUniform: WebGLUniformLocation | null = null
  private resolutionUniform: WebGLUniformLocation | null = null

  private vertShaderSource = `#version 300 es
    precision highp float;
    in vec2 aPosition;
    in vec2 aUv;
    out vec2 vUv;
    void main(){
      vUv = aUv;
      gl_Position = vec4(aPosition, 0.0, 1.0);
    }
  `

  private fragShaderSource = `#version 300 es
    precision highp float;

    uniform sampler2D uTexture;
    uniform float uTime;
    uniform float uProgress;
    uniform float uVelocity;
    uniform float uDispersion;
    uniform vec2 uResolution;

    in vec2 vUv;
    out vec4 outColor;

    // Lens distortion
    vec2 lensDistort(vec2 uv, float k){
      vec2 c = uv - 0.5;
      float r2 = dot(c,c);
      float f = 1.0 + r2 * k;
      return c * f + 0.5;
    }

    void main(){
      vec2 uv = vUv;

      // Dynamic lens distortion based on progress
      float distortion = uProgress * 0.15 + uVelocity * 0.08;
      uv = lensDistort(uv, distortion * 0.5);

      // Chromatic aberration — R,G,B offset
      float edge = length(uv - 0.5) * 2.0;
      float aberration = uDispersion * (1.0 + edge * 1.2 + uVelocity * 0.6);

      vec2 rUv = uv + vec2(aberration, 0.0);
      vec2 gUv = uv + vec2(aberration * 0.35, 0.0);
      vec2 bUv = uv - vec2(aberration, 0.0);

      // Velocity smear
      float smear = uVelocity * 0.008;
      rUv.y += smear;
      bUv.y -= smear;

      float r = texture(uTexture, rUv).r;
      float g = texture(uTexture, gUv).g;
      float b = texture(uTexture, bUv).b;

      vec3 col = vec3(r,g,b);

      // Fresnel rim for portal
      float fres = pow(1.0 - max(dot(vec3(0.0,0.0,1.0), vec3(0.0,0.0,1.0)), 0.0), 3.0);
      col += fres * 0.08;

      // Vignette
      float vign = 1.0 - dot(uv - 0.5, uv - 0.5) * 0.5;
      col *= vign;

      // Film grain
      float grain = fract(sin(dot(uv * uTime * 0.01, vec2(12.9898,78.233))) * 43758.5453) * 0.008 - 0.004;
      col += grain;

      outColor = vec4(col, 1.0);
    }
  `

  constructor(options: PostProcessShaderOptions) {
    const { canvas } = options
    const gl = canvas.getContext('webgl2', { alpha: true, antialias: true }) as WebGL2RenderingContext | null
    if (!gl) {
      console.warn('WebGL2 not supported, fallback to 2D')
      return
    }
    this.gl = gl

    const vertShader = this.compileShader(gl.VERTEX_SHADER, this.vertShaderSource)
    const fragShader = this.compileShader(gl.FRAGMENT_SHADER, this.fragShaderSource)

    if (!vertShader || !fragShader) return

    const program = gl.createProgram()
    if (!program) return

    gl.attachShader(program, vertShader)
    gl.attachShader(program, fragShader)
    gl.linkProgram(program)

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('PostProcess shader link failed', gl.getProgramInfoLog(program))
      gl.deleteProgram(program)
      return
    }

    this.program = program

    // Quad
    const vertices = new Float32Array([
      -1, -1, 0, 0,
      1, -1, 1, 0,
      -1, 1, 0, 1,
      1, 1, 1, 1,
    ])

    const buffer = gl.createBuffer()
    if (!buffer) return
    this.quadBuffer = buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW)

    // Texture
    const texture = gl.createTexture()
    if (!texture) return
    this.texture = texture
    gl.bindTexture(gl.TEXTURE_2D, texture)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)

    this.timeUniform = gl.getUniformLocation(program, 'uTime')
    this.progressUniform = gl.getUniformLocation(program, 'uProgress')
    this.velocityUniform = gl.getUniformLocation(program, 'uVelocity')
    this.dispersionUniform = gl.getUniformLocation(program, 'uDispersion')
    this.resolutionUniform = gl.getUniformLocation(program, 'uResolution')

    gl.deleteShader(vertShader)
    gl.deleteShader(fragShader)
  }

  private compileShader(type: number, source: string): WebGLShader | null {
    if (!this.gl) return null
    const shader = this.gl.createShader(type)
    if (!shader) return null
    this.gl.shaderSource(shader, source)
    this.gl.compileShader(shader)
    if (!this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS)) {
      console.error('Shader compile failed', this.gl.getShaderInfoLog(shader))
      this.gl.deleteShader(shader)
      return null
    }
    return shader
  }

  public render(sourceCanvas: HTMLCanvasElement, uniforms: { time: number; progress: number; velocity: number; dispersion: number }): void {
    if (!this.gl || !this.program || !this.texture || !this.quadBuffer) return

    const gl = this.gl
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height)
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)

    gl.useProgram(this.program)

    // Bind source texture
    gl.bindTexture(gl.TEXTURE_2D, this.texture)
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, sourceCanvas)

    // Quad attributes
    gl.bindBuffer(gl.ARRAY_BUFFER, this.quadBuffer)
    const posLoc = gl.getAttribLocation(this.program, 'aPosition')
    const uvLoc = gl.getAttribLocation(this.program, 'aUv')

    gl.enableVertexAttribArray(posLoc)
    gl.vertexAttribPointer(posLoc, 2, gl.FLOAT, false, 16, 0)

    gl.enableVertexAttribArray(uvLoc)
    gl.vertexAttribPointer(uvLoc, 2, gl.FLOAT, false, 16, 8)

    if (this.timeUniform) gl.uniform1f(this.timeUniform, uniforms.time)
    if (this.progressUniform) gl.uniform1f(this.progressUniform, uniforms.progress)
    if (this.velocityUniform) gl.uniform1f(this.velocityUniform, uniforms.velocity)
    if (this.dispersionUniform) gl.uniform1f(this.dispersionUniform, uniforms.dispersion)
    if (this.resolutionUniform) gl.uniform2f(this.resolutionUniform, gl.canvas.width, gl.canvas.height)

    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }

  public destroy(): void {
    if (!this.gl) return
    if (this.program) {
      this.gl.deleteProgram(this.program)
      this.program = null
    }
    if (this.quadBuffer) {
      this.gl.deleteBuffer(this.quadBuffer)
      this.quadBuffer = null
    }
    if (this.texture) {
      this.gl.deleteTexture(this.texture)
      this.texture = null
    }
    this.gl = null
  }
}

export function applyChromaticAberration2D(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  dispersion: number,
  velocity: number
): void {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const offset = Math.floor(dispersion * width * (1 + velocity * 2))

  if (offset <= 0) return

  const copy = new Uint8ClampedArray(data)

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const i = (y * width + x) * 4
      const rX = Math.min(width - 1, Math.max(0, x + offset))
      const bX = Math.min(width - 1, Math.max(0, x - offset))

      const rI = (y * width + rX) * 4
      const bI = (y * width + bX) * 4

      data[i] = copy[rI]
      data[i + 2] = copy[bI + 2]
    }
  }

  ctx.putImageData(imageData, 0, 0)
}

export function calculateDispersion(progress: number): number {
  if (progress < 0.18) return 0
  if (progress <= 0.4) {
    return Math.sin(((progress - 0.18) / 0.22) * Math.PI) * 0.015
  }
  if (progress < 0.72) {
    return 0.012 + Math.sin(progress * 12) * 0.003
  }
  return Math.max(0, 0.012 * (1 - (progress - 0.72) / 0.13))
}

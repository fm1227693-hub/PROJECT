import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

export default function BackgroundCanvas() {
    const canvasRef = useRef(null);
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const timeRef = useRef(0);
    const lastTimeRef = useRef(performance.now());
    const sparkParticlesRef = useRef(null);
    const sparkDataRef = useRef([]);
    const shaderUniformsRef = useRef(null);
    
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);
    const targetMouseXRef = useRef(0);
    const targetMouseYRef = useRef(0);
    const currentScrollRef = useRef(0);
    
    const reqIdRef = useRef(null);

    useEffect(() => {
        const sparkCount = 450;
        let sizes = { width: window.innerWidth, height: window.innerHeight };
        
        let isDark = document.documentElement.classList.contains('dark');
        const observer = new MutationObserver((mutations) => {
            mutations.forEach((mutation) => {
                if (mutation.attributeName === 'class') {
                    isDark = document.documentElement.classList.contains('dark');
                }
            });
        });
        observer.observe(document.documentElement, { attributes: true });
        
        function init() {
            const scene = new THREE.Scene();
            sceneRef.current = scene;
            scene.background = new THREE.Color('#050000');
            scene.fog = new THREE.FogExp2('#050000', 0.01);

            const camera = new THREE.PerspectiveCamera(50, sizes.width / sizes.height, 0.1, 100);
            camera.position.set(0, 0.2, 3.0);
            scene.add(camera);
            cameraRef.current = camera;

            createBackgroundShader(scene, camera);

            const renderer = new THREE.WebGLRenderer({
                canvas: canvasRef.current,
                antialias: true,
                alpha: false,
                powerPreference: "high-performance"
            });
            renderer.setSize(sizes.width, sizes.height);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            rendererRef.current = renderer;

            createSparks(scene);
        }

        function createSparkTexture() {
            const c = document.createElement('canvas');
            c.width = 16; c.height = 16;
            const ctx = c.getContext('2d');
            const gradient = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
            gradient.addColorStop(0.25, 'rgba(255, 255, 255, 0.85)');
            gradient.addColorStop(0.6, 'rgba(255, 255, 255, 0.3)');
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 16, 16);
            const texture = new THREE.CanvasTexture(c);
            texture.flipY = false;
            return texture;
        }

        function createSparks(scene) {
            const geometry = new THREE.BufferGeometry();
            const positions = new Float32Array(sparkCount * 3);
            const colors = new Float32Array(sparkCount * 3);
            const data = [];

            for (let i = 0; i < sparkCount; i++) {
                const x = (Math.random() - 0.5) * 6.5;
                const y = (Math.random() - 0.5) * 5.0 - 0.5;
                const z = (Math.random() - 0.5) * 6.5;
                positions[i * 3] = x;
                positions[i * 3 + 1] = y;
                positions[i * 3 + 2] = z;

                if (Math.random() < 0.6) {
                    colors[i * 3] = 1.0;
                    colors[i * 3 + 1] = 0.3;
                    colors[i * 3 + 2] = 0.1;
                } else {
                    colors[i * 3] = 1.0;
                    colors[i * 3 + 1] = 0.1;
                    colors[i * 3 + 2] = 0.1;
                }

                data.push({
                    speedX: (Math.random() - 0.5) * 0.4,
                    speedY: 0.15 + Math.random() * 0.3,
                    speedZ: (Math.random() - 0.5) * 0.4,
                    swaySpeed: 0.5 + Math.random() * 1.5,
                    swayRadius: 0.05 + Math.random() * 0.15,
                    phase: Math.random() * Math.PI * 2
                });
            }

            sparkDataRef.current = data;
            geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
            geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

            const material = new THREE.PointsMaterial({
                size: 0.025,
                vertexColors: true,
                transparent: true,
                opacity: 0.85,
                blending: THREE.AdditiveBlending,
                depthWrite: false,
                map: createSparkTexture()
            });

            const particles = new THREE.Points(geometry, material);
            scene.add(particles);
            sparkParticlesRef.current = particles;
        }

        function createBackgroundShader(scene, camera) {
            const vertexShader = `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }
            `;
            const fragmentShader = `
                varying vec2 vUv;
                uniform float uTime;
                uniform vec2 uResolution;
                uniform vec2 uMouse;
                uniform float uScroll;
                uniform float uTheme;

                float hash(float n) { return fract(sin(n) * 43758.5453123); }
                void main() {
                    vec2 uv = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;
                    float aspect = uResolution.x / uResolution.y;
                    
                    float time = uTime * 0.08;
                    float scroll = uScroll;
                    
                    float angle1 = 0.6; float angle2 = -0.7; float angle3 = 1.2;
                    float freq1 = 2.4; float freq2 = 3.2; float freq3 = 4.0;
                    
                    vec2 warpedUv = uv;
                    float scrollDeform = scroll * 5.0;
                    
                    warpedUv.x += sin(uv.y * 2.5 + time * 0.2 + scrollDeform) * 0.35;
                    warpedUv.y += cos(uv.x * 2.5 - time * 0.15 - scrollDeform * 0.8) * 0.35;
                    warpedUv.x += sin(uv.y * 1.2 - time * 0.1 - scrollDeform * 1.5) * 0.25;
                    warpedUv.y += cos(uv.x * 1.2 + time * 0.18 + scrollDeform * 1.2) * 0.25;
                    
                    vec2 scrollDrift = vec2(scroll * 0.04, -scroll * 0.02);
                    vec2 mouseShift = vec2(uMouse.x * aspect * 0.05, uMouse.y * 0.05);
                    warpedUv += scrollDrift + mouseShift;
                    
                    vec2 dir1 = vec2(cos(angle1), sin(angle1));
                    vec2 dir2 = vec2(cos(angle2), sin(angle2));
                    vec2 dir3 = vec2(cos(angle3), sin(angle3));
                    
                    float w1 = sin(dot(warpedUv, dir1) * freq1 + time * 1.0);
                    float w2 = cos(dot(warpedUv, dir2) * freq2 - time * 1.4 + w1 * 0.4);
                    float w3 = sin(dot(warpedUv, dir3) * freq3 + time * 1.8 + w2 * 0.5);
                    
                    float waveField = w1 * 0.50 + w2 * 0.35 + w3 * 0.15;
                    
                    float wideSheen = pow(max(0.0, 1.0 - abs(waveField - 0.1)), 2.5);
                    float crispSpecular = pow(max(0.0, 1.0 - abs(waveField - 0.15)), 8.0);
                    float crest = wideSheen * 0.5 + crispSpecular * 0.9;
                    
                    vec3 dark_c0_shadow = vec3(0.05, 0.005, 0.005);
                    vec3 dark_c0_wave1  = vec3(0.2, 0.02, 0.01);
                    vec3 dark_c0_wave2  = vec3(0.1, 0.01, 0.01);
                    vec3 dark_c0_crest  = vec3(0.6, 0.1, 0.1);
                    
                    vec3 dark_c1_shadow = vec3(0.005, 0.005, 0.05);
                    vec3 dark_c1_wave1  = vec3(0.015, 0.035, 0.065);
                    vec3 dark_c1_wave2  = vec3(0.008, 0.020, 0.045);
                    vec3 dark_c1_crest  = vec3(0.18, 0.35, 0.55);

                    vec3 light_c0_shadow = vec3(0.60, 0.62, 0.68);
                    vec3 light_c0_wave1  = vec3(0.65, 0.55, 0.60);
                    vec3 light_c0_wave2  = vec3(0.63, 0.58, 0.62);
                    vec3 light_c0_crest  = vec3(0.70, 0.30, 0.35);
                    
                    vec3 light_c1_shadow = vec3(0.58, 0.62, 0.68);
                    vec3 light_c1_wave1  = vec3(0.55, 0.60, 0.70);
                    vec3 light_c1_wave2  = vec3(0.60, 0.63, 0.70);
                    vec3 light_c1_crest  = vec3(0.25, 0.35, 0.75);
                    
                    vec3 c0_shadow = mix(light_c0_shadow, dark_c0_shadow, uTheme);
                    vec3 c0_wave1  = mix(light_c0_wave1, dark_c0_wave1, uTheme);
                    vec3 c0_wave2  = mix(light_c0_wave2, dark_c0_wave2, uTheme);
                    vec3 c0_crest  = mix(light_c0_crest, dark_c0_crest, uTheme);
                    
                    vec3 c1_shadow = mix(light_c1_shadow, dark_c1_shadow, uTheme);
                    vec3 c1_wave1  = mix(light_c1_wave1, dark_c1_wave1, uTheme);
                    vec3 c1_wave2  = mix(light_c1_wave2, dark_c1_wave2, uTheme);
                    vec3 c1_crest  = mix(light_c1_crest, dark_c1_crest, uTheme);
                    
                    float t = smoothstep(0.0, 1.0, scroll);
                    vec3 colShadow = mix(c0_shadow, c1_shadow, t);
                    vec3 colWave1  = mix(c0_wave1, c1_wave1, t);
                    vec3 colWave2  = mix(c0_wave2, c1_wave2, t);
                    vec3 colCrest  = mix(c0_crest, c1_crest, t);
                    
                    vec3 color = colShadow;
                    color = mix(color, colWave2, smoothstep(-0.6, 0.2, waveField));
                    color = mix(color, colWave1, smoothstep(0.0, 0.8, waveField));
                    color += colCrest * crest * 1.4;
                    
                    float vignette = 1.0 - dot(uv, uv) * 0.12;
                    color *= vignette;
                    
                    gl_FragColor = vec4(color, 1.0);
                }
            `;
            const uniforms = {
                uTime: { value: 0 },
                uResolution: { value: new THREE.Vector2(window.innerWidth, window.innerHeight) },
                uMouse: { value: new THREE.Vector2(0, 0) },
                uScroll: { value: 0 },
                uTheme: { value: isDark ? 1.0 : 0.0 }
            };
            shaderUniformsRef.current = uniforms;

            const bgMaterial = new THREE.ShaderMaterial({
                vertexShader: vertexShader,
                fragmentShader: fragmentShader,
                uniforms: uniforms,
                depthWrite: false,
                depthTest: false
            });

            const bgGeometry = new THREE.PlaneGeometry(30, 30);
            const bgMesh = new THREE.Mesh(bgGeometry, bgMaterial);
            bgMesh.position.set(0.0, 0.0, -8.0);
            bgMesh.renderOrder = -10;
            camera.add(bgMesh);
        }

        function animate() {
            reqIdRef.current = requestAnimationFrame(animate);
            
            const now = performance.now();
            const deltaTime = (now - lastTimeRef.current) / 1000;
            lastTimeRef.current = now;
            timeRef.current += deltaTime;

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetScroll = maxScroll > 0 ? scrollTop / maxScroll : 0;

            currentScrollRef.current += (targetScroll - currentScrollRef.current) * 0.025;
            const scroll = currentScrollRef.current;

            mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * 0.05;
            mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * 0.05;

            if (sparkParticlesRef.current && sparkDataRef.current.length > 0) {
                const positions = sparkParticlesRef.current.geometry.attributes.position.array;
                const time = timeRef.current;
                const scrollVelocity = Math.abs(targetScroll - scroll);
                const speedMultiplier = 1.0 + scrollVelocity * 9.0;
                const turbulence = scrollVelocity * 0.8;

                for (let i = 0; i < sparkCount; i++) {
                    const idx = i * 3;
                    const data = sparkDataRef.current[i];
                    positions[idx]     += data.speedX * deltaTime * speedMultiplier;
                    positions[idx + 1] += data.speedY * deltaTime * speedMultiplier;
                    positions[idx + 2] += data.speedZ * deltaTime * speedMultiplier;

                    const currentSway = data.swayRadius * (1.0 + turbulence * 4.0);
                    positions[idx]     += Math.sin(time * data.swaySpeed + data.phase) * currentSway * deltaTime;
                    positions[idx + 2] += Math.cos(time * data.swaySpeed + data.phase) * currentSway * deltaTime;

                    if (positions[idx + 1] > 3.0 || Math.abs(positions[idx]) > 3.5 || Math.abs(positions[idx + 2]) > 3.5) {
                        positions[idx + 1] = -2.5;
                        positions[idx]     = (Math.random() - 0.5) * 3.0;
                        positions[idx + 2] = (Math.random() - 0.5) * 3.0;
                    }
                }
                sparkParticlesRef.current.geometry.attributes.position.needsUpdate = true;
            }

            if (cameraRef.current) {
                const phi = scroll * Math.PI * 2.0;
                const y = 0.35 + Math.sin(scroll * Math.PI) * 0.8;
                const radius = 4.2 - Math.sin(scroll * Math.PI) * 0.6;
                const x = radius * Math.sin(phi);
                const z = radius * Math.cos(phi);

                let transitionProgress = Math.min(1.0, scroll / 0.28);
                let easeFactor = (Math.cos(transitionProgress * Math.PI) + 1.0) * 0.5;
                const lookAtXOffset = -0.9 * easeFactor;
                const targetLookAt = new THREE.Vector3(lookAtXOffset, -0.15, 0);
                const targetPos = new THREE.Vector3(x, y, z);
                
                cameraRef.current.position.lerp(targetPos, 0.025);
                cameraRef.current.lookAt(targetLookAt);
            }

            if (shaderUniformsRef.current) {
                shaderUniformsRef.current.uTime.value = timeRef.current;
                shaderUniformsRef.current.uMouse.value.set(mouseXRef.current, -mouseYRef.current);
                shaderUniformsRef.current.uScroll.value = scroll;
                
                const targetTheme = isDark ? 1.0 : 0.0;
                shaderUniformsRef.current.uTheme.value += (targetTheme - shaderUniformsRef.current.uTheme.value) * 0.05;
                
                const darkBg = new THREE.Color('#050000');
                const lightBg = new THREE.Color('#64748b');
                const currentBg = new THREE.Color().lerpColors(lightBg, darkBg, shaderUniformsRef.current.uTheme.value);
                if (sceneRef.current) {
                    sceneRef.current.background = currentBg;
                    sceneRef.current.fog.color = currentBg;
                }
            }

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }

        const handleMouseMoveGlobal = (event) => {
            targetMouseXRef.current = (event.clientX / window.innerWidth) * 2 - 1;
            targetMouseYRef.current = (event.clientY / window.innerHeight) * 2 - 1;
        };

        const handleResize = () => {
            sizes.width = window.innerWidth;
            sizes.height = window.innerHeight;
            if (cameraRef.current) {
                cameraRef.current.aspect = sizes.width / sizes.height;
                cameraRef.current.updateProjectionMatrix();
            }
            if (rendererRef.current) {
                rendererRef.current.setSize(sizes.width, sizes.height);
                rendererRef.current.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            }
            if (shaderUniformsRef.current) {
                shaderUniformsRef.current.uResolution.value.set(sizes.width, sizes.height);
            }
        };

        init();
        handleResize();
        animate();

        window.addEventListener('mousemove', handleMouseMoveGlobal);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMoveGlobal);
            window.removeEventListener('resize', handleResize);
            observer.disconnect();
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, []);

    return (
        <canvas 
            id="webgl" 
            ref={canvasRef} 
            className="fixed inset-0 w-screen h-screen z-0 pointer-events-none" 
        />
    );
}

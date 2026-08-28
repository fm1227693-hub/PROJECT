import React, { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import './home.css';

const ASSET_BASE_URL = "https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6";

export default function Home() {
    const navigate = useNavigate();
    const canvasRef = useRef(null);
    const containerRef = useRef(null);

    // Three.js variables
    const sceneRef = useRef(null);
    const cameraRef = useRef(null);
    const rendererRef = useRef(null);
    const mixerRef = useRef(null);
    const clockRef = useRef(new THREE.Clock());
    const modelPivotRef = useRef(null);
    const sparkParticlesRef = useRef(null);
    const sparkDataRef = useRef([]);
    const shaderUniformsRef = useRef(null);
    
    // State variables
    const currentScrollRef = useRef(0);
    const mouseXRef = useRef(0);
    const mouseYRef = useRef(0);
    const targetMouseXRef = useRef(0);
    const targetMouseYRef = useRef(0);
    
    const cursorXRef = useRef(window.innerWidth / 2);
    const cursorYRef = useRef(window.innerHeight / 2);
    const outerCursorXRef = useRef(window.innerWidth / 2);
    const outerCursorYRef = useRef(window.innerHeight / 2);

    const reqIdRef = useRef(null);

    useEffect(() => {
        // Init logic
        const sparkCount = 450;
        let sizes = { width: window.innerWidth, height: window.innerHeight };
        
        function init() {
            const scene = new THREE.Scene();
            sceneRef.current = scene;
            scene.background = new THREE.Color('#1a0000');
            scene.fog = new THREE.FogExp2('#1a0000', 0.01);

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
            renderer.shadowMap.enabled = true;
            renderer.shadowMap.type = THREE.PCFSoftShadowMap;
            renderer.toneMapping = THREE.ACESFilmicToneMapping;
            renderer.toneMappingExposure = 2.2;
            rendererRef.current = renderer;

            const ambientLight = new THREE.AmbientLight('#ffffff', 0.1);
            scene.add(ambientLight);

            const keyLight = new THREE.SpotLight('#ffffff', 18.0);
            keyLight.position.set(4, 6, 3);
            keyLight.angle = Math.PI / 4;
            keyLight.penumbra = 0.9;
            keyLight.castShadow = true;
            keyLight.shadow.mapSize.width = 2048;
            keyLight.shadow.mapSize.height = 2048;
            keyLight.shadow.camera.near = 1.0;
            keyLight.shadow.camera.far = 15;
            keyLight.shadow.bias = -0.001;
            scene.add(keyLight);

            const rimLight = new THREE.DirectionalLight('#ff4d4d', 12.0);
            rimLight.position.set(-5, 3, -4);
            scene.add(rimLight);

            const fillLight = new THREE.DirectionalLight('#ff9999', 1.2);
            fillLight.position.set(-2, -4, 2);
            scene.add(fillLight);

            createSparks(scene);
            // loadModel(scene);
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
            return new THREE.CanvasTexture(c);
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

        function loadModel(scene) {
            const loader = new GLTFLoader();
            loader.load(
                ASSET_BASE_URL + '/bronze_horse.glb',
                (gltf) => {
                    const model = gltf.scene;
                    const pivot = new THREE.Group();
                    scene.add(pivot);
                    pivot.add(model);
                    modelPivotRef.current = pivot;

                    model.traverse((child) => {
                        if (child.isMesh) {
                            child.castShadow = true;
                            child.receiveShadow = true;
                            if (child.material) {
                                child.material.roughness = 0.42;
                                child.material.metalness = 0.92;
                                child.material.flatShading = false;
                                if (child.material.map) {
                                    child.material.map.anisotropy = 16;
                                }
                            }
                        }
                    });

                    if (gltf.animations && gltf.animations.length > 0) {
                        const mixer = new THREE.AnimationMixer(model);
                        gltf.animations.forEach((clip) => { mixer.clipAction(clip).play(); });
                        mixerRef.current = mixer;
                    }

                    const boxInitial = new THREE.Box3().setFromObject(model);
                    const sizeInitial = boxInitial.getSize(new THREE.Vector3());
                    const maxDim = Math.max(sizeInitial.x, sizeInitial.y, sizeInitial.z);
                    const targetScale = 3.5 / (maxDim > 0.0001 ? maxDim : 1);
                    model.scale.setScalar(targetScale);
                    model.updateMatrixWorld(true);

                    const boxScaled = new THREE.Box3().setFromObject(model);
                    const centerScaled = boxScaled.getCenter(new THREE.Vector3());
                    model.position.sub(centerScaled);
                    pivot.position.y = -0.4;
                },
                undefined,
                (error) => { console.error('Error loading model:', error); }
            );
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
                    
                    vec3 c0_shadow = vec3(0.05, 0.005, 0.005);
                    vec3 c0_wave1  = vec3(0.2, 0.02, 0.01);
                    vec3 c0_wave2  = vec3(0.1, 0.01, 0.01);
                    vec3 c0_crest  = vec3(0.6, 0.1, 0.1);
                    
                    vec3 c1_shadow = vec3(0.005, 0.005, 0.05);
                    vec3 c1_wave1  = vec3(0.015, 0.035, 0.065);
                    vec3 c1_wave2  = vec3(0.008, 0.020, 0.045);
                    vec3 c1_crest  = vec3(0.18, 0.35, 0.55);
                    
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
                uScroll: { value: 0 }
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

        function splitTitlesIntoChars() {
            if (!containerRef.current) return;
            const titles = containerRef.current.querySelectorAll('.slide-title');
            titles.forEach(title => {
                if (title.getAttribute('data-split') === 'true') return;
                const text = title.innerHTML;
                let newHTML = '';
                let delayCounter = 0;
                const parts = text.split(/(<br\s*\/?>)/i);
                parts.forEach(part => {
                    if (part.toLowerCase().startsWith('<br')) {
                        newHTML += part;
                    } else {
                        for (let i = 0; i < part.length; i++) {
                            if (part[i] === ' ') {
                                newHTML += ' ';
                            } else {
                                newHTML += `<span class="char" style="--char-delay: ${delayCounter * 0.035}s">${part[i]}</span>`;
                                delayCounter++;
                            }
                        }
                    }
                });
                title.innerHTML = newHTML;
                title.setAttribute('data-split', 'true');
            });
        }

        function updateGridDots(scroll) {
            if (!containerRef.current) return;
            const dots = containerRef.current.querySelectorAll('.grid-dot');
            dots.forEach((dot, i) => {
                const startY = (i * 17) % 80 + 10;
                let speed = 90 + (i * 55) % 180;
                if (i % 2 === 0) speed = -speed;
                let y = startY + scroll * speed;
                y = ((y % 100) + 100) % 100;
                dot.style.top = `${y}%`;
            });
        }

        function updateSlides(scroll) {
            if (!containerRef.current) return;
            const slide1 = containerRef.current.querySelector('#slide-1');
            const slide2 = containerRef.current.querySelector('#slide-2');
            const slide3 = containerRef.current.querySelector('#slide-3');
            const slide4 = containerRef.current.querySelector('#slide-4');

            for (let i = 1; i <= 4; i++) {
                const fill = containerRef.current.querySelector(`#dash-fill-${i}`);
                if (fill) {
                    const start = (i - 1) * 0.25;
                    const end = i * 0.25;
                    let progress = (scroll - start) / (end - start);
                    progress = Math.max(0, Math.min(1, progress));
                    fill.style.height = `${progress * 100}%`;
                }
            }

            function isActive(val, start, end) { return val >= start && val <= end; }

            if (slide1) slide1.classList.toggle('active', isActive(scroll, -0.10, 0.12));
            if (slide2) {
                const active2 = isActive(scroll, 0.28, 0.40);
                slide2.classList.toggle('active', active2);
                const slide2Img = containerRef.current.querySelector('#slide-2-img');
                if (slide2Img) slide2Img.classList.toggle('active', active2);
            }
            if (slide3) slide3.classList.toggle('active', isActive(scroll, 0.56, 0.68));
            if (slide4) slide4.classList.toggle('active', isActive(scroll, 0.84, 1.05));
        }

        function animate() {
            reqIdRef.current = requestAnimationFrame(animate);
            const deltaTime = clockRef.current.getDelta();
            if (mixerRef.current) mixerRef.current.update(deltaTime);

            const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
            const scrollTop = window.scrollY || document.documentElement.scrollTop;
            const targetScroll = maxScroll > 0 ? scrollTop / maxScroll : 0;

            currentScrollRef.current += (targetScroll - currentScrollRef.current) * 0.025;
            const scroll = currentScrollRef.current;

            mouseXRef.current += (targetMouseXRef.current - mouseXRef.current) * 0.05;
            mouseYRef.current += (targetMouseYRef.current - mouseYRef.current) * 0.05;

            outerCursorXRef.current += (cursorXRef.current - outerCursorXRef.current) * 0.2;
            outerCursorYRef.current += (cursorYRef.current - outerCursorYRef.current) * 0.2;
            
            if (containerRef.current) {
                const cursorOuter = containerRef.current.querySelector('.cursor-outer');
                if (cursorOuter) { 
                    cursorOuter.style.left = `${outerCursorXRef.current}px`; 
                    cursorOuter.style.top = `${outerCursorYRef.current}px`; 
                }
            }

            if (modelPivotRef.current) {
                modelPivotRef.current.rotation.y = mouseXRef.current * 0.25;
                modelPivotRef.current.rotation.x = mouseYRef.current * 0.15;
            }

            if (sparkParticlesRef.current && sparkDataRef.current.length > 0) {
                const positions = sparkParticlesRef.current.geometry.attributes.position.array;
                const time = clockRef.current.getElapsedTime();
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
                shaderUniformsRef.current.uTime.value = clockRef.current.getElapsedTime();
                shaderUniformsRef.current.uMouse.value.set(mouseXRef.current, -mouseYRef.current);
                shaderUniformsRef.current.uScroll.value = scroll;
            }

            updateSlides(scroll);
            updateGridDots(scroll);
            
            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        }

        const handleMouseMove = (event) => {
            cursorXRef.current = event.clientX;
            cursorYRef.current = event.clientY;
            if (containerRef.current) {
                const cursorInner = containerRef.current.querySelector('.cursor-inner');
                if (cursorInner) { 
                    cursorInner.style.left = `${cursorXRef.current}px`; 
                    cursorInner.style.top = `${cursorYRef.current}px`; 
                }
            }
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
        splitTitlesIntoChars();
        handleResize();
        animate();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('resize', handleResize);
            if (reqIdRef.current) cancelAnimationFrame(reqIdRef.current);
            // Cleanup three.js memory
            if (rendererRef.current) {
                rendererRef.current.dispose();
            }
        };
    }, []);

    const handleNavClick = (index) => {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        const targetScrolls = [0.0, 0.34, 0.62, 0.94];
        window.scrollTo({ top: maxScroll * targetScrolls[index], behavior: 'smooth' });
    };

    return (
        <div className="landing-page" ref={containerRef}>
            <div className="cursor-inner"></div>
            <div class="cursor-outer"></div>

            <div className="cinematic-container">
                <div className="main-header">
                    <div className="brand" style={{ display: 'flex', alignItems: 'center' }}>
                        <span style={{ fontSize: '24px', fontWeight: 'bold', color: '#fff', letterSpacing: '2px' }}>OPTIMUM</span>
                    </div>
                    <nav className="header-nav">
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(0)}>MOCK & AI</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(1)}>PRACTICE</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(2)}>ANALYTICS</span>
                        <span className="nav-dot"></span>
                        <span className="nav-link" style={{cursor: 'pointer'}} onClick={() => handleNavClick(3)}>SUCCESS</span>
                    </nav>
                    <div className="header-actions">
                        <button onClick={() => navigate('/login')} className="login-btn">Log in</button>
                        <button onClick={() => navigate('/login')} className="contact-btn">Sign up <span className="btn-circle"></span></button>
                    </div>
                </div>

                <div className="slide" id="slide-1">
                    <h2 className="slide-title">IELTS natijangizni <br/>CDI Mock va AI</h2>
                    <div className="desc-row">
                        <p className="slide-desc col-1">Optimum o‘quv platformasi barcha darajadagi o‘quvchilar uchun CDI simulatori va AI tahlillari orqali 7.5+ Band natijalarini ta’minlaydi.</p>
                        <p className="slide-desc col-2">Optimum IELTS Hub orqali Target 8.5 ga erishing. Universal tizim va to'liq imtihon amaliyoti sizning xizmatingizda.</p>
                    </div>
                </div>
                
                <div className="slide" id="slide-2">
                    <h2 className="slide-title">Mock <br/>Simulator</h2>
                    <p className="slide-desc">100 dan ortiq mock testlar va Authentic Exam UI orqali o'zingizni haqiqiy imtihondagidek his eting va tayyorgarlik ko'ring.</p>
                </div>
                
                <div className="slide" id="slide-3">
                    <h2 className="slide-title">Batafsil <br/>Analitika</h2>
                    <p className="slide-desc">O'zlashtirish jarayonini to'liq kuzatib boring (Track Your Progress). Har bir test uchun mukammal statistik ma'lumotlar oling.</p>
                </div>
                
                <div className="slide" id="slide-4">
                    <h2 className="slide-title">Universal <br/>Tizim</h2>
                    <p className="slide-desc">10,000 dan ortiq o'quvchilar biz bilan 7.5+ natijaga erishdi. Optimum platformasi bilan maqsadingizga erishing.</p>
                </div>
            </div>

            <div className="slide-image-mask" id="slide-2-img">
                <img src="https://api.getlayers.ai/storage/v1/object/public/public/assets/laocoon-59f84455c6/1.png" alt="Editorial Concept" />
            </div>

            <canvas id="webgl" ref={canvasRef}></canvas>
        </div>
    );
}

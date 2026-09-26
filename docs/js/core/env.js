/* =====================================================================
   CORE / ENV
   Image-based lighting.

   Primary: a procedurally-built photographic studio (softboxes, cool fill,
   warm rim, dark floor) captured through PMREMGenerator — crisp, art-directed
   reflections with zero network dependency.

   Upgrade path: drop a CC0 Poly Haven .hdr into assets/hdr/studio.hdr and it
   is used automatically instead (see assets/hdr/README.md).
   ===================================================================== */
import * as THREE from 'three';
import { HDRLoader } from 'three/addons/loaders/HDRLoader.js';
import { ASSETS } from './config.js';

function areaLight(intensity, color = 0xffffff) {
  return new THREE.MeshLambertMaterial({ color: 0x000000, emissive: color, emissiveIntensity: intensity, side: THREE.DoubleSide });
}

/** A small studio: dark floor, grey walls, one big top softbox, two strips. */
export function createStudioScene() {
  const scene = new THREE.Scene();
  const box = new THREE.BoxGeometry();
  box.deleteAttribute('uv');
  const plane = new THREE.PlaneGeometry(1, 1);
  const resources = [box, plane];

  /* shell */
  const shellMat = new THREE.MeshStandardMaterial({ side: THREE.BackSide, color: 0x8e8e96, roughness: 1, metalness: 0 });
  const shell = new THREE.Mesh(box, shellMat);
  shell.scale.set(30, 26, 30);
  shell.position.set(0, 11, 0);
  scene.add(shell);

  /* dark floor → deep, grounding reflections on metal */
  const floorMat = new THREE.MeshStandardMaterial({ color: 0x0c0c0f, roughness: 0.82, metalness: 0 });
  const floor = new THREE.Mesh(plane, floorMat);
  floor.rotation.x = -Math.PI / 2;
  floor.scale.set(30, 30, 1);
  floor.position.y = -1.6;
  scene.add(floor);

  /* practical lights (illuminate the shell so the env has a soft gradient) */
  const key = new THREE.PointLight(0xffffff, 950, 46, 2);
  key.position.set(0.5, 19, 1.5);
  scene.add(key);
  const coolFill = new THREE.PointLight(0xc9dcff, 300, 46, 2);
  coolFill.position.set(-13, 8, 9);
  scene.add(coolFill);
  const warmRim = new THREE.PointLight(0xffb27a, 240, 46, 2);
  warmRim.position.set(12, 6, -11);
  scene.add(warmRim);

  /* softboxes — these are what you actually see in the chrome */
  const mats = [];
  const addPanel = (w, h, pos, rot, intensity, color) => {
    const m = areaLight(intensity, color); mats.push(m);
    const p = new THREE.Mesh(plane, m);
    p.scale.set(w, h, 1);
    p.position.set(pos[0], pos[1], pos[2]);
    if (rot) p.rotation.set(rot[0], rot[1], rot[2]);
    scene.add(p);
    return p;
  };

  addPanel(11, 11, [0, 22.5, 0], [-Math.PI / 2, 0, 0], 42);              /* big top softbox   */
  addPanel(1.5, 1.5, [2.5, 21.6, 3.5], [-Math.PI / 2, 0, 0], 190);        /* crisp specular    */
  addPanel(2.6, 10, [-13.4, 10, 1], [0, Math.PI / 2, 0], 34, 0xeaf1ff);   /* cool strip (left) */
  addPanel(1.7, 8, [12.6, 9, -2], [0, -Math.PI / 2, 0], 20, 0xffe0cc);    /* warm strip (right)*/
  addPanel(7, 2.6, [-1, 7, -13.4], [0, 0, 0], 14, 0xdfe6ff);              /* back rim          */
  addPanel(12, 3.4, [0, 1.6, 12.6], [0, Math.PI, 0], 6);                  /* front bounce      */

  return {
    scene,
    dispose() {
      resources.forEach(r => r.dispose());
      mats.forEach(m => m.dispose());
      [shellMat, floorMat].forEach(m => m.dispose());
    }
  };
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error('hdr-timeout')), ms);
    promise.then(v => { clearTimeout(id); resolve(v); }, e => { clearTimeout(id); reject(e); });
  });
}

/**
 * Build the IBL environment map.
 * @returns {Promise<{texture: THREE.Texture, source: string, dispose: Function}>}
 */
export async function buildEnvironment(renderer, log) {
  const pmrem = new THREE.PMREMGenerator(renderer);
  pmrem.compileEquirectangularShader();

  /* 1. optional real HDRI — raced against a timeout so a slow or missing
        file can never stall the preloader */
  try {
    const hdr = await withTimeout(new HDRLoader().loadAsync(ASSETS.hdri), 4000);
    hdr.mapping = THREE.EquirectangularReflectionMapping;
    const rt = pmrem.fromEquirectangular(hdr);
    hdr.dispose();
    pmrem.dispose();
    log && log('hdri · poly haven cc0');
    return { texture: rt.texture, source: 'hdri', dispose: () => rt.dispose() };
  } catch (err) {
    /* expected when no HDRI is shipped — fall through to procedural studio */
  }

  /* 2. procedural studio */
  const studio = createStudioScene();
  const rt = pmrem.fromScene(studio.scene, 0.02);
  studio.dispose();
  pmrem.dispose();
  log && log('ibl · procedural studio');
  return { texture: rt.texture, source: 'studio', dispose: () => rt.dispose() };
}

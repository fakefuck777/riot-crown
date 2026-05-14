import * as THREE from 'three';

interface GLBModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

const modelCache = new Map<string, GLBModel>();

export async function loadGLBModel(url: string): Promise<GLBModel | null> {
  const cached = modelCache.get(url);
  if (cached) {
    return cached;
  }

  try {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();

    const { GLTFLoader } = await import('three/examples/jsm/loaders/GLTFLoader.js');
    const loader = new GLTFLoader();

    return new Promise((resolve, reject) => {
      loader.parse(arrayBuffer, '', (gltf) => {
        const model = { scene: gltf.scene as THREE.Group, animations: gltf.animations };
        modelCache.set(url, model);
        resolve(model);
      }, reject);
    });
  } catch (error) {
    console.error(`Failed to load GLB model: ${url}`, error);
    return null;
  }
}

export function preloadGLBModel(url: string): Promise<GLBModel | null> {
  return loadGLBModel(url);
}

export function clearModelCache() {
  modelCache.clear();
}

export function getModelFromCache(url: string): GLBModel | undefined {
  return modelCache.get(url);
}

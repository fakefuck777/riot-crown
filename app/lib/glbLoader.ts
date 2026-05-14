import { useGLTF } from '@react-three/drei';
import * as THREE from 'three';

interface GLBModel {
  scene: THREE.Group;
  animations: THREE.AnimationClip[];
}

const modelCache = new Map<string, GLBModel>();

export function useGLBModel(url: string): GLBModel | null {
  try {
    if (modelCache.has(url)) {
      return modelCache.get(url) || null;
    }

    const { scene, animations } = useGLTF(url) as { scene: THREE.Group; animations: THREE.AnimationClip[] };
    const model = { scene, animations };
    modelCache.set(url, model);
    return model;
  } catch (error) {
    console.error(`Failed to load GLB model: ${url}`, error);
    return null;
  }
}

export function preloadGLBModel(url: string): Promise<GLBModel> {
  return new Promise((resolve, reject) => {
    useGLTF.preload(url);
    try {
      const model = useGLBModel(url);
      if (model) {
        resolve(model);
      } else {
        reject(new Error(`Failed to preload model: ${url}`));
      }
    } catch (error) {
      reject(error);
    }
  });
}

export function clearModelCache() {
  modelCache.clear();
}

export function getModelFromCache(url: string): GLBModel | undefined {
  return modelCache.get(url);
}

import type { Keypoint } from './exercise-detector';

let detector: any = null;
let isLoading = false;
let scriptsLoaded = false;

/** Dynamically load TF.js scripts on first use (not on every page load) */
async function loadTfScripts(): Promise<void> {
  if (scriptsLoaded) return;
  const w = globalThis as any;
  if (w.tf && w.poseDetection) { scriptsLoaded = true; return; }

  await new Promise<void>((resolve, reject) => {
    const s1 = document.createElement('script');
    s1.src = 'https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@4/dist/tf.min.js';
    s1.onload = () => {
      const s2 = document.createElement('script');
      s2.src = 'https://cdn.jsdelivr.net/npm/@tensorflow-models/pose-detection';
      s2.onload = () => { scriptsLoaded = true; resolve(); };
      s2.onerror = reject;
      document.head.appendChild(s2);
    };
    s1.onerror = reject;
    document.head.appendChild(s1);
  });
}

function getTfGlobals() {
  const w = globalThis as any;
  if (!w.poseDetection || !w.tf) {
    throw new Error('TensorFlow.js not loaded.');
  }
  return { poseDetection: w.poseDetection, tf: w.tf };
}

export async function initDetector(onProgress?: (msg: string) => void): Promise<void> {
  if (detector || isLoading) return;
  isLoading = true;
  try {
    onProgress?.('Chargement IA...');
    await loadTfScripts();
    const { poseDetection, tf } = getTfGlobals();
    onProgress?.('Verification GPU...');
    await tf.ready();
    onProgress?.(`Backend: ${tf.getBackend()}`);
    onProgress?.('Chargement modele...');
    detector = await poseDetection.createDetector(
      poseDetection.SupportedModels.MoveNet,
      { modelType: poseDetection.movenet.modelType.SINGLEPOSE_LIGHTNING }
    );
    onProgress?.('Pret !');
  } finally {
    isLoading = false;
  }
}

export async function detectPose(video: HTMLVideoElement): Promise<Keypoint[]> {
  if (!detector || video.readyState < 2) return [];
  try {
    const poses = await detector.estimatePoses(video);
    return poses.length > 0 ? (poses[0].keypoints as Keypoint[]) : [];
  } catch {
    return [];
  }
}

export function isDetectorReady(): boolean {
  return detector !== null;
}

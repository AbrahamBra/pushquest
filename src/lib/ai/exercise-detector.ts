import { angleBetween } from './geometry';
import type { ExerciseConfig, SignalType } from './exercises.config';

export interface Keypoint {
  name: string;
  x: number;
  y: number;
  score: number;
}

export interface ExerciseDetector {
  processFrame(keypoints: Keypoint[]): void;
  getReps(): number;
  getState(): 'up' | 'down';
  getFormScore(): number;
  getSignalValue(): number;
  reset(): void;
}

export function createExerciseDetector(config: ExerciseConfig): ExerciseDetector {
  let state: 'up' | 'down' = 'up';
  let reps = 0;
  let lastSignal = 0;
  let formScoreSum = 0;

  function getKp(keypoints: Keypoint[], name: string): Keypoint | undefined {
    return keypoints.find(k => k.name === name && k.score >= config.minConfidence);
  }

  /** Average angle from left+right side for bilateral symmetry */
  function avgBilateral(
    kps: Keypoint[],
    leftNames: [string, string, string],
    rightNames: [string, string, string]
  ): number | null {
    const [la, lb, lc] = leftNames.map(n => getKp(kps, n));
    const [ra, rb, rc] = rightNames.map(n => getKp(kps, n));
    const angles: number[] = [];
    if (la && lb && lc) angles.push(angleBetween(la, lb, lc));
    if (ra && rb && rc) angles.push(angleBetween(ra, rb, rc));
    return angles.length ? angles.reduce((a, b) => a + b, 0) / angles.length : null;
  }

  // ─── Signal computation per type ────────────────────────

  function computeElbowAngle(kps: Keypoint[]): number | null {
    return avgBilateral(
      kps,
      ['left_shoulder', 'left_elbow', 'left_wrist'],
      ['right_shoulder', 'right_elbow', 'right_wrist']
    );
  }

  function computeKneeAngle(kps: Keypoint[]): number | null {
    return avgBilateral(
      kps,
      ['left_hip', 'left_knee', 'left_ankle'],
      ['right_hip', 'right_knee', 'right_ankle']
    );
  }

  function computeHipAngle(kps: Keypoint[]): number | null {
    return avgBilateral(
      kps,
      ['left_shoulder', 'left_hip', 'left_knee'],
      ['right_shoulder', 'right_hip', 'right_knee']
    );
  }

  function computeShoulderAngle(kps: Keypoint[]): number | null {
    return avgBilateral(
      kps,
      ['left_elbow', 'left_shoulder', 'left_hip'],
      ['right_elbow', 'right_shoulder', 'right_hip']
    );
  }

  function computeTorsoRatio(kps: Keypoint[]): number | null {
    const ls = getKp(kps, 'left_shoulder'), rs = getKp(kps, 'right_shoulder');
    const lh = getKp(kps, 'left_hip'), rh = getKp(kps, 'right_hip');
    const la = getKp(kps, 'left_ankle'), ra = getKp(kps, 'right_ankle');

    // Average shoulder Y, hip Y, ankle Y
    const shoulders: number[] = [];
    const hips: number[] = [];
    const ankles: number[] = [];
    if (ls) shoulders.push(ls.y); if (rs) shoulders.push(rs.y);
    if (lh) hips.push(lh.y); if (rh) hips.push(rh.y);
    if (la) ankles.push(la.y); if (ra) ankles.push(ra.y);

    if (!shoulders.length || !hips.length || !ankles.length) return null;

    const avgS = shoulders.reduce((a, b) => a + b, 0) / shoulders.length;
    const avgH = hips.reduce((a, b) => a + b, 0) / hips.length;
    const avgA = ankles.reduce((a, b) => a + b, 0) / ankles.length;

    const totalHeight = avgA - avgS;
    if (totalHeight < 10) return null; // Too small to measure

    // Ratio: how "crunched" the torso is relative to full body
    return (avgH - avgS) / totalHeight;
  }

  const SIGNAL_FN: Record<SignalType, (kps: Keypoint[]) => number | null> = {
    'elbow-angle': computeElbowAngle,
    'knee-angle': computeKneeAngle,
    'hip-angle': computeHipAngle,
    'shoulder-angle': computeShoulderAngle,
    'torso-ratio': computeTorsoRatio,
  };

  function computeSignal(kps: Keypoint[]): number | null {
    return SIGNAL_FN[config.signalType](kps);
  }

  return {
    processFrame(keypoints: Keypoint[]) {
      const signal = computeSignal(keypoints);
      if (signal === null) return;
      lastSignal = signal;

      if (state === 'up' && signal < config.downThreshold) {
        state = 'down';
      } else if (state === 'down' && signal > config.upThreshold) {
        state = 'up';
        reps++;
        // Form score: how deep did they go relative to thresholds
        const range = config.upThreshold - config.downThreshold;
        const depth = range > 0
          ? Math.min(1, Math.max(0, (config.upThreshold - signal) / range + 0.5))
          : 0.5;
        formScoreSum += depth;
      }
    },
    getReps: () => reps,
    getState: () => state,
    getFormScore: () => reps > 0 ? formScoreSum / reps : 0,
    getSignalValue: () => lastSignal,
    reset() { state = 'up'; reps = 0; lastSignal = 0; formScoreSum = 0; },
  };
}

import { describe, it, expect } from 'vitest';
import { createBattle } from '../../src/lib/game/battle-engine';
import { createExerciseDetector } from '../../src/lib/ai/exercise-detector';
import { EXERCISES } from '../../src/lib/ai/exercises.config';
import { BOSSES } from '../../src/lib/game/bosses';
import { computeLevel, canFightBoss } from '../../src/lib/game/progression';

describe('Full battle flow integration', () => {
  it('simulates a complete push-up battle against goblin', () => {
    const boss = BOSSES[0]!; // Goblin, 20 HP
    const battle = createBattle(boss);
    const detector = createExerciseDetector(EXERCISES['pushup']!);

    // Mock time to advance 500ms between each rep (bypass 300ms anti-spam)
    let fakeTime = 1000;
    const origDateNow = Date.now;
    Date.now = () => fakeTime;

    // Simulate 20 push-up cycles (down + up = 1 rep each)
    for (let i = 0; i < 20; i++) {
      fakeTime += 500; // 500ms between reps
      // Simulate "down" frame
      detector.processFrame(makeDownFrame());
      // Simulate "up" frame
      detector.processFrame(makeUpFrame());

      // On each completed rep, deal damage
      if (detector.getReps() === i + 1) {
        battle.dealDamage();
      }
    }

    Date.now = origDateNow; // restore

    const state = battle.getState();
    expect(state.result).toBe('victory');
    expect(state.bossHP).toBe(0);
    expect(state.reps).toBe(20);
    expect(state.xpEarned).toBe(100 + 20 * 2); // base + reps bonus
  });

  it('XP from battle feeds into progression system', () => {
    const boss = BOSSES[0]!;
    const battle = createBattle(boss);
    for (let i = 0; i < 20; i++) battle.dealDamage();

    const xpEarned = battle.getState().xpEarned; // 140
    const level = computeLevel(xpEarned);
    expect(level).toBe(1); // 140 XP = still level 1

    // Accumulate more XP (4 goblin fights = 560 XP → level 3)
    const totalXP = xpEarned * 4; // 560
    const newLevel = computeLevel(totalXP);
    expect(newLevel).toBeGreaterThan(1);

    // Can now fight harder bosses
    expect(canFightBoss(newLevel, BOSSES[1]!)).toBe(true); // Orc requires level 3
  });

  it('detector resets between battles', () => {
    const detector = createExerciseDetector(EXERCISES['pushup']!);

    // First battle
    detector.processFrame(makeDownFrame());
    detector.processFrame(makeUpFrame());
    expect(detector.getReps()).toBe(1);

    // Reset for second battle
    detector.reset();
    expect(detector.getReps()).toBe(0);
    expect(detector.getState()).toBe('up');
  });

  it('squat detector works independently', () => {
    const detector = createExerciseDetector(EXERCISES['squat']!);
    expect(detector.getReps()).toBe(0);
    // Squat uses hip-ratio, different keypoints
    // Just verify it initializes correctly
    expect(detector.getState()).toBe('up');
  });
});

// Helper: create push-up "down" keypoints (elbow angle ~63 degrees)
function makeDownFrame() {
  const names = ['nose','left_eye','right_eye','left_ear','right_ear',
    'left_shoulder','right_shoulder','left_elbow','right_elbow',
    'left_wrist','right_wrist','left_hip','right_hip',
    'left_knee','right_knee','left_ankle','right_ankle'];
  const overrides: Record<string, { x: number; y: number; score: number }> = {
    left_shoulder: { x: 100, y: 50, score: 0.9 },
    left_elbow:    { x: 100, y: 100, score: 0.9 },
    left_wrist:    { x: 60, y: 80, score: 0.9 },
    right_shoulder:{ x: 200, y: 50, score: 0.9 },
    right_elbow:   { x: 200, y: 100, score: 0.9 },
    right_wrist:   { x: 240, y: 80, score: 0.9 },
  };
  return names.map(name => ({
    name,
    x: 100, y: 100, score: 0.1,
    ...(overrides[name] || {}),
  }));
}

// Helper: create push-up "up" keypoints (elbow angle 180 degrees - fully extended)
function makeUpFrame() {
  const names = ['nose','left_eye','right_eye','left_ear','right_ear',
    'left_shoulder','right_shoulder','left_elbow','right_elbow',
    'left_wrist','right_wrist','left_hip','right_hip',
    'left_knee','right_knee','left_ankle','right_ankle'];
  const overrides: Record<string, { x: number; y: number; score: number }> = {
    left_shoulder: { x: 100, y: 100, score: 0.9 },
    left_elbow:    { x: 120, y: 100, score: 0.9 },
    left_wrist:    { x: 140, y: 100, score: 0.9 },
    right_shoulder:{ x: 200, y: 100, score: 0.9 },
    right_elbow:   { x: 180, y: 100, score: 0.9 },
    right_wrist:   { x: 160, y: 100, score: 0.9 },
  };
  return names.map(name => ({
    name,
    x: 100, y: 100, score: 0.1,
    ...(overrides[name] || {}),
  }));
}

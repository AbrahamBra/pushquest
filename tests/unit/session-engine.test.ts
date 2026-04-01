import { describe, it, expect } from 'vitest';
import { createSessionEngine } from '../../src/lib/game/session-engine';
import type { ProgramSession } from '../../src/lib/data/types';

const mockSession: ProgramSession = {
  id: 'test-session',
  name: 'Test Session',
  dayOfWeek: 1,
  sessionOrder: 1,
  restBetweenExercisesSecs: 60,
  exercises: [
    { exerciseId: 'Pushups', exerciseOrder: 1, sets: 3, reps: '10', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: null },
    { exerciseId: 'Bodyweight_Squat', exerciseOrder: 2, sets: 2, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
  ],
};

const hasDetection = (id: string) => id === 'Pushups';

describe('SessionEngine', () => {
  it('starts in idle phase', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    const state = engine.getState();
    expect(state.phase).toBe('idle');
    expect(state.exercisesTotal).toBe(2);
    expect(state.totalReps).toBe(0);
  });

  it('starts exercise in correct mode', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    expect(engine.getState().phase).toBe('exercise');
    expect(engine.getState().inputMode).toBe('ai');
  });

  it('completes a set and goes to rest', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    engine.completeSet(10);
    const state = engine.getState();
    expect(state.phase).toBe('rest');
    expect(state.setsCompletedForExercise).toBe(1);
    expect(state.totalReps).toBe(10);
  });

  it('rest timer counts down', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    engine.completeSet(10);
    expect(engine.getState().restSecsLeft).toBe(60);
    engine.tick();
    expect(engine.getState().restSecsLeft).toBe(59);
  });

  it('skip rest goes back to exercise', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    engine.completeSet(10);
    engine.skipRest();
    expect(engine.getState().phase).toBe('exercise');
    expect(engine.getState().currentSetNumber).toBe(2);
  });

  it('completes all sets then moves to next exercise', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    for (let i = 0; i < 3; i++) {
      engine.completeSet(10);
      if (i < 2) engine.skipRest();
    }
    // After 3 sets, should rest before next exercise
    engine.skipRest();
    expect(engine.getState().phase).toBe('idle');
    expect(engine.getState().currentExerciseIdx).toBe(1);
  });

  it('completes session after all exercises', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    // Exercise 1: 3 sets
    engine.startExercise('ai');
    for (let i = 0; i < 3; i++) {
      engine.completeSet(10);
      if (engine.getState().phase === 'rest') engine.skipRest();
    }
    // Exercise 2: 2 sets
    engine.startExercise('manual');
    for (let i = 0; i < 2; i++) {
      engine.completeSet(15);
      if (engine.getState().phase === 'rest') engine.skipRest();
    }
    expect(engine.isComplete()).toBe(true);
    expect(engine.getState().totalReps).toBe(60); // 30 + 30
  });

  it('logs every completed set', () => {
    const engine = createSessionEngine(mockSession, hasDetection);
    engine.startExercise('ai');
    engine.completeSet(10, 50);
    engine.skipRest();
    engine.completeSet(8, 50);
    const logs = engine.getState().logs;
    expect(logs).toHaveLength(2);
    expect(logs[0]!.repsCompleted).toBe(10);
    expect(logs[1]!.repsCompleted).toBe(8);
    expect(logs[0]!.weightKg).toBe(50);
  });
});

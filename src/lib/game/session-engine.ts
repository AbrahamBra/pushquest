import type { ProgramSession, SessionExercise } from '$lib/data/types';

export type SessionPhase = 'idle' | 'exercise' | 'rest' | 'complete';
export type InputMode = 'ai' | 'manual';

export interface SetLog {
  exerciseId: string;
  exerciseOrder: number;
  setNumber: number;
  repsCompleted: number;
  weightKg: number | null;
  formScore: number | null;
  rpe: number | null;
}

export interface SessionState {
  phase: SessionPhase;
  currentExerciseIdx: number;
  currentSetNumber: number;
  totalSets: number;
  restSecsLeft: number;
  restSecsTotal: number;
  exercisesTotal: number;
  exercisesCompleted: number;
  setsCompletedForExercise: number;
  currentExercise: SessionExercise | null;
  inputMode: InputMode;
  logs: SetLog[];
  totalReps: number;
  startedAt: number;
  elapsedSecs: number;
}

export interface SessionEngine {
  getState(): SessionState;
  startExercise(mode: InputMode): void;
  completeSet(reps: number, weightKg?: number | null, formScore?: number | null, rpe?: number | null): void;
  startRest(): void;
  skipRest(): void;
  tick(): void;
  nextExercise(): void;
  isComplete(): boolean;
}

export function createSessionEngine(session: ProgramSession, hasDetectionFn: (exerciseId: string) => boolean): SessionEngine {
  let phase: SessionPhase = 'idle';
  let currentExerciseIdx = 0;
  let currentSetNumber = 1;
  let restSecsLeft = 0;
  let restSecsTotal = 0;
  let setsCompletedForExercise = 0;
  let logs: SetLog[] = [];
  let totalReps = 0;
  let startedAt = Date.now();
  let inputMode: InputMode = 'manual';

  const exercises = session.exercises;

  function currentExercise(): SessionExercise | null {
    return exercises[currentExerciseIdx] ?? null;
  }

  function exercisesCompleted(): number {
    const done = new Set(logs.map(l => l.exerciseOrder));
    return done.size;
  }

  return {
    getState(): SessionState {
      const ex = currentExercise();
      return {
        phase,
        currentExerciseIdx,
        currentSetNumber,
        totalSets: ex?.sets ?? 0,
        restSecsLeft,
        restSecsTotal,
        exercisesTotal: exercises.length,
        exercisesCompleted: exercisesCompleted(),
        setsCompletedForExercise,
        currentExercise: ex,
        inputMode,
        logs: [...logs],
        totalReps,
        startedAt,
        elapsedSecs: Math.floor((Date.now() - startedAt) / 1000),
      };
    },

    startExercise(mode: InputMode): void {
      const ex = currentExercise();
      if (!ex) return;
      phase = 'exercise';
      inputMode = mode;
      currentSetNumber = setsCompletedForExercise + 1;
    },

    completeSet(reps: number, weightKg?: number | null, formScore?: number | null, rpe?: number | null): void {
      const ex = currentExercise();
      if (!ex) return;

      logs.push({
        exerciseId: ex.exerciseId,
        exerciseOrder: ex.exerciseOrder,
        setNumber: currentSetNumber,
        repsCompleted: reps,
        weightKg: weightKg ?? null,
        formScore: formScore ?? null,
        rpe: rpe ?? null,
      });

      totalReps += reps;
      setsCompletedForExercise++;

      if (setsCompletedForExercise >= ex.sets) {
        // All sets done for this exercise
        if (currentExerciseIdx >= exercises.length - 1) {
          phase = 'complete';
        } else {
          // Auto-start rest before next exercise
          restSecsTotal = ex.restSecs;
          restSecsLeft = ex.restSecs;
          phase = 'rest';
        }
      } else {
        // More sets — rest between sets
        restSecsTotal = ex.restSecs;
        restSecsLeft = ex.restSecs;
        phase = 'rest';
      }
    },

    startRest(): void {
      const ex = currentExercise();
      if (!ex) return;
      restSecsTotal = ex.restSecs;
      restSecsLeft = ex.restSecs;
      phase = 'rest';
    },

    skipRest(): void {
      restSecsLeft = 0;
      if (setsCompletedForExercise >= (currentExercise()?.sets ?? 0)) {
        // Move to next exercise
        this.nextExercise();
      } else {
        phase = 'exercise';
        currentSetNumber = setsCompletedForExercise + 1;
      }
    },

    tick(): void {
      if (phase === 'rest' && restSecsLeft > 0) {
        restSecsLeft--;
        if (restSecsLeft <= 0) {
          if (setsCompletedForExercise >= (currentExercise()?.sets ?? 0)) {
            this.nextExercise();
          } else {
            phase = 'exercise';
            currentSetNumber = setsCompletedForExercise + 1;
          }
        }
      }
    },

    nextExercise(): void {
      if (currentExerciseIdx >= exercises.length - 1) {
        phase = 'complete';
        return;
      }
      currentExerciseIdx++;
      setsCompletedForExercise = 0;
      currentSetNumber = 1;
      const ex = currentExercise();
      inputMode = ex && hasDetectionFn(ex.exerciseId) ? 'ai' : 'manual';
      phase = 'idle';
    },

    isComplete(): boolean {
      return phase === 'complete';
    },
  };
}

import type { BattleState, Battle } from './battle-engine';

/**
 * Creates a rep challenge — like a battle but victory triggers at target reps
 * instead of boss HP reaching 0. Implements the same Battle interface.
 */
export function createRepChallenge(targetReps: number, timeLimitSecs?: number): Battle {
  let reps = 0;
  let timeElapsedSecs = 0;
  let result: BattleState['result'] = 'active';

  return {
    dealDamage(): void {
      if (result !== 'active') return;
      reps++;
      if (reps >= targetReps) {
        result = 'victory';
      }
    },

    tick(): void {
      if (result !== 'active') return;
      timeElapsedSecs++;
      if (timeLimitSecs && timeElapsedSecs >= timeLimitSecs) {
        result = 'defeat';
      }
    },

    timeUp(): void {
      if (result === 'active') result = 'defeat';
    },

    flee(): void {
      if (result === 'active') result = 'fled';
    },

    getState(): BattleState {
      const remaining = targetReps - reps;
      return {
        bossHP: Math.max(0, remaining),
        bossMaxHP: targetReps,
        reps,
        damageDealt: reps,
        result,
        xpEarned: result === 'victory' ? reps * 2 : 0,
        timeElapsedSecs,
      };
    },
  };
}

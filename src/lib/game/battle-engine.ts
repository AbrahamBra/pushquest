import type { Boss } from './bosses';

export interface BattleState {
  bossHP: number;
  bossMaxHP: number;
  reps: number;
  damageDealt: number;
  result: 'active' | 'victory' | 'defeat' | 'fled';
  xpEarned: number;
  timeElapsedSecs: number;
}

export interface Battle {
  dealDamage(): void;
  timeUp(): void;
  flee(): void;
  tick(): void;
  getState(): BattleState;
}

export function createBattle(boss: Boss): Battle {
  let bossHP = boss.hp;
  let reps = 0;
  let result: BattleState['result'] = 'active';
  let timeElapsedSecs = 0;

  function calcXP(): number {
    if (result !== 'victory') return 0;
    return boss.xpReward + reps * 2;
  }

  return {
    dealDamage() {
      if (result !== 'active') return;
      reps++;
      bossHP = Math.max(0, bossHP - 1);
      if (bossHP <= 0) result = 'victory';
    },
    timeUp() {
      if (result !== 'active') return;
      result = 'defeat';
    },
    flee() {
      if (result !== 'active') return;
      result = 'fled';
    },
    tick() {
      if (result === 'active') timeElapsedSecs++;
    },
    getState(): BattleState {
      return {
        bossHP,
        bossMaxHP: boss.hp,
        reps,
        damageDealt: boss.hp - bossHP,
        result,
        xpEarned: calcXP(),
        timeElapsedSecs,
      };
    },
  };
}

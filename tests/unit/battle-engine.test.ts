import { describe, it, expect } from 'vitest';
import { createBattle } from '../../src/lib/game/battle-engine';
import { BOSSES } from '../../src/lib/game/bosses';

const goblin = BOSSES[0]!;

describe('BattleEngine', () => {
  it('starts with full HP', () => {
    const b = createBattle(goblin);
    expect(b.getState().bossHP).toBe(20);
    expect(b.getState().reps).toBe(0);
  });
  it('deals damage', () => {
    const b = createBattle(goblin);
    b.dealDamage();
    expect(b.getState().bossHP).toBe(19);
    expect(b.getState().reps).toBe(1);
  });
  it('victory at 0 HP', () => {
    const b = createBattle(goblin);
    for (let i = 0; i < 20; i++) b.dealDamage();
    expect(b.getState().bossHP).toBe(0);
    expect(b.getState().result).toBe('victory');
  });
  it('calculates XP', () => {
    const b = createBattle(goblin);
    for (let i = 0; i < 20; i++) b.dealDamage();
    expect(b.getState().xpEarned).toBe(100 + 20 * 2); // base + reps*2
  });
  it('stops at victory', () => {
    const b = createBattle(goblin);
    for (let i = 0; i < 25; i++) b.dealDamage();
    expect(b.getState().reps).toBe(20);
  });
  it('defeat on time up', () => {
    const b = createBattle(goblin);
    b.dealDamage();
    b.timeUp();
    expect(b.getState().result).toBe('defeat');
  });
  it('tracks damage dealt on defeat', () => {
    const b = createBattle(goblin);
    for (let i = 0; i < 15; i++) b.dealDamage();
    b.timeUp();
    expect(b.getState().damageDealt).toBe(15);
    expect(b.getState().bossMaxHP).toBe(20);
  });
  it('tracks time', () => {
    const b = createBattle(goblin);
    b.tick(); b.tick(); b.tick();
    expect(b.getState().timeElapsedSecs).toBe(3);
  });
  it('flee result', () => {
    const b = createBattle(goblin);
    b.flee();
    expect(b.getState().result).toBe('fled');
  });
});

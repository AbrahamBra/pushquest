import { describe, it, expect } from 'vitest';
import { createRepChallenge } from '../../src/lib/game/rep-challenge';

describe('RepChallenge', () => {
  it('starts with target as max HP', () => {
    const c = createRepChallenge(10);
    const s = c.getState();
    expect(s.bossMaxHP).toBe(10);
    expect(s.bossHP).toBe(10);
    expect(s.reps).toBe(0);
    expect(s.result).toBe('active');
  });

  it('deals damage and counts reps', () => {
    const c = createRepChallenge(10);
    c.dealDamage();
    c.dealDamage();
    const s = c.getState();
    expect(s.reps).toBe(2);
    expect(s.bossHP).toBe(8);
  });

  it('victory at target reps', () => {
    const c = createRepChallenge(5);
    for (let i = 0; i < 5; i++) c.dealDamage();
    const s = c.getState();
    expect(s.result).toBe('victory');
    expect(s.bossHP).toBe(0);
    expect(s.xpEarned).toBe(10); // 5 * 2
  });

  it('defeat on timer', () => {
    const c = createRepChallenge(10, 5);
    c.dealDamage();
    for (let i = 0; i < 5; i++) c.tick();
    const s = c.getState();
    expect(s.result).toBe('defeat');
    expect(s.xpEarned).toBe(0);
  });

  it('flee result', () => {
    const c = createRepChallenge(10);
    c.flee();
    expect(c.getState().result).toBe('fled');
  });

  it('no timer means no time limit', () => {
    const c = createRepChallenge(10);
    for (let i = 0; i < 100; i++) c.tick();
    expect(c.getState().result).toBe('active');
  });
});

export interface Boss {
  id: string;
  name: string;
  hp: number;
  timeLimitSecs: number;
  xpReward: number;
  difficulty: 'easy' | 'medium' | 'hard' | 'boss';
  requiredLevel: number;
  isFree: boolean;
}

export const BOSSES: Boss[] = [
  { id: 'goblin', name: 'GOBLIN', hp: 20, timeLimitSecs: 180, xpReward: 100, difficulty: 'easy', requiredLevel: 1, isFree: true },
  { id: 'orc',    name: 'ORC',    hp: 35, timeLimitSecs: 240, xpReward: 200, difficulty: 'medium', requiredLevel: 3, isFree: true },
  { id: 'troll',  name: 'TROLL',  hp: 50, timeLimitSecs: 300, xpReward: 350, difficulty: 'hard', requiredLevel: 5, isFree: false },
  { id: 'titan',  name: 'TITAN',  hp: 80, timeLimitSecs: 420, xpReward: 600, difficulty: 'boss', requiredLevel: 8, isFree: false },
];

export function getBoss(id: string): Boss | undefined {
  return BOSSES.find(b => b.id === id);
}

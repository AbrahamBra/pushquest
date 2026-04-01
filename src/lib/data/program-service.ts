import { PROGRAMS } from './programs';
import type { Program, ProgramGoal, ProgramLevel, ProgramSplit, EquipmentCategory } from './types';
import { EQUIPMENT_CATEGORIES } from './types';

/** Get all available programs */
export function getAllPrograms(): Program[] {
  return PROGRAMS;
}

/** Get a program by ID */
export function getProgram(id: string): Program | undefined {
  return PROGRAMS.find(p => p.id === id);
}

/** Filter programs by criteria */
export function filterPrograms(opts?: {
  goal?: ProgramGoal;
  level?: ProgramLevel;
  split?: ProgramSplit;
  equipment?: EquipmentCategory;
  freeOnly?: boolean;
  maxDaysPerWeek?: number;
}): Program[] {
  let results = PROGRAMS;

  if (opts?.goal) {
    results = results.filter(p => p.goal === opts.goal);
  }

  if (opts?.level) {
    results = results.filter(p => p.level === opts.level);
  }

  if (opts?.split) {
    results = results.filter(p => p.split === opts.split);
  }

  if (opts?.equipment) {
    const available = EQUIPMENT_CATEGORIES[opts.equipment];
    results = results.filter(p =>
      p.equipmentNeeded.every(eq => (available as readonly string[]).includes(eq))
    );
  }

  if (opts?.freeOnly) {
    results = results.filter(p => p.isFree);
  }

  if (opts?.maxDaysPerWeek) {
    results = results.filter(p => p.daysPerWeek <= opts.maxDaysPerWeek!);
  }

  return results;
}

/** Recommend a program based on user profile */
export function recommendProgram(profile: {
  goal: ProgramGoal;
  daysPerWeek: number;
  equipment: EquipmentCategory;
  experience: ProgramLevel;
}): Program | undefined {
  const candidates = filterPrograms({
    goal: profile.goal,
    level: profile.experience,
    equipment: profile.equipment,
    maxDaysPerWeek: profile.daysPerWeek,
    freeOnly: true,
  });

  // Prefer programs closer to the desired days per week
  return candidates.sort((a, b) =>
    Math.abs(a.daysPerWeek - profile.daysPerWeek) -
    Math.abs(b.daysPerWeek - profile.daysPerWeek)
  )[0];
}

/** Get goal display info */
export const GOAL_INFO: Record<ProgramGoal, { label: string; emoji: string; description: string }> = {
  hypertrophy: { label: 'Prise de masse', emoji: '💪', description: 'Volume musculaire maximal' },
  strength: { label: 'Force', emoji: '🏋️', description: 'Soulever plus lourd' },
  endurance: { label: 'Endurance', emoji: '🔥', description: 'Tenir plus longtemps' },
  cut: { label: 'Seche', emoji: '⚡', description: 'Perdre du gras, garder le muscle' },
  general: { label: 'Remise en forme', emoji: '🌟', description: 'Reprendre le sport' },
};

/** Get split display info */
export const SPLIT_INFO: Record<ProgramSplit, { label: string; description: string }> = {
  full_body: { label: 'Full Body', description: 'Tout le corps a chaque seance' },
  upper_lower: { label: 'Upper / Lower', description: 'Haut du corps / Bas du corps en alternance' },
  ppl: { label: 'Push / Pull / Legs', description: 'Pousser / Tirer / Jambes' },
  bro_split: { label: 'Bro Split', description: 'Un groupe musculaire par jour' },
  custom: { label: 'Custom', description: 'Programme personnalise' },
};

/** Calculate total volume for a session (sets * exercises) */
export function getSessionVolume(programId: string, sessionId: string): number {
  const program = getProgram(programId);
  if (!program) return 0;

  for (const phase of program.phases) {
    const session = phase.sessions.find(s => s.id === sessionId);
    if (session) {
      return session.exercises.reduce((sum, ex) => sum + ex.sets, 0);
    }
  }
  return 0;
}

/** Get all unique exercise IDs used in a program */
export function getProgramExerciseIds(programId: string): string[] {
  const program = getProgram(programId);
  if (!program) return [];

  const ids = new Set<string>();
  for (const phase of program.phases) {
    for (const session of phase.sessions) {
      for (const ex of session.exercises) {
        ids.add(ex.exerciseId);
      }
    }
  }
  return [...ids];
}

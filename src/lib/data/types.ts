// Exercise from free-exercise-db (public domain)
export interface Exercise {
  id: string;
  name: string;
  force: 'push' | 'pull' | 'static' | null;
  level: 'beginner' | 'intermediate' | 'expert';
  mechanic: 'compound' | 'isolation' | null;
  equipment: string | null;
  category: 'strength' | 'plyometrics' | 'cardio' | 'powerlifting' | 'stretching' | 'olympic weightlifting' | 'strongman';
  primaryMuscles: MuscleGroup[];
  secondaryMuscles: MuscleGroup[];
  instructions: string[];
  images: string[];
}

export type MuscleGroup =
  | 'abdominals' | 'abductors' | 'adductors' | 'biceps' | 'calves'
  | 'chest' | 'forearms' | 'glutes' | 'hamstrings' | 'lats'
  | 'lower back' | 'middle back' | 'neck' | 'quadriceps'
  | 'shoulders' | 'traps' | 'triceps';

export type ProgramGoal = 'hypertrophy' | 'strength' | 'endurance' | 'cut' | 'general';
export type ProgramLevel = 'beginner' | 'intermediate' | 'advanced';
export type ProgramSplit = 'full_body' | 'upper_lower' | 'ppl' | 'bro_split' | 'custom';
export type PhaseIntensity = 'light' | 'moderate' | 'high' | 'max';

export interface Program {
  id: string;
  name: string;
  description: string;
  goal: ProgramGoal;
  level: ProgramLevel;
  durationWeeks: number;
  daysPerWeek: number;
  split: ProgramSplit;
  equipmentNeeded: string[];
  isFree: boolean;
  phases: ProgramPhase[];
}

export interface ProgramPhase {
  id: string;
  name: string;
  description: string;
  phaseOrder: number;
  weekStart: number;
  weekEnd: number;
  intensity: PhaseIntensity;
  sessions: ProgramSession[];
}

export interface ProgramSession {
  id: string;
  name: string;
  dayOfWeek: number | null;
  sessionOrder: number;
  restBetweenExercisesSecs: number;
  exercises: SessionExercise[];
}

export interface SessionExercise {
  exerciseId: string;
  exerciseOrder: number;
  sets: number;
  reps: string;
  restSecs: number;
  rpe: number | null;
  tempo: string | null;
  notes: string | null;
  progressionRule: string | null;
}

// Equipment categories for filtering
export const EQUIPMENT_CATEGORIES = {
  bodyweight: ['body only'],
  minimal: ['body only', 'bands', 'dumbbell', 'kettlebells'],
  home_gym: ['body only', 'bands', 'dumbbell', 'kettlebells', 'barbell', 'exercise ball'],
  full_gym: ['body only', 'bands', 'dumbbell', 'kettlebells', 'barbell', 'exercise ball', 'cable', 'machine', 'e-z curl bar', 'medicine ball'],
} as const;

export type EquipmentCategory = keyof typeof EQUIPMENT_CATEGORIES;

// Muscle group display info
export const MUSCLE_GROUPS: Record<MuscleGroup, { label: string; bodyPart: 'upper' | 'lower' | 'core' }> = {
  chest: { label: 'Pectoraux', bodyPart: 'upper' },
  shoulders: { label: 'Epaules', bodyPart: 'upper' },
  triceps: { label: 'Triceps', bodyPart: 'upper' },
  biceps: { label: 'Biceps', bodyPart: 'upper' },
  forearms: { label: 'Avant-bras', bodyPart: 'upper' },
  lats: { label: 'Dorsaux', bodyPart: 'upper' },
  'middle back': { label: 'Dos moyen', bodyPart: 'upper' },
  traps: { label: 'Trapezes', bodyPart: 'upper' },
  'lower back': { label: 'Lombaires', bodyPart: 'core' },
  abdominals: { label: 'Abdominaux', bodyPart: 'core' },
  quadriceps: { label: 'Quadriceps', bodyPart: 'lower' },
  hamstrings: { label: 'Ischio-jambiers', bodyPart: 'lower' },
  glutes: { label: 'Fessiers', bodyPart: 'lower' },
  calves: { label: 'Mollets', bodyPart: 'lower' },
  adductors: { label: 'Adducteurs', bodyPart: 'lower' },
  abductors: { label: 'Abducteurs', bodyPart: 'lower' },
  neck: { label: 'Cou', bodyPart: 'upper' },
};

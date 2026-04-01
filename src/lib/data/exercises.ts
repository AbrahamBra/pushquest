import type { Exercise, MuscleGroup, EquipmentCategory } from './types';
import { EQUIPMENT_CATEGORIES } from './types';

// In-memory exercise catalog loaded from static JSON
let exerciseCache: Exercise[] | null = null;
let exerciseMap: Map<string, Exercise> | null = null;

/** Load exercises from static JSON (call once on app init or lazily) */
export async function loadExercises(): Promise<Exercise[]> {
  if (exerciseCache) return exerciseCache;
  const res = await fetch('/exercises.json');
  exerciseCache = await res.json();
  exerciseMap = new Map(exerciseCache!.map(e => [e.id, e]));
  return exerciseCache!;
}

/** Get a single exercise by ID */
export function getExercise(id: string): Exercise | undefined {
  return exerciseMap?.get(id);
}

/** Get multiple exercises by IDs */
export function getExercises(ids: string[]): Exercise[] {
  if (!exerciseMap) return [];
  return ids.map(id => exerciseMap!.get(id)).filter((e): e is Exercise => !!e);
}

/** Filter exercises by criteria */
export function filterExercises(opts: {
  muscles?: MuscleGroup[];
  equipment?: EquipmentCategory | string[];
  level?: Exercise['level'];
  category?: Exercise['category'];
  mechanic?: Exercise['mechanic'];
  force?: Exercise['force'];
  search?: string;
}): Exercise[] {
  if (!exerciseCache) return [];

  let results = exerciseCache;

  if (opts.muscles?.length) {
    results = results.filter(e =>
      opts.muscles!.some(m => e.primaryMuscles.includes(m) || e.secondaryMuscles.includes(m))
    );
  }

  if (opts.equipment) {
    const allowed = Array.isArray(opts.equipment)
      ? opts.equipment
      : EQUIPMENT_CATEGORIES[opts.equipment];
    results = results.filter(e => e.equipment && (allowed as readonly string[]).includes(e.equipment));
  }

  if (opts.level) {
    results = results.filter(e => e.level === opts.level);
  }

  if (opts.category) {
    results = results.filter(e => e.category === opts.category);
  }

  if (opts.mechanic) {
    results = results.filter(e => e.mechanic === opts.mechanic);
  }

  if (opts.force) {
    results = results.filter(e => e.force === opts.force);
  }

  if (opts.search) {
    const q = opts.search.toLowerCase();
    results = results.filter(e => e.name.toLowerCase().includes(q));
  }

  return results;
}

/** Get all exercises targeting a specific muscle group (primary or secondary) */
export function getExercisesForMuscle(muscle: MuscleGroup): { primary: Exercise[]; secondary: Exercise[] } {
  if (!exerciseCache) return { primary: [], secondary: [] };
  return {
    primary: exerciseCache.filter(e => e.primaryMuscles.includes(muscle)),
    secondary: exerciseCache.filter(e => e.secondaryMuscles.includes(muscle) && !e.primaryMuscles.includes(muscle)),
  };
}

/** Get unique equipment types from the catalog */
export function getAvailableEquipment(): string[] {
  if (!exerciseCache) return [];
  return [...new Set(exerciseCache.map(e => e.equipment).filter((e): e is string => !!e))].sort();
}

/** Get exercise count stats */
export function getExerciseStats() {
  if (!exerciseCache) return null;
  const byCategory: Record<string, number> = {};
  const byLevel: Record<string, number> = {};
  const byEquipment: Record<string, number> = {};

  for (const e of exerciseCache) {
    byCategory[e.category] = (byCategory[e.category] || 0) + 1;
    byLevel[e.level] = (byLevel[e.level] || 0) + 1;
    if (e.equipment) byEquipment[e.equipment] = (byEquipment[e.equipment] || 0) + 1;
  }

  return { total: exerciseCache.length, byCategory, byLevel, byEquipment };
}

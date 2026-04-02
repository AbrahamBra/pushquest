/**
 * Exercise detection configurations for AI pose detection.
 *
 * Signal types and what they measure:
 * - elbow-angle: angle at elbow (shoulder→elbow→wrist) — pushups, dips, curls
 * - knee-angle: angle at knee (hip→knee→ankle) — squats, lunges
 * - hip-angle: angle at hip (shoulder→hip→knee) — bridges, deadlifts
 * - shoulder-angle: angle at shoulder (elbow→shoulder→hip) — overhead press
 * - torso-ratio: vertical ratio of shoulder-to-hip vs hip-to-ankle — ab exercises
 *
 * Each config defines:
 * - downThreshold: signal value below which = "down" position
 * - upThreshold: signal value above which = "up" position (1 rep counted)
 * - minConfidence: minimum keypoint detection confidence
 * - formCues: hints for audio feedback
 */

export type SignalType = 'elbow-angle' | 'knee-angle' | 'hip-angle' | 'shoulder-angle' | 'torso-ratio';

export interface ExerciseConfig {
  id: string;
  name: string;
  downThreshold: number;
  upThreshold: number;
  minConfidence: number;
  signalType: SignalType;
  formCues?: {
    tooFast?: string;
    depthWarning?: string;
    symmetryWarning?: string;
  };
}

/**
 * All AI-detectable exercises.
 * Exercises not in this map use manual rep logging.
 */
export const EXERCISES: Record<string, ExerciseConfig> = {

  // ═══════════════════════════════════════════
  // PUSH (elbow-angle based)
  // ═══════════════════════════════════════════

  pushup: {
    id: 'pushup',
    name: 'Push-ups',
    downThreshold: 90,
    upThreshold: 155,
    minConfidence: 0.4,
    signalType: 'elbow-angle',
    formCues: {
      depthWarning: 'Descends plus bas',
      tooFast: 'Ralentis le mouvement',
    },
  },

  'close-grip-pushup': {
    id: 'close-grip-pushup',
    name: 'Close-Grip Push-Ups',
    downThreshold: 85,
    upThreshold: 155,
    minConfidence: 0.4,
    signalType: 'elbow-angle',
    formCues: {
      depthWarning: 'Coudes pres du corps',
    },
  },

  'incline-pushup': {
    id: 'incline-pushup',
    name: 'Incline Push-Ups',
    downThreshold: 90,
    upThreshold: 155,
    minConfidence: 0.35,
    signalType: 'elbow-angle',
  },

  dips: {
    id: 'dips',
    name: 'Dips',
    downThreshold: 90,
    upThreshold: 155,
    minConfidence: 0.35,
    signalType: 'elbow-angle',
    formCues: {
      depthWarning: 'Descends jusqu\'aux 90 degres',
    },
  },

  'bench-dips': {
    id: 'bench-dips',
    name: 'Bench Dips',
    downThreshold: 85,
    upThreshold: 150,
    minConfidence: 0.35,
    signalType: 'elbow-angle',
  },

  'body-tricep-press': {
    id: 'body-tricep-press',
    name: 'Body Tricep Press',
    downThreshold: 80,
    upThreshold: 150,
    minConfidence: 0.35,
    signalType: 'elbow-angle',
  },

  // ═══════════════════════════════════════════
  // LEGS (knee-angle based)
  // ═══════════════════════════════════════════

  squat: {
    id: 'squat',
    name: 'Squats',
    downThreshold: 85,     // ~parallel (was 100 = quarter squat)
    upThreshold: 155,
    minConfidence: 0.35,
    signalType: 'knee-angle',
    formCues: {
      depthWarning: 'Plus profond — cuisses paralleles',
      symmetryWarning: 'Equilibre les deux cotes',
    },
  },

  'jump-squat': {
    id: 'jump-squat',
    name: 'Jump Squats',
    downThreshold: 95,     // slightly less deep than squat (was 105)
    upThreshold: 155,
    minConfidence: 0.3,
    signalType: 'knee-angle',
    formCues: {
      depthWarning: 'Descends avant de sauter',
    },
  },

  lunge: {
    id: 'lunge',
    name: 'Lunges',
    downThreshold: 90,     // knee at ~90 degrees (was 95)
    upThreshold: 155,
    minConfidence: 0.3,
    signalType: 'knee-angle',
    formCues: {
      depthWarning: 'Genou arriere vers le sol',
    },
  },

  'bench-jump': {
    id: 'bench-jump',
    name: 'Bench Jump',
    downThreshold: 100,    // less depth needed for explosive (was 110)
    upThreshold: 160,
    minConfidence: 0.3,
    signalType: 'knee-angle',
  },

  // ═══════════════════════════════════════════
  // PULL (elbow-angle, inverted thresholds)
  // ═══════════════════════════════════════════

  pullup: {
    id: 'pullup',
    name: 'Pull-ups',
    downThreshold: 60,  // Arms bent at top = down signal
    upThreshold: 140,   // Arms extended at bottom = up signal
    minConfidence: 0.35,
    signalType: 'elbow-angle',
    formCues: {
      depthWarning: 'Menton au-dessus de la barre',
    },
  },

  chinup: {
    id: 'chinup',
    name: 'Chin-ups',
    downThreshold: 60,
    upThreshold: 140,
    minConfidence: 0.35,
    signalType: 'elbow-angle',
  },

  // ═══════════════════════════════════════════
  // OVERHEAD PRESS (shoulder-angle based)
  // ═══════════════════════════════════════════

  'overhead-press': {
    id: 'overhead-press',
    name: 'Overhead Press',
    downThreshold: 90,   // Arms at shoulder level
    upThreshold: 165,    // Arms fully extended overhead
    minConfidence: 0.35,
    signalType: 'shoulder-angle',
    formCues: {
      depthWarning: 'Extension complete en haut',
    },
  },

  'handstand-pushup': {
    id: 'handstand-pushup',
    name: 'Handstand Push-Ups',
    downThreshold: 90,
    upThreshold: 160,
    minConfidence: 0.3,
    signalType: 'shoulder-angle',
  },

  // ═══════════════════════════════════════════
  // HIP HINGE (hip-angle based)
  // ═══════════════════════════════════════════

  'glute-bridge': {
    id: 'glute-bridge',
    name: 'Glute Bridge',
    downThreshold: 100,  // Hips low
    upThreshold: 160,    // Hips fully extended
    minConfidence: 0.35,
    signalType: 'hip-angle',
    formCues: {
      depthWarning: 'Serre les fessiers en haut',
    },
  },

  'hip-thrust': {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    downThreshold: 95,
    upThreshold: 160,
    minConfidence: 0.35,
    signalType: 'hip-angle',
  },

  'glute-kickback': {
    id: 'glute-kickback',
    name: 'Glute Kickback',
    downThreshold: 100,
    upThreshold: 155,
    minConfidence: 0.3,
    signalType: 'hip-angle',
  },

  // ═══════════════════════════════════════════
  // ABS — REMOVED from AI detection
  // torso-ratio signal is unreliable with MoveNet 2D keypoints
  // (floor exercises = poor keypoint accuracy, thresholds not validated)
  // All abs exercises use manual rep counting instead.
  // ═══════════════════════════════════════════
};

/**
 * Map from free-exercise-db IDs to our detection config IDs.
 * Exercises not in this map are tracked via manual logging.
 */
export const EXERCISE_DETECTION_MAP: Record<string, string> = {
  // Push
  'Pushups': 'pushup',
  'Close-Grip_Push-Up_off_of_a_Dumbbell': 'close-grip-pushup',
  'Incline_Push-Up': 'incline-pushup',
  'Incline_Push-Up_Medium': 'incline-pushup',
  'Incline_Push-Up_Reverse_Grip': 'incline-pushup',
  'Incline_Push-Up_Wide': 'incline-pushup',
  'Dips_-_Triceps_Version': 'dips',
  'Bench_Dips': 'bench-dips',
  'Body_Tricep_Press': 'body-tricep-press',

  // Legs
  'Bodyweight_Squat': 'squat',
  'Barbell_Squat': 'squat',
  'Barbell_Full_Squat': 'squat',
  'Freehand_Jump_Squat': 'jump-squat',
  'Barbell_Lunge': 'lunge',
  'Dumbbell_Lunges': 'lunge',
  'Bench_Jump': 'bench-jump',

  // Pulls
  'Pullups': 'pullup',
  'Chin-Up': 'chinup',
  'Wide-Grip_Rear_Pull-Up': 'pullup',
  'V-Bar_Pullup': 'pullup',

  // Overhead press
  'Barbell_Shoulder_Press': 'overhead-press',
  'Dumbbell_Shoulder_Press': 'overhead-press',
  'Handstand_Push-Ups': 'handstand-pushup',

  // Hip hinge
  'Butt_Lift_Bridge': 'glute-bridge',
  'Single_Leg_Glute_Bridge': 'glute-bridge',
  'Barbell_Hip_Thrust': 'hip-thrust',
  'Barbell_Glute_Bridge': 'glute-bridge',
  'Glute_Kickback': 'glute-kickback',

  // Abs — manual logging only (torso-ratio unreliable)
};

/** Check if an exercise from free-exercise-db has AI detection support */
export function hasDetection(exerciseDbId: string): boolean {
  return exerciseDbId in EXERCISE_DETECTION_MAP;
}

/** Get detection config for a free-exercise-db exercise, or null */
export function getDetectionConfig(exerciseDbId: string): ExerciseConfig | null {
  const configId = EXERCISE_DETECTION_MAP[exerciseDbId];
  return configId ? EXERCISES[configId] ?? null : null;
}

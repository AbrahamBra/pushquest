import type { Program } from './types';

/**
 * Curated training programs for PushQuest.
 * Each program references exercises by ID from free-exercise-db.
 * Programs are structured with periodization phases and progressive overload.
 */
export const PROGRAMS: Program[] = [

  // ─────────────────────────────────────────────────────────
  // 1. HYPERTROPHY - PPL (Push/Pull/Legs) - Intermediate
  // ─────────────────────────────────────────────────────────
  {
    id: 'hypertrophy-ppl-intermediate',
    name: 'Le Forgeron',
    description: 'Programme PPL classique pour la prise de masse. 6 jours par semaine, ideal pour les pratiquants intermediaires visant le volume musculaire.',
    goal: 'hypertrophy',
    level: 'intermediate',
    durationWeeks: 12,
    daysPerWeek: 6,
    split: 'ppl',
    equipmentNeeded: ['barbell', 'dumbbell', 'cable', 'machine'],
    isFree: true,
    phases: [
      {
        id: 'hyp-ppl-p1',
        name: 'Accumulation',
        description: 'Volume progressif, reps moderees a hautes',
        phaseOrder: 1,
        weekStart: 1,
        weekEnd: 4,
        intensity: 'moderate',
        sessions: [
          {
            id: 'hyp-ppl-push-a',
            name: 'Push A (Pectoraux)',
            dayOfWeek: 1,
            sessionOrder: 1,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 4, reps: '8-10', restSecs: 120, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Incline_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Flyes', exerciseOrder: 3, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '3-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 4, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 5, sets: 3, reps: '12-15', restSecs: 60, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dips_-_Triceps_Version', exerciseOrder: 6, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-ppl-pull-a',
            name: 'Pull A (Dos-Biceps)',
            dayOfWeek: 2,
            sessionOrder: 2,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 1, sets: 3, reps: '5-6', restSecs: 180, rpe: 7, tempo: null, notes: 'Pas a failure', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Pullups', exerciseOrder: 2, sets: 4, reps: '6-10', restSecs: 90, rpe: 7, tempo: null, notes: 'Ajouter du lest si +10 reps', progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Rear_Delt_Row', exerciseOrder: 3, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: '2-1-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Seated_Cable_Rows', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Curl', exerciseOrder: 5, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Hammer_Curls', exerciseOrder: 6, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-ppl-legs-a',
            name: 'Legs A (Quadriceps)',
            dayOfWeek: 3,
            sessionOrder: 3,
            restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 180, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Lunge', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 90, rpe: 7, tempo: null, notes: 'Par jambe', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Press', exerciseOrder: 3, sets: 3, reps: '10-15', restSecs: 90, rpe: 8, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Extensions', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 60, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 5, sets: 4, reps: '12-15', restSecs: 60, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-ppl-push-b',
            name: 'Push B (Epaules)',
            dayOfWeek: 4,
            sessionOrder: 4,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 120, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 3, sets: 4, reps: '15-20', restSecs: 45, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Cable_Crossover', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Lying_Triceps_Press', exerciseOrder: 5, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Tricep_Dumbbell_Kickback', exerciseOrder: 6, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-ppl-pull-b',
            name: 'Pull B (Largeur)',
            dayOfWeek: 5,
            sessionOrder: 5,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Chin-Up', exerciseOrder: 1, sets: 4, reps: '6-10', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'T-Bar_Row_with_Handle', exerciseOrder: 2, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: '2-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Straight-Arm_Dumbbell_Pullover', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 45, rpe: 7, tempo: '2-2-1-0', notes: 'Rotation externe', progressionRule: 'add_reps' },
              { exerciseId: 'Incline_Dumbbell_Curl', exerciseOrder: 5, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Palms-Down_Wrist_Curl_Over_A_Bench', exerciseOrder: 6, sets: 2, reps: '15-20', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-ppl-legs-b',
            name: 'Legs B (Ischios-Fessiers)',
            dayOfWeek: 6,
            sessionOrder: 6,
            restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 1, sets: 4, reps: '8-10', restSecs: 120, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Hip_Thrust', exerciseOrder: 2, sets: 4, reps: '8-12', restSecs: 90, rpe: 7, tempo: '2-2-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Lying_Leg_Curls', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: '2-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 60, rpe: 6, tempo: null, notes: 'Squat bulgare si possible', progressionRule: 'add_reps' },
              { exerciseId: 'Seated_Calf_Raise', exerciseOrder: 5, sets: 4, reps: '15-20', restSecs: 45, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      {
        id: 'hyp-ppl-p2',
        name: 'Intensification',
        description: 'Augmentation de la charge, baisse du volume',
        phaseOrder: 2,
        weekStart: 5,
        weekEnd: 8,
        intensity: 'high',
        sessions: [], // Same structure, RPE bumped to 8, reps shifted down by 2
      },
      {
        id: 'hyp-ppl-p3',
        name: 'Peak & Deload',
        description: 'Semaines 9-11 peak, semaine 12 deload',
        phaseOrder: 3,
        weekStart: 9,
        weekEnd: 12,
        intensity: 'max',
        sessions: [], // Peak weeks + deload
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 2. STRENGTH - 5x5 Style - Beginner
  // ─────────────────────────────────────────────────────────
  {
    id: 'strength-5x5-beginner',
    name: 'Les Fondations',
    description: 'Programme force 5x5 pour debutants. 3 jours par semaine, base sur les mouvements composes. Progression lineaire.',
    goal: 'strength',
    level: 'beginner',
    durationWeeks: 12,
    daysPerWeek: 3,
    split: 'full_body',
    equipmentNeeded: ['barbell', 'dumbbell'],
    isFree: true,
    phases: [
      {
        id: 'str-5x5-p1',
        name: 'Apprentissage',
        description: 'Maitrise technique des mouvements de base',
        phaseOrder: 1,
        weekStart: 1,
        weekEnd: 4,
        intensity: 'moderate',
        sessions: [
          {
            id: 'str-5x5-a',
            name: 'Workout A',
            dayOfWeek: 1,
            sessionOrder: 1,
            restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 3, sets: 1, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '1x5 seulement', progressionRule: 'add_weight_every_session' },
            ],
          },
          {
            id: 'str-5x5-b',
            name: 'Workout B',
            dayOfWeek: 3,
            sessionOrder: 2,
            restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 3, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
            ],
          },
          {
            id: 'str-5x5-a2',
            name: 'Workout A',
            dayOfWeek: 5,
            sessionOrder: 3,
            restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 3, sets: 1, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '1x5 seulement', progressionRule: 'add_weight_every_session' },
            ],
          },
        ],
      },
      {
        id: 'str-5x5-p2',
        name: 'Progression',
        description: 'Augmentation lineaire de la charge (+2.5kg par seance)',
        phaseOrder: 2,
        weekStart: 5,
        weekEnd: 10,
        intensity: 'high',
        sessions: [], // Same sessions, weight increases linearly
      },
      {
        id: 'str-5x5-p3',
        name: 'Deload',
        description: 'Decharge puis test de maxima',
        phaseOrder: 3,
        weekStart: 11,
        weekEnd: 12,
        intensity: 'light',
        sessions: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 3. BODYWEIGHT / ENDURANCE - Full Body - Beginner
  // ─────────────────────────────────────────────────────────
  {
    id: 'endurance-bodyweight-beginner',
    name: 'Le Guerrier Sans Armes',
    description: 'Programme poids du corps pour debutants. Aucun materiel requis. Ideal pour commencer ou en deplacement.',
    goal: 'endurance',
    level: 'beginner',
    durationWeeks: 8,
    daysPerWeek: 4,
    split: 'upper_lower',
    equipmentNeeded: ['body only'],
    isFree: true,
    phases: [
      {
        id: 'end-bw-p1',
        name: 'Eveil du corps',
        description: 'Apprentissage des mouvements, volume faible',
        phaseOrder: 1,
        weekStart: 1,
        weekEnd: 4,
        intensity: 'light',
        sessions: [
          {
            id: 'end-bw-upper',
            name: 'Haut du corps',
            dayOfWeek: 1,
            sessionOrder: 1,
            restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: 'Sur genoux si necessaire', progressionRule: 'add_reps' },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 90, rpe: 7, tempo: null, notes: 'Negatifs si impossible', progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Dips', exerciseOrder: 3, sets: 3, reps: '10-15', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Handstand_Push-Ups', exerciseOrder: 4, sets: 3, reps: '5-8', restSecs: 60, rpe: 6, tempo: null, notes: 'Contre un mur, pike push-ups si debutant', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-bw-lower',
            name: 'Bas du corps + Core',
            dayOfWeek: 2,
            sessionOrder: 2,
            restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 3, reps: '15-20', restSecs: 60, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Flutter_Kicks', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 5, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-bw-upper2',
            name: 'Haut du corps B',
            dayOfWeek: 4,
            sessionOrder: 3,
            restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Close-Grip_Push-Up_off_of_a_Dumbbell', exerciseOrder: 1, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: null, notes: 'Au sol, prise serree', progressionRule: 'add_reps' },
              { exerciseId: 'Pullups', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Body_Tricep_Press', exerciseOrder: 3, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Air_Bike', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-bw-lower2',
            name: 'Bas du corps + Core B',
            dayOfWeek: 5,
            sessionOrder: 4,
            restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 4, reps: '20', restSecs: 45, rpe: 7, tempo: null, notes: 'Squat bulgare si possible', progressionRule: 'add_reps' },
              { exerciseId: 'Glute_Kickback', exerciseOrder: 2, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: '2-1-1-0', notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Jump', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bent-Knee_Hip_Raise', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Alternate_Heel_Touchers', exerciseOrder: 5, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      {
        id: 'end-bw-p2',
        name: 'Montee en puissance',
        description: 'Augmentation du volume et des variantes difficiles',
        phaseOrder: 2,
        weekStart: 5,
        weekEnd: 8,
        intensity: 'moderate',
        sessions: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 4. SECHE / CUT - Upper/Lower - Intermediate
  // ─────────────────────────────────────────────────────────
  {
    id: 'cut-upper-lower-intermediate',
    name: 'La Forge Ardente',
    description: 'Programme de seche : maintien de la force avec volume reduit et circuits metaboliques. 4 jours par semaine.',
    goal: 'cut',
    level: 'intermediate',
    durationWeeks: 8,
    daysPerWeek: 4,
    split: 'upper_lower',
    equipmentNeeded: ['barbell', 'dumbbell', 'cable'],
    isFree: false,
    phases: [
      {
        id: 'cut-ul-p1',
        name: 'Conservation',
        description: 'Maintien de la force, deficit calorique',
        phaseOrder: 1,
        weekStart: 1,
        weekEnd: 4,
        intensity: 'moderate',
        sessions: [
          {
            id: 'cut-upper-a',
            name: 'Upper Body (Force)',
            dayOfWeek: 1,
            sessionOrder: 1,
            restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 4, reps: '5-6', restSecs: 150, rpe: 8, tempo: null, notes: 'Maintenir les charges', progressionRule: null },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 4, reps: '5-6', restSecs: 150, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-lower-a',
            name: 'Lower Body (Force)',
            dayOfWeek: 2,
            sessionOrder: 2,
            restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 4, reps: '5-6', restSecs: 180, rpe: 8, tempo: null, notes: 'Maintenir les charges', progressionRule: null },
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 90, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: null },
              { exerciseId: 'Barbell_Lunge', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 90, rpe: 7, tempo: null, notes: 'Par jambe', progressionRule: null },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-upper-b',
            name: 'Upper Body (Metcon)',
            dayOfWeek: 4,
            sessionOrder: 3,
            restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: 'Circuit : enchainer 1-4', progressionRule: null },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 4, reps: '8', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 3, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Dips_-_Triceps_Version', exerciseOrder: 4, sets: 4, reps: '10', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit complet', progressionRule: null },
            ],
          },
          {
            id: 'cut-lower-b',
            name: 'Lower Body (Metcon)',
            dayOfWeek: 5,
            sessionOrder: 4,
            restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: 'Circuit : enchainer 1-4', progressionRule: null },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 3, sets: 4, reps: '20', restSecs: 30, rpe: 8, tempo: null, notes: 'Squat sumo', progressionRule: null },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 4, sets: 4, reps: '15', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit complet', progressionRule: null },
            ],
          },
        ],
      },
      {
        id: 'cut-ul-p2',
        name: 'Finition',
        description: 'Volume encore reduit, HIIT integre',
        phaseOrder: 2,
        weekStart: 5,
        weekEnd: 8,
        intensity: 'high',
        sessions: [],
      },
    ],
  },

  // ─────────────────────────────────────────────────────────
  // 5. GENERAL / REMISE EN FORME - Full Body - Beginner
  // ─────────────────────────────────────────────────────────
  {
    id: 'general-fullbody-beginner',
    name: 'Le Reveil du Heros',
    description: 'Programme de remise en forme complet. 3 jours full body, parfait pour reprendre le sport apres une pause.',
    goal: 'general',
    level: 'beginner',
    durationWeeks: 8,
    daysPerWeek: 3,
    split: 'full_body',
    equipmentNeeded: ['dumbbell', 'body only'],
    isFree: true,
    phases: [
      {
        id: 'gen-fb-p1',
        name: 'Adaptation',
        description: 'Reactivation musculaire, charges legeres',
        phaseOrder: 1,
        weekStart: 1,
        weekEnd: 4,
        intensity: 'light',
        sessions: [
          {
            id: 'gen-fb-day1',
            name: 'Full Body A',
            dayOfWeek: 1,
            sessionOrder: 1,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 3, reps: '12-15', restSecs: 60, rpe: 6, tempo: '3-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Pushups', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 6, tempo: null, notes: 'Sur genoux au debut', progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Lunges', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 60, rpe: 6, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Bicep_Curl', exerciseOrder: 4, sets: 2, reps: '12', restSecs: 45, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 5, sets: 3, reps: '15', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-fb-day2',
            name: 'Full Body B',
            dayOfWeek: 3,
            sessionOrder: 2,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 1, sets: 3, reps: '15', restSecs: 45, rpe: 6, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: '2-1-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Air_Bike', exerciseOrder: 5, sets: 3, reps: '15', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-fb-day3',
            name: 'Full Body C',
            dayOfWeek: 5,
            sessionOrder: 3,
            restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 3, reps: '10', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Dips', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Bicep_Curl', exerciseOrder: 3, sets: 3, reps: '12', restSecs: 45, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Glute_Kickback', exerciseOrder: 4, sets: 3, reps: '12', restSecs: 45, rpe: 6, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Alternate_Heel_Touchers', exerciseOrder: 5, sets: 3, reps: '20', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      {
        id: 'gen-fb-p2',
        name: 'Progression',
        description: 'Augmentation du volume et de la charge',
        phaseOrder: 2,
        weekStart: 5,
        weekEnd: 8,
        intensity: 'moderate',
        sessions: [],
      },
    ],
  },
];

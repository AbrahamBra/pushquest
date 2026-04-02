import type { Program } from './types';

/**
 * Curated training programs for PushQuest.
 * All exercises reference IDs from free-exercise-db (validated).
 * Every phase has complete session data — no empty phases.
 */
export const PROGRAMS: Program[] = [

  // ═══════════════════════════════════════════════════════════
  // 1. HYPERTROPHY - PPL 6j - Intermediate (12 weeks)
  //    Based on: Outlift PPL, Muscle & Strength powerbuilding
  //    ~15-18 sets per muscle group per week
  // ═══════════════════════════════════════════════════════════
  {
    id: 'hypertrophy-ppl-intermediate',
    name: 'Le Forgeron',
    description: 'Programme PPL pour la prise de masse. 6 jours/semaine, chaque muscle travaille 2x. Periodise sur 12 semaines avec deload.',
    goal: 'hypertrophy',
    level: 'intermediate',
    durationWeeks: 12,
    daysPerWeek: 6,
    split: 'ppl',
    equipmentNeeded: ['barbell', 'dumbbell', 'cable', 'machine'],
    isFree: true,
    phases: [
      // ── Phase 1: Accumulation (sem 1-4) RPE 7 ──
      {
        id: 'hyp-ppl-p1',
        name: 'Accumulation',
        description: 'Volume progressif, RPE 7, maitrise technique',
        phaseOrder: 1, weekStart: 1, weekEnd: 4, intensity: 'moderate',
        sessions: [
          {
            id: 'hyp-p1-push-a', name: 'Push A (Pectoraux)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 90,
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
            id: 'hyp-p1-pull-a', name: 'Pull A (Epaisseur)', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 1, sets: 1, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '1x5 — pas a failure', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 4, reps: '6-8', restSecs: 120, rpe: 7, tempo: '2-0-1-1', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Seated_Cable_Rows', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 45, rpe: 7, tempo: '2-2-1-0', notes: 'Rotation externe en haut', progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Curl', exerciseOrder: 5, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Hammer_Curls', exerciseOrder: 6, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p1-legs-a', name: 'Legs A (Quadriceps)', dayOfWeek: 3, sessionOrder: 3, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 180, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Lunge', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 90, rpe: 7, tempo: null, notes: 'Par jambe', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Press', exerciseOrder: 3, sets: 3, reps: '10-15', restSecs: 90, rpe: 8, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Extensions', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 60, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 5, sets: 4, reps: '12-15', restSecs: 60, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p1-push-b', name: 'Push B (Epaules)', dayOfWeek: 4, sessionOrder: 4, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 120, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Bench_Press', exerciseOrder: 2, sets: 3, reps: '8-12', restSecs: 90, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 3, sets: 4, reps: '15-20', restSecs: 45, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Cable_Crossover', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Lying_Triceps_Press', exerciseOrder: 5, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Cable_Rope_Overhead_Triceps_Extension', exerciseOrder: 6, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p1-pull-b', name: 'Pull B (Largeur)', dayOfWeek: 5, sessionOrder: 5, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseOrder: 1, sets: 4, reps: '8-12', restSecs: 90, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 3, reps: '6-10', restSecs: 90, rpe: 7, tempo: null, notes: 'Lest si +10 reps', progressionRule: 'add_reps' },
              { exerciseId: 'Straight-Arm_Pulldown', exerciseOrder: 3, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 45, rpe: 7, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Incline_Dumbbell_Curl', exerciseOrder: 5, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Concentration_Curls', exerciseOrder: 6, sets: 2, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p1-legs-b', name: 'Legs B (Ischios-Fessiers)', dayOfWeek: 6, sessionOrder: 6, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 1, sets: 4, reps: '8-10', restSecs: 120, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Hip_Thrust', exerciseOrder: 2, sets: 4, reps: '8-12', restSecs: 90, rpe: 7, tempo: '2-2-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Lying_Leg_Curls', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: '2-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Goblet_Squat', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '3-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Seated_Calf_Raise', exerciseOrder: 5, sets: 4, reps: '15-20', restSecs: 45, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      // ── Phase 2: Intensification (sem 5-8) RPE 8 ──
      {
        id: 'hyp-ppl-p2',
        name: 'Intensification',
        description: 'Charges augmentees, reps plus basses, RPE 8',
        phaseOrder: 2, weekStart: 5, weekEnd: 8, intensity: 'high',
        sessions: [
          {
            id: 'hyp-p2-push-a', name: 'Push A (Pectoraux)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 150, rpe: 8, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Incline_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 4, reps: '6-10', restSecs: 120, rpe: 8, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Flyes', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: '3-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 4, sets: 3, reps: '6-8', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 5, sets: 4, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Lying_Triceps_Press', exerciseOrder: 6, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
            ],
          },
          {
            id: 'hyp-p2-pull-a', name: 'Pull A (Epaisseur)', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 1, sets: 1, reps: '3-5', restSecs: 240, rpe: 8, tempo: null, notes: '1x3-5 lourd', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 4, reps: '5-7', restSecs: 150, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Seated_Cable_Rows', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 90, rpe: 8, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Curl', exerciseOrder: 5, sets: 3, reps: '6-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Hammer_Curls', exerciseOrder: 6, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p2-legs-a', name: 'Legs A (Quadriceps)', dayOfWeek: 3, sessionOrder: 3, restBetweenExercisesSecs: 150,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 4, reps: '4-6', restSecs: 240, rpe: 8, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Hack_Squat', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Extensions', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: '2-1-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Lunge', exerciseOrder: 4, sets: 3, reps: '8-10', restSecs: 90, rpe: 8, tempo: null, notes: 'Par jambe', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 5, sets: 4, reps: '10-12', restSecs: 60, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p2-push-b', name: 'Push B (Epaules)', dayOfWeek: 4, sessionOrder: 4, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 3, reps: '6-8', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 3, sets: 4, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Cable_Crossover', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dips_-_Triceps_Version', exerciseOrder: 5, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: 'Lest si +12 reps', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Cable_Rope_Overhead_Triceps_Extension', exerciseOrder: 6, sets: 3, reps: '10-12', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p2-pull-b', name: 'Pull B (Largeur)', dayOfWeek: 5, sessionOrder: 5, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Pullups', exerciseOrder: 1, sets: 4, reps: '5-8', restSecs: 120, rpe: 8, tempo: null, notes: 'Lest si +8 reps', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'V-Bar_Pulldown', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 90, rpe: 8, tempo: '2-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Straight-Arm_Pulldown', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Reverse_Flyes', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Preacher_Curl', exerciseOrder: 5, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: '3-0-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Incline_Dumbbell_Curl', exerciseOrder: 6, sets: 2, reps: '10-12', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p2-legs-b', name: 'Legs B (Ischios-Fessiers)', dayOfWeek: 6, sessionOrder: 6, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Stiff-Legged_Barbell_Deadlift', exerciseOrder: 1, sets: 4, reps: '6-8', restSecs: 150, rpe: 8, tempo: '3-1-2-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Hip_Thrust', exerciseOrder: 2, sets: 4, reps: '6-10', restSecs: 120, rpe: 8, tempo: '2-2-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Lying_Leg_Curls', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Step_Ups', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 90, rpe: 8, tempo: null, notes: 'Par jambe', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Seated_Calf_Raise', exerciseOrder: 5, sets: 4, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      // ── Phase 3: Peak + Deload (sem 9-12) ──
      {
        id: 'hyp-ppl-p3',
        name: 'Peak + Deload',
        description: 'Sem 9-11 intensite max RPE 9, sem 12 deload a 60% volume',
        phaseOrder: 3, weekStart: 9, weekEnd: 12, intensity: 'max',
        sessions: [
          {
            id: 'hyp-p3-push-a', name: 'Push A (Peak)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 5, reps: '4-6', restSecs: 180, rpe: 9, tempo: null, notes: 'Sem 12: 3x8 a 60%', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Incline_Dumbbell_Press', exerciseOrder: 2, sets: 3, reps: '6-8', restSecs: 120, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 3, sets: 3, reps: '6-8', restSecs: 120, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dips_-_Triceps_Version', exerciseOrder: 5, sets: 3, reps: '6-8', restSecs: 90, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
            ],
          },
          {
            id: 'hyp-p3-pull-a', name: 'Pull A (Peak)', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 1, sets: 1, reps: '3', restSecs: 300, rpe: 9, tempo: null, notes: 'Sem 12: 1x5 a 60%', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 4, reps: '4-6', restSecs: 150, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Wide-Grip_Lat_Pulldown', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 90, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15-20', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Barbell_Curl', exerciseOrder: 5, sets: 3, reps: '6-8', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
            ],
          },
          {
            id: 'hyp-p3-legs-a', name: 'Legs A (Peak)', dayOfWeek: 3, sessionOrder: 3, restBetweenExercisesSecs: 150,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '3-5', restSecs: 240, rpe: 9, tempo: null, notes: 'Sem 12: 3x8 a 60%', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Press', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Leg_Extensions', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p3-push-b', name: 'Push B (Peak)', dayOfWeek: 4, sessionOrder: 4, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 1, sets: 4, reps: '4-6', restSecs: 180, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Bench_Press', exerciseOrder: 2, sets: 3, reps: '6-8', restSecs: 120, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Cable_Crossover', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Lying_Triceps_Press', exerciseOrder: 4, sets: 3, reps: '6-8', restSecs: 90, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
            ],
          },
          {
            id: 'hyp-p3-pull-b', name: 'Pull B (Peak)', dayOfWeek: 5, sessionOrder: 5, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Pullups', exerciseOrder: 1, sets: 4, reps: '4-6', restSecs: 120, rpe: 9, tempo: null, notes: 'Leste', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'V-Bar_Pulldown', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 90, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Reverse_Flyes', exerciseOrder: 3, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Concentration_Curls', exerciseOrder: 4, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'hyp-p3-legs-b', name: 'Legs B (Peak)', dayOfWeek: 6, sessionOrder: 6, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 1, sets: 4, reps: '5-7', restSecs: 150, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Barbell_Hip_Thrust', exerciseOrder: 2, sets: 3, reps: '6-8', restSecs: 120, rpe: 9, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Lying_Leg_Curls', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Seated_Calf_Raise', exerciseOrder: 4, sets: 3, reps: '12-15', restSecs: 45, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 2. STRENGTH - 5x5 - Beginner (12 weeks)
  //    Based on: StrongLifts 5x5, Bill Starr's program
  //    A/B alternance: sem impaire ABA, sem paire BAB
  // ═══════════════════════════════════════════════════════════
  {
    id: 'strength-5x5-beginner',
    name: 'Les Fondations',
    description: 'Programme force 5x5 pour debutants. 3 jours/semaine, progression lineaire +2.5kg/seance. Alterne Workout A et B.',
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
        description: 'Maitrise technique, charges legeres, +2.5kg/seance',
        phaseOrder: 1, weekStart: 1, weekEnd: 4, intensity: 'moderate',
        sessions: [
          {
            id: 'str-p1-a', name: 'Workout A', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '+2.5kg/seance', progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '+2.5kg/seance', progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 3, sets: 1, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '1x5 — +5kg/seance', progressionRule: 'add_weight_every_session' },
            ],
          },
          {
            id: 'str-p1-b', name: 'Workout B', dayOfWeek: 3, sessionOrder: 2, restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '+2.5kg/seance', progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '+2.5kg/seance', progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 3, sets: 5, reps: '5', restSecs: 180, rpe: 7, tempo: null, notes: '+2.5kg/seance', progressionRule: 'add_weight_every_session' },
            ],
          },
        ],
      },
      {
        id: 'str-5x5-p2',
        name: 'Progression lineaire',
        description: 'Augmentation reguliere des charges. Si echec 3x: deload -10%',
        phaseOrder: 2, weekStart: 5, weekEnd: 10, intensity: 'high',
        sessions: [
          {
            id: 'str-p2-a', name: 'Workout A', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 300,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: 'Repos 5min si besoin', progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 3, sets: 1, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: '1x5 lourd', progressionRule: 'add_weight_every_session' },
            ],
          },
          {
            id: 'str-p2-b', name: 'Workout B', dayOfWeek: 3, sessionOrder: 2, restBetweenExercisesSecs: 300,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 5, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 2, sets: 5, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 3, sets: 5, reps: '5', restSecs: 300, rpe: 8, tempo: null, notes: null, progressionRule: 'add_weight_every_session' },
            ],
          },
        ],
      },
      {
        id: 'str-5x5-p3',
        name: 'Deload + Test',
        description: 'Sem 11 deload -40%, sem 12 test de max',
        phaseOrder: 3, weekStart: 11, weekEnd: 12, intensity: 'light',
        sessions: [
          {
            id: 'str-p3-a', name: 'Workout A (Deload/Test)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 3, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: 'Sem 11: 60% charge. Sem 12: monte progressivement vers max', progressionRule: null },
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 2, sets: 3, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: 'Idem', progressionRule: null },
              { exerciseId: 'Barbell_Deadlift', exerciseOrder: 3, sets: 1, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: 'Idem', progressionRule: null },
            ],
          },
          {
            id: 'str-p3-b', name: 'Workout B (Deload/Test)', dayOfWeek: 3, sessionOrder: 2, restBetweenExercisesSecs: 180,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 3, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Barbell_Shoulder_Press', exerciseOrder: 2, sets: 3, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 3, sets: 3, reps: '5', restSecs: 180, rpe: 6, tempo: null, notes: null, progressionRule: null },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 3. BODYWEIGHT / ENDURANCE - Upper/Lower 4j (8 weeks)
  //    Progression par reps et variantes de difficulte
  //    Phase 2: circuits pour endurance metabolique
  // ═══════════════════════════════════════════════════════════
  {
    id: 'endurance-bodyweight-beginner',
    name: 'Le Guerrier Sans Armes',
    description: 'Programme poids du corps pour debutants. Aucun materiel. Evolue vers des circuits d\'endurance en phase 2.',
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
        name: 'Fondations',
        description: 'Apprentissage des mouvements, straight sets, RPE 6-7',
        phaseOrder: 1, weekStart: 1, weekEnd: 4, intensity: 'light',
        sessions: [
          {
            id: 'end-p1-upper-a', name: 'Haut du corps A', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: '2-1-2-0', notes: 'Sur genoux si besoin', progressionRule: 'add_reps' },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 90, rpe: 7, tempo: null, notes: 'Negatifs si impossible', progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Dips', exerciseOrder: 3, sets: 3, reps: '10-15', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Plank', exerciseOrder: 4, sets: 3, reps: '30s', restSecs: 30, rpe: 6, tempo: null, notes: 'Tenir 30s, progresser vers 60s', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p1-lower-a', name: 'Bas du corps + Core A', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 3, reps: '15-20', restSecs: 60, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Flutter_Kicks', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 5, sets: 3, reps: '12-15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p1-upper-b', name: 'Haut du corps B', dayOfWeek: 4, sessionOrder: 3, restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Close-Grip_Push-Up_off_of_a_Dumbbell', exerciseOrder: 1, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: null, notes: 'Au sol, prise serree', progressionRule: 'add_reps' },
              { exerciseId: 'Pullups', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Body_Tricep_Press', exerciseOrder: 3, sets: 3, reps: '8-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Air_Bike', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p1-lower-b', name: 'Bas du corps + Core B', dayOfWeek: 5, sessionOrder: 4, restBetweenExercisesSecs: 60,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 4, reps: '20', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
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
        name: 'Circuits Endurance',
        description: 'Format circuit — enchainer les exercices avec repos minimal. 3 tours par circuit.',
        phaseOrder: 2, weekStart: 5, weekEnd: 8, intensity: 'moderate',
        sessions: [
          {
            id: 'end-p2-upper', name: 'Circuit Haut du corps', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 15,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 3, reps: '15', restSecs: 15, rpe: 8, tempo: null, notes: 'CIRCUIT: enchainer 1-5, repos 90s entre tours', progressionRule: 'add_reps' },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 3, reps: '8', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Dips', exerciseOrder: 3, sets: 3, reps: '15', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Mountain_Climbers', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Plank', exerciseOrder: 5, sets: 3, reps: '45s', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit complet', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p2-lower', name: 'Circuit Bas du corps', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 15,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 3, reps: '15', restSecs: 15, rpe: 8, tempo: null, notes: 'CIRCUIT: enchainer 1-5, repos 90s entre tours', progressionRule: 'add_reps' },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 3, reps: '20', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 3, sets: 3, reps: '20', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Flutter_Kicks', exerciseOrder: 4, sets: 3, reps: '30', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 5, sets: 3, reps: '15', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit complet', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p2-upper-b', name: 'Circuit Haut du corps B', dayOfWeek: 4, sessionOrder: 3, restBetweenExercisesSecs: 15,
            exercises: [
              { exerciseId: 'Close-Grip_Push-Up_off_of_a_Dumbbell', exerciseOrder: 1, sets: 3, reps: '12', restSecs: 15, rpe: 8, tempo: null, notes: 'CIRCUIT', progressionRule: 'add_reps' },
              { exerciseId: 'Pullups', exerciseOrder: 2, sets: 3, reps: '6', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Body_Tricep_Press', exerciseOrder: 3, sets: 3, reps: '12', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Air_Bike', exerciseOrder: 4, sets: 3, reps: '25', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dead_Bug', exerciseOrder: 5, sets: 3, reps: '12', restSecs: 90, rpe: 7, tempo: null, notes: '90s repos entre tours', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'end-p2-lower-b', name: 'Circuit Bas du corps B', dayOfWeek: 5, sessionOrder: 4, restBetweenExercisesSecs: 15,
            exercises: [
              { exerciseId: 'Bench_Jump', exerciseOrder: 1, sets: 3, reps: '12', restSecs: 15, rpe: 8, tempo: null, notes: 'CIRCUIT', progressionRule: 'add_reps' },
              { exerciseId: 'Glute_Kickback', exerciseOrder: 2, sets: 3, reps: '15', restSecs: 15, rpe: 8, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 3, sets: 3, reps: '25', restSecs: 15, rpe: 8, tempo: null, notes: 'Tempo lent', progressionRule: 'add_reps' },
              { exerciseId: 'Bent-Knee_Hip_Raise', exerciseOrder: 4, sets: 3, reps: '20', restSecs: 15, rpe: 8, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Alternate_Heel_Touchers', exerciseOrder: 5, sets: 3, reps: '25', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos entre tours', progressionRule: 'add_reps' },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 4. SECHE / CUT - Upper/Lower 4j (8 weeks)
  //    Based on: Fitbod, BarBend cutting guidelines
  //    Force maintenue + metcon pour deficit calorique
  // ═══════════════════════════════════════════════════════════
  {
    id: 'cut-upper-lower-intermediate',
    name: 'La Forge Ardente',
    description: 'Programme de seche : maintien de la force avec deficit calorique. Jours force + jours metcon. Reduire le volume si fatigue.',
    goal: 'cut',
    level: 'intermediate',
    durationWeeks: 8,
    daysPerWeek: 4,
    split: 'upper_lower',
    equipmentNeeded: ['barbell', 'dumbbell', 'cable'],
    isFree: false,
    phases: [
      {
        id: 'cut-p1',
        name: 'Conservation',
        description: 'Maintien des charges, volume a 80% du bulk',
        phaseOrder: 1, weekStart: 1, weekEnd: 4, intensity: 'moderate',
        sessions: [
          {
            id: 'cut-p1-upper-f', name: 'Upper Body (Force)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 4, reps: '5-6', restSecs: 150, rpe: 8, tempo: null, notes: 'Maintenir les charges', progressionRule: null },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 4, reps: '5-6', restSecs: 150, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 3, sets: 3, reps: '8-10', restSecs: 90, rpe: 7, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-p1-lower-f', name: 'Lower Body (Force)', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 120,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 4, reps: '5-6', restSecs: 180, rpe: 8, tempo: null, notes: 'Maintenir les charges', progressionRule: null },
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 2, sets: 3, reps: '8-10', restSecs: 90, rpe: 7, tempo: '3-0-2-0', notes: null, progressionRule: null },
              { exerciseId: 'Barbell_Lunge', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 90, rpe: 7, tempo: null, notes: 'Par jambe', progressionRule: null },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-p1-upper-m', name: 'Upper Body (Metcon)', dayOfWeek: 4, sessionOrder: 3, restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: 'Circuit : enchainer 1-4, repos 90s', progressionRule: null },
              { exerciseId: 'Chin-Up', exerciseOrder: 2, sets: 4, reps: '8', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Side_Lateral_Raise', exerciseOrder: 3, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Dips_-_Triceps_Version', exerciseOrder: 4, sets: 4, reps: '10', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit', progressionRule: null },
            ],
          },
          {
            id: 'cut-p1-lower-m', name: 'Lower Body (Metcon)', dayOfWeek: 5, sessionOrder: 4, restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 4, reps: '15', restSecs: 30, rpe: 8, tempo: null, notes: 'Circuit : enchainer 1-4, repos 90s', progressionRule: null },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 4, reps: '20', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 3, sets: 4, reps: '20', restSecs: 30, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 4, sets: 4, reps: '15', restSecs: 90, rpe: 8, tempo: null, notes: '90s repos apres le circuit', progressionRule: null },
            ],
          },
        ],
      },
      {
        id: 'cut-p2',
        name: 'Finition',
        description: 'Volume reduit a 60%. Supprimer 1 set par exercice si fatigue excessive.',
        phaseOrder: 2, weekStart: 5, weekEnd: 8, intensity: 'high',
        sessions: [
          {
            id: 'cut-p2-upper-f', name: 'Upper Body (Force)', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 150,
            exercises: [
              { exerciseId: 'Barbell_Bench_Press_-_Medium_Grip', exerciseOrder: 1, sets: 3, reps: '4-6', restSecs: 180, rpe: 9, tempo: null, notes: 'Garder les charges coute que coute', progressionRule: null },
              { exerciseId: 'Bent_Over_Barbell_Row', exerciseOrder: 2, sets: 3, reps: '4-6', restSecs: 180, rpe: 9, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 3, sets: 2, reps: '8-10', restSecs: 90, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Face_Pull', exerciseOrder: 4, sets: 2, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-p2-lower-f', name: 'Lower Body (Force)', dayOfWeek: 2, sessionOrder: 2, restBetweenExercisesSecs: 150,
            exercises: [
              { exerciseId: 'Barbell_Squat', exerciseOrder: 1, sets: 3, reps: '4-6', restSecs: 240, rpe: 9, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Romanian_Deadlift', exerciseOrder: 2, sets: 3, reps: '6-8', restSecs: 120, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Lying_Leg_Curls', exerciseOrder: 3, sets: 2, reps: '10-12', restSecs: 60, rpe: 8, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Standing_Calf_Raises', exerciseOrder: 4, sets: 2, reps: '12', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: null },
            ],
          },
          {
            id: 'cut-p2-upper-m', name: 'Upper (Metcon leger)', dayOfWeek: 4, sessionOrder: 3, restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Pushups', exerciseOrder: 1, sets: 3, reps: '12', restSecs: 30, rpe: 7, tempo: null, notes: 'Circuit 3 tours', progressionRule: null },
              { exerciseId: 'Pullups', exerciseOrder: 2, sets: 3, reps: '6', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Bench_Dips', exerciseOrder: 3, sets: 3, reps: '12', restSecs: 90, rpe: 7, tempo: null, notes: '90s entre tours', progressionRule: null },
            ],
          },
          {
            id: 'cut-p2-lower-m', name: 'Lower (Metcon leger)', dayOfWeek: 5, sessionOrder: 4, restBetweenExercisesSecs: 30,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: 'Circuit 3 tours', progressionRule: null },
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 2, sets: 3, reps: '15', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: null },
              { exerciseId: 'Mountain_Climbers', exerciseOrder: 3, sets: 3, reps: '20', restSecs: 90, rpe: 7, tempo: null, notes: '90s entre tours', progressionRule: null },
            ],
          },
        ],
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════
  // 5. GENERAL / REMISE EN FORME - Full Body 3j (8 weeks)
  // ═══════════════════════════════════════════════════════════
  {
    id: 'general-fullbody-beginner',
    name: 'Le Reveil du Heros',
    description: 'Programme de remise en forme. 3 jours full body, parfait pour reprendre le sport. Phase 2 augmente le volume.',
    goal: 'general',
    level: 'beginner',
    durationWeeks: 8,
    daysPerWeek: 3,
    split: 'full_body',
    equipmentNeeded: ['dumbbell', 'body only'],
    isFree: true,
    phases: [
      {
        id: 'gen-p1',
        name: 'Adaptation',
        description: 'Reactivation musculaire, charges legeres, RPE 6',
        phaseOrder: 1, weekStart: 1, weekEnd: 4, intensity: 'light',
        sessions: [
          {
            id: 'gen-p1-day1', name: 'Full Body A', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 3, reps: '12-15', restSecs: 60, rpe: 6, tempo: '3-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Pushups', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 6, tempo: null, notes: 'Sur genoux au debut', progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Lunges', exerciseOrder: 3, sets: 3, reps: '10', restSecs: 60, rpe: 6, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: '2-1-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Plank', exerciseOrder: 5, sets: 2, reps: '30s', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-p1-day2', name: 'Full Body B', dayOfWeek: 3, sessionOrder: 2, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 1, sets: 3, reps: '15', restSecs: 45, rpe: 6, tempo: '2-2-1-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 3, sets: 3, reps: '15-20', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Bicep_Curl', exerciseOrder: 4, sets: 2, reps: '12', restSecs: 45, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Air_Bike', exerciseOrder: 5, sets: 3, reps: '15', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-p1-day3', name: 'Full Body C', dayOfWeek: 5, sessionOrder: 3, restBetweenExercisesSecs: 90,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 3, reps: '10', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bench_Dips', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 6, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Glute_Kickback', exerciseOrder: 4, sets: 3, reps: '12', restSecs: 45, rpe: 6, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Alternate_Heel_Touchers', exerciseOrder: 5, sets: 3, reps: '20', restSecs: 30, rpe: 6, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
      {
        id: 'gen-p2',
        name: 'Progression',
        description: 'Volume augmente, charges progressives, RPE 7',
        phaseOrder: 2, weekStart: 5, weekEnd: 8, intensity: 'moderate',
        sessions: [
          {
            id: 'gen-p2-day1', name: 'Full Body A+', dayOfWeek: 1, sessionOrder: 1, restBetweenExercisesSecs: 75,
            exercises: [
              { exerciseId: 'Bodyweight_Squat', exerciseOrder: 1, sets: 4, reps: '15-20', restSecs: 60, rpe: 7, tempo: '3-1-2-0', notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Pushups', exerciseOrder: 2, sets: 4, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Lunges', exerciseOrder: 3, sets: 3, reps: '12', restSecs: 60, rpe: 7, tempo: null, notes: 'Par jambe, augmenter poids', progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseOrder: 4, sets: 4, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Shoulder_Press', exerciseOrder: 5, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Plank', exerciseOrder: 6, sets: 3, reps: '45s', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-p2-day2', name: 'Full Body B+', dayOfWeek: 3, sessionOrder: 2, restBetweenExercisesSecs: 75,
            exercises: [
              { exerciseId: 'Butt_Lift_Bridge', exerciseOrder: 1, sets: 4, reps: '20', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dumbbell_Bench_Press', exerciseOrder: 2, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Goblet_Squat', exerciseOrder: 3, sets: 3, reps: '12-15', restSecs: 60, rpe: 7, tempo: '3-1-1-0', notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Dumbbell_Bicep_Curl', exerciseOrder: 4, sets: 3, reps: '10-12', restSecs: 45, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Flutter_Kicks', exerciseOrder: 5, sets: 3, reps: '20', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Dead_Bug', exerciseOrder: 6, sets: 3, reps: '10', restSecs: 30, rpe: 6, tempo: null, notes: 'Par cote', progressionRule: 'add_reps' },
            ],
          },
          {
            id: 'gen-p2-day3', name: 'Full Body C+', dayOfWeek: 5, sessionOrder: 3, restBetweenExercisesSecs: 75,
            exercises: [
              { exerciseId: 'Freehand_Jump_Squat', exerciseOrder: 1, sets: 4, reps: '12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Close-Grip_Push-Up_off_of_a_Dumbbell', exerciseOrder: 2, sets: 3, reps: 'AMRAP', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Bent_Over_Two-Dumbbell_Row', exerciseOrder: 3, sets: 3, reps: '10-12', restSecs: 60, rpe: 7, tempo: null, notes: null, progressionRule: 'add_weight_when_top_reps' },
              { exerciseId: 'Glute_Kickback', exerciseOrder: 4, sets: 3, reps: '15', restSecs: 45, rpe: 7, tempo: null, notes: 'Par jambe', progressionRule: 'add_reps' },
              { exerciseId: 'Bottoms_Up', exerciseOrder: 5, sets: 3, reps: '15', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
              { exerciseId: 'Alternate_Heel_Touchers', exerciseOrder: 6, sets: 3, reps: '25', restSecs: 30, rpe: 7, tempo: null, notes: null, progressionRule: 'add_reps' },
            ],
          },
        ],
      },
    ],
  },
];

<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { initDetector, detectPose, isDetectorReady } from '$lib/ai/pose-detector';
  import { createExerciseDetector, type ExerciseDetector } from '$lib/ai/exercise-detector';
  import { EXERCISES } from '$lib/ai/exercises.config';
  import { playSound, preloadSounds } from '$lib/game/audio';
  import { recommendProgram, GOAL_INFO } from '$lib/data/program-service';
  import { EQUIPMENT_CATEGORIES, type ProgramGoal, type EquipmentCategory } from '$lib/data/types';
  import type { Program } from '$lib/data/types';
  import { setActiveProgram, setUserProfile } from '$lib/utils/session-storage';
  import { computeStartingWeights, saveStartingWeights, type ExperienceLevel } from '$lib/game/starting-weights';
  import Stars from '$lib/components/Stars.svelte';
  import ProgramCard from '$lib/components/ProgramCard.svelte';

  // Step management (0-8)
  let step = $state(0);
  const totalSteps = 9;
  const stepLabels = ['Sante', 'Camera', 'Pose', 'Reps', 'Objectif', 'Frequence', 'Equipement', 'Experience', 'Programme'];

  // Camera state
  let videoEl: HTMLVideoElement | undefined = $state();
  let canvasEl: HTMLCanvasElement | undefined = $state();
  let cameraStream: MediaStream | null = $state(null);
  let cameraError = $state('');
  let bodyDetected = $state(false);

  // Test reps state
  let testReps = $state(0);
  let exerciseDetector: ExerciseDetector | null = $state(null);
  let animHandle = 0;
  let detectionActive = false;

  // Model loading
  let modelLoading = $state(false);
  let modelReady = $state(false);

  // New: Profile choices
  let selectedGoal = $state<ProgramGoal | null>(null);
  let selectedDays = $state(3);
  let selectedEquipment = $state<EquipmentCategory>('full_gym');
  let selectedExperience = $state<ExperienceLevel>('sometimes');

  const experienceLevels: { id: ExperienceLevel; label: string; desc: string; emoji: string }[] = [
    { id: 'never', label: 'Debutant complet', desc: 'Je n\'ai jamais touche une barre', emoji: '🌱' },
    { id: 'sometimes', label: 'Quelques bases', desc: 'J\'ai deja fait de la muscu quelques fois', emoji: '💪' },
    { id: 'regular', label: 'Regulier', desc: 'Je m\'entraine regulierement depuis 6+ mois', emoji: '🔥' },
    { id: 'advanced', label: 'Avance', desc: 'Plus de 2 ans d\'entrainement serieux', emoji: '⚡' },
  ];

  // Derived: recommended program
  const recommended = $derived<Program | undefined>(
    selectedGoal
      ? recommendProgram({
          goal: selectedGoal,
          daysPerWeek: selectedDays,
          equipment: selectedEquipment,
          experience: 'beginner',
        })
      : undefined
  );

  const goals = Object.entries(GOAL_INFO) as [ProgramGoal, typeof GOAL_INFO[ProgramGoal]][];
  const dayOptions = [2, 3, 4, 5, 6];

  const equipmentLabels: Record<EquipmentCategory, { label: string; items: string }> = {
    bodyweight: { label: 'Poids du corps', items: 'Aucun materiel' },
    minimal: { label: 'Minimal', items: 'Bandes, halteres, kettlebells' },
    home_gym: { label: 'Home Gym', items: '+ Barre, ballon' },
    full_gym: { label: 'Salle complete', items: '+ Cables, machines, EZ bar' },
  };

  function nextStep(): void {
    if (step < totalSteps - 1) step++;
  }

  async function requestCamera(): Promise<void> {
    cameraError = '';
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
      });
      cameraStream = stream;
      step = 2;
    } catch {
      cameraError = 'Acces camera refuse. Active la camera et reessaie.';
    }
  }

  // Background model warm-up from step 1
  $effect(() => {
    if (step >= 1 && !modelReady && !modelLoading) {
      modelLoading = true;
      initDetector().then(() => {
        modelReady = true;
        modelLoading = false;
      }).catch(() => { modelLoading = false; });
    }
  });

  // Camera feed on pose check
  $effect(() => {
    if (step === 2 && videoEl && cameraStream) {
      videoEl.srcObject = cameraStream;
      videoEl.play().catch(() => {});
    }
  });

  // Detection loop for pose check and test reps
  $effect(() => {
    if ((step === 2 || step === 3) && videoEl && modelReady) {
      detectionActive = true;

      if (step === 3 && !exerciseDetector) {
        exerciseDetector = createExerciseDetector(EXERCISES['pushup']!);
      }

      function loop(): void {
        if (!detectionActive || !videoEl) return;

        detectPose(videoEl).then((keypoints) => {
          if (!detectionActive) return;
          if (step === 2) {
            const goodKps = keypoints.filter((k) => k.score > 0.3);
            bodyDetected = goodKps.length >= 5;
          }
          if (step === 3 && exerciseDetector && keypoints.length > 0) {
            const prevReps = exerciseDetector.getReps();
            exerciseDetector.processFrame(keypoints);
            testReps = exerciseDetector.getReps();
            if (testReps > prevReps) playSound('rep');
          }
        }).catch(() => {});

        // Draw mirrored camera to canvas
        if (canvasEl && videoEl && videoEl.readyState >= 2) {
          const ctx = canvasEl.getContext('2d');
          if (ctx) {
            if (canvasEl.width !== canvasEl.offsetWidth) canvasEl.width = canvasEl.offsetWidth;
            if (canvasEl.height !== canvasEl.offsetHeight) canvasEl.height = canvasEl.offsetHeight;
            const W = canvasEl.width, H = canvasEl.height;
            ctx.save(); ctx.translate(W, 0); ctx.scale(-1, 1);
            const vw = videoEl.videoWidth || W, vh = videoEl.videoHeight || H;
            const scale = Math.max(W / vw, H / vh);
            const dw = vw * scale, dh = vh * scale;
            ctx.drawImage(videoEl, (W - dw) / 2, (H - dh) / 2, dw, dh);
            ctx.restore();
          }
        }
        animHandle = requestAnimationFrame(loop);
      }
      loop();
      return () => { detectionActive = false; cancelAnimationFrame(animHandle); };
    }
  });

  function stopCamera(): void {
    if (cameraStream) {
      cameraStream.getTracks().forEach((t) => t.stop());
      cameraStream = null;
    }
    detectionActive = false;
    cancelAnimationFrame(animHandle);
  }

  function skipToProfile(): void {
    stopCamera();
    step = 4; // Jump to goal selection
  }

  function finishOnboarding(): void {
    localStorage.setItem('pushquest_onboarded', 'true');
    stopCamera();

    // Save profile
    if (selectedGoal) {
      setUserProfile({
        goal: selectedGoal,
        daysPerWeek: selectedDays,
        equipment: selectedEquipment,
        createdAt: new Date().toISOString(),
      });
    }

    // Save starting weights based on experience
    const weights = computeStartingWeights(selectedExperience);
    saveStartingWeights(weights);

    // Save active program if recommended
    if (recommended) {
      setActiveProgram({
        programId: recommended.id,
        currentPhaseIdx: 0,
        currentWeek: 1,
        nextSessionIdx: 0,
        startedAt: new Date().toISOString(),
      });
    }

    goto('/');
  }

  function finishWithoutProgram(): void {
    localStorage.setItem('pushquest_onboarded', 'true');
    stopCamera();
    if (selectedGoal) {
      setUserProfile({
        goal: selectedGoal,
        daysPerWeek: selectedDays,
        equipment: selectedEquipment,
        createdAt: new Date().toISOString(),
      });
    }
    goto('/programs');
  }

  onMount(() => {
    preloadSounds();
    if (localStorage.getItem('pushquest_onboarded')) { goto('/'); return; }
    return () => { stopCamera(); };
  });
</script>

<Stars />

<div class="relative z-10 flex flex-col items-center min-h-screen px-6 pt-12 pb-10 max-w-[420px] mx-auto">
  <!-- Progress dots -->
  <div class="flex gap-2 mb-8">
    {#each stepLabels as label, i}
      <div class="w-2 h-2 rounded-full transition-all {i === step ? 'bg-primary scale-125 dot-active' : i < step ? 'bg-primary/50' : 'bg-white/15'}"
        title={label}></div>
    {/each}
  </div>

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 0: Avertissement sante                -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 0}
    <div class="flex flex-col items-center text-center gap-6 animate-fade-in">
      <div class="text-4xl mb-2">⚠️</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Avertissement Sante</h1>
      <div class="backdrop-blur-sm bg-surface/80 border border-white/10 rounded-[14px] p-5 text-sm text-dim leading-relaxed">
        <p>PushQuest est un outil de suivi d'exercice gamifie, pas un avis medical.</p>
        <p class="mt-3">Consulte un medecin avant de commencer tout programme d'exercice. Arrete immediatement en cas de douleur, vertiges ou essoufflement.</p>
        <p class="mt-3">En continuant, tu reconnais t'exercer a tes propres risques.</p>
      </div>
      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={nextStep}
      >
        J'AI COMPRIS
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 1: Configuration camera               -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 1}
    <div class="flex flex-col items-center text-center gap-6 animate-fade-in">
      <div class="text-4xl mb-2">📷</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Configuration Camera</h1>
      <div class="bg-surface rounded-[14px] p-5 w-full">
        <div class="flex flex-col gap-4 text-sm text-left">
          <div class="flex items-start gap-3">
            <span class="text-primary font-black text-lg leading-none mt-0.5">1</span>
            <span class="text-dim">Place ton telephone <strong class="text-white">a 1-2 metres</strong>, legerement sureleve</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-primary font-black text-lg leading-none mt-0.5">2</span>
            <span class="text-dim">On doit voir ton <strong class="text-white">corps entier</strong> dans le cadre</span>
          </div>
          <div class="flex items-start gap-3">
            <span class="text-primary font-black text-lg leading-none mt-0.5">3</span>
            <span class="text-dim">Un bon eclairage aide l'IA a <strong class="text-white">suivre tes mouvements</strong></span>
          </div>
        </div>
      </div>
      {#if cameraError}
        <p class="text-primary text-sm">{cameraError}</p>
      {/if}
      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={requestCamera}
      >
        ACTIVER LA CAMERA
      </button>
      <button class="text-xs text-dim tracking-[2px] hover:text-white/60 transition-colors" onclick={skipToProfile}>
        PASSER LA CAMERA
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 2: Detection du corps                 -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 2}
    <div class="flex flex-col items-center text-center gap-4 w-full animate-fade-in">
      <h1 class="text-xl font-black uppercase tracking-[3px]">Detection du corps</h1>
      <p class="text-sm text-dim">Tiens-toi dans le cadre pour que l'IA te detecte</p>

      <div class="relative w-full aspect-[3/4] bg-black rounded-[14px] overflow-hidden">
        <video bind:this={videoEl} class="hidden" autoplay playsinline muted></video>
        <canvas bind:this={canvasEl} class="w-full h-full"></canvas>
        <div class="absolute top-3 left-1/2 -translate-x-1/2 px-4 py-1.5 rounded-full text-xs font-bold tracking-[2px] uppercase
          {bodyDetected ? 'bg-success/20 text-success border border-success/30' : 'bg-white/10 text-dim border border-white/10'}">
          {bodyDetected ? 'CORPS DETECTE' : modelLoading ? 'CHARGEMENT IA...' : 'PLACE-TOI DANS LE CADRE'}
        </div>
      </div>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        onclick={nextStep} disabled={!bodyDetected}
      >
        CONTINUER
      </button>
      <button class="text-xs text-dim tracking-[2px] hover:text-white/60 transition-colors" onclick={skipToProfile}>
        PASSER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 3: Test des reps                      -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 3}
    <div class="flex flex-col items-center text-center gap-4 w-full animate-fade-in">
      <h1 class="text-xl font-black uppercase tracking-[3px]">Test des Reps</h1>
      <p class="text-sm text-dim">Fais 3 pompes pour tester le suivi</p>

      <div class="relative w-full aspect-[3/4] bg-black rounded-[14px] overflow-hidden">
        <canvas bind:this={canvasEl} class="w-full h-full"></canvas>
        <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center pointer-events-none">
          <span class="font-mono text-4xl font-black text-gold leading-none" style="text-shadow: 0 0 20px rgba(255,209,102,0.6)">{testReps}</span>
          <span class="text-xs tracking-[4px] text-white/50 mt-1">/ 3 REPS</span>
        </div>
      </div>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        onclick={() => { stopCamera(); step = 4; }} disabled={testReps < 3}
      >
        {testReps >= 3 ? 'BRAVO ! CONTINUER' : `ENCORE ${3 - testReps}`}
      </button>
      <button class="text-xs text-dim tracking-[2px] hover:text-white/60 transition-colors" onclick={skipToProfile}>
        PASSER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 4: Objectif                           -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 4}
    <div class="flex flex-col items-center text-center gap-5 w-full animate-fade-in">
      <div class="text-4xl mb-1">🎯</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Ton Objectif</h1>
      <p class="text-sm text-dim tracking-[1px]">Qu'est-ce que tu veux accomplir ?</p>

      <div class="flex flex-col gap-2 w-full">
        {#each goals as [goalId, info], i}
          <button
            class="w-full relative backdrop-blur-sm border-l-4 rounded-lg transition-all duration-200 overflow-hidden -skew-x-[10deg]
              {selectedGoal === goalId
                ? 'bg-surface/90 border-primary border-y border-r border-white/10 shadow-[0_0_15px_rgba(230,57,70,0.2)]'
                : 'bg-surface/60 border-white/15 border-y border-r border-white/[0.05] hover:border-primary/40 hover:bg-surface/80'}"
            style="animation: slideInLeft 0.3s {0.04 * i}s ease-out both"
            onclick={() => { selectedGoal = goalId; }}
          >
            {#if selectedGoal === goalId}
              <div class="absolute inset-0 opacity-100 bg-[linear-gradient(rgba(230,57,70,0.04)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
            {/if}
            <div class="skew-x-[10deg] flex items-center gap-3 px-4 py-3.5">
              <span class="text-2xl">{info.emoji}</span>
              <div class="text-left">
                <span class="block font-black tracking-[2px] uppercase text-sm {selectedGoal === goalId ? 'text-white' : 'text-white/80'}">{info.label}</span>
                <span class="text-[0.6rem] text-dim/60 font-mono tracking-[0.5px]">{info.description}</span>
              </div>
              {#if selectedGoal === goalId}
                <span class="ml-auto text-primary text-sm">✓</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all disabled:opacity-40 disabled:cursor-not-allowed"
        onclick={nextStep} disabled={!selectedGoal}
      >
        CONTINUER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 5: Frequence                          -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 5}
    <div class="flex flex-col items-center text-center gap-5 w-full animate-fade-in">
      <div class="text-4xl mb-1">📅</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Frequence</h1>
      <p class="text-sm text-dim tracking-[1px]">Combien de jours par semaine ?</p>

      <!-- Big number display -->
      <div class="py-4">
        <span class="font-mono text-6xl font-black text-primary"
          style="text-shadow: 0 0 25px rgba(230,57,70,0.5)">{selectedDays}</span>
        <span class="text-lg text-dim/60 font-mono ml-1">j/sem</span>
      </div>

      <!-- Day selector buttons -->
      <div class="flex gap-2 w-full justify-center">
        {#each dayOptions as d}
          <button
            class="w-14 h-14 rounded-xl font-black text-lg transition-all -skew-x-3
              {selectedDays === d
                ? 'bg-primary/90 text-white border-2 border-primary shadow-[0_0_12px_rgba(230,57,70,0.3)]'
                : 'bg-surface/80 border border-white/10 text-dim/70 hover:border-primary/40'}"
            onclick={() => { selectedDays = d; }}
          >
            <span class="inline-block skew-x-3">{d}</span>
          </button>
        {/each}
      </div>

      <p class="text-[0.6rem] text-dim/40 font-mono tracking-[1px]">
        {#if selectedDays <= 3}
          Full body ou Upper/Lower recommande
        {:else if selectedDays <= 4}
          Upper/Lower ideal
        {:else}
          Push/Pull/Legs ideal
        {/if}
      </p>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={nextStep}
      >
        CONTINUER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 6: Equipement                         -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 6}
    <div class="flex flex-col items-center text-center gap-5 w-full animate-fade-in">
      <div class="text-4xl mb-1">🏋️</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Equipement</h1>
      <p class="text-sm text-dim tracking-[1px]">De quoi disposes-tu ?</p>

      <div class="flex flex-col gap-2 w-full">
        {#each Object.entries(equipmentLabels) as [key, info], i}
          {@const eqKey = key as EquipmentCategory}
          <button
            class="w-full relative backdrop-blur-sm border-l-4 rounded-lg transition-all duration-200 overflow-hidden -skew-x-[10deg]
              {selectedEquipment === eqKey
                ? 'bg-surface/90 border-gold border-y border-r border-white/10 shadow-[0_0_15px_rgba(255,209,102,0.15)]'
                : 'bg-surface/60 border-white/15 border-y border-r border-white/[0.05] hover:border-gold/40 hover:bg-surface/80'}"
            style="animation: slideInLeft 0.3s {0.04 * i}s ease-out both"
            onclick={() => { selectedEquipment = eqKey; }}
          >
            <div class="skew-x-[10deg] flex items-center justify-between px-4 py-3.5">
              <div class="text-left">
                <span class="block font-black tracking-[2px] uppercase text-sm {selectedEquipment === eqKey ? 'text-white' : 'text-white/80'}">{info.label}</span>
                <span class="text-[0.6rem] text-dim/50 font-mono tracking-[0.5px]">{info.items}</span>
              </div>
              {#if selectedEquipment === eqKey}
                <span class="text-gold text-sm">✓</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={nextStep}
      >
        CONTINUER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 7: Experience                         -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 7}
    <div class="flex flex-col items-center text-center gap-5 w-full animate-fade-in">
      <div class="text-4xl mb-1">🎓</div>
      <h1 class="text-2xl font-black uppercase tracking-[3px]">Ton Experience</h1>
      <p class="text-sm text-dim tracking-[1px]">Pour te proposer des poids de depart adaptes</p>

      <div class="flex flex-col gap-2 w-full">
        {#each experienceLevels as lvl, i}
          <button
            class="w-full relative backdrop-blur-sm border-l-4 rounded-lg transition-all duration-200 overflow-hidden -skew-x-[10deg]
              {selectedExperience === lvl.id
                ? 'bg-surface/90 border-primary border-y border-r border-white/10 shadow-[0_0_15px_rgba(230,57,70,0.2)]'
                : 'bg-surface/60 border-white/15 border-y border-r border-white/[0.05] hover:border-primary/40 hover:bg-surface/80'}"
            style="animation: slideInLeft 0.3s {0.04 * i}s ease-out both"
            onclick={() => { selectedExperience = lvl.id; }}
          >
            {#if selectedExperience === lvl.id}
              <div class="absolute inset-0 bg-[linear-gradient(rgba(230,57,70,0.04)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
            {/if}
            <div class="skew-x-[10deg] flex items-center gap-3 px-4 py-3.5">
              <span class="text-2xl">{lvl.emoji}</span>
              <div class="text-left">
                <span class="block font-black tracking-[2px] uppercase text-sm {selectedExperience === lvl.id ? 'text-white' : 'text-white/80'}">{lvl.label}</span>
                <span class="text-[0.6rem] text-dim/60 font-mono tracking-[0.5px]">{lvl.desc}</span>
              </div>
              {#if selectedExperience === lvl.id}
                <span class="ml-auto text-primary text-sm">✓</span>
              {/if}
            </div>
          </button>
        {/each}
      </div>

      <button
        class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={nextStep}
      >
        CONTINUER
      </button>
    </div>
  {/if}

  <!-- ═══════════════════════════════════════════ -->
  <!-- Step 8: Programme recommande               -->
  <!-- ═══════════════════════════════════════════ -->
  {#if step === 8}
    <div class="flex flex-col items-center text-center gap-5 w-full animate-fade-in">
      <div class="text-5xl mb-2">⚔️</div>
      <h1 class="text-2xl font-black tracking-[3px] uppercase text-gold" style="text-shadow: 0 0 30px rgba(255,209,102,0.4)">
        TON PROGRAMME
      </h1>

      <!-- Checklist -->
      <div class="bg-surface rounded-[14px] p-4 w-full">
        <div class="flex flex-col gap-2.5 text-sm text-left">
          <div class="flex items-center gap-3">
            <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
            <span class="text-dim">Avertissement sante accepte</span>
          </div>
          {#if cameraStream || testReps > 0}
            <div class="flex items-center gap-3">
              <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
              <span class="text-dim">Camera configuree</span>
            </div>
          {/if}
          {#if testReps >= 3}
            <div class="flex items-center gap-3">
              <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
              <span class="text-dim">Suivi des pompes verifie</span>
            </div>
          {/if}
          <div class="flex items-center gap-3">
            <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
            <span class="text-dim">Objectif : <strong class="text-white">{selectedGoal ? GOAL_INFO[selectedGoal].label : '...'}</strong></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
            <span class="text-dim">Frequence : <strong class="text-white">{selectedDays}j/sem</strong></span>
          </div>
          <div class="flex items-center gap-3">
            <span class="text-success" style="text-shadow: 0 0 8px rgba(74,222,128,0.5)">✓</span>
            <span class="text-dim">Equipement : <strong class="text-white">{equipmentLabels[selectedEquipment].label}</strong></span>
          </div>
        </div>
      </div>

      <!-- Recommended program -->
      {#if recommended}
        <div class="w-full">
          <p class="font-mono text-[0.58rem] tracking-[5px] text-dim/80 uppercase mb-2 text-left">◆ Programme recommande</p>
          <ProgramCard program={recommended} selected={true} onclick={() => {}} />
        </div>

        <button
          class="w-full py-4 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all
            shadow-[0_0_25px_rgba(230,57,70,0.3)]"
          onclick={finishOnboarding}
        >
          COMMENCER CE PROGRAMME
        </button>
      {:else}
        <div class="w-full bg-surface/60 border border-white/[0.06] rounded-[14px] p-5 text-center">
          <p class="text-dim/60 text-sm">Aucun programme ne correspond exactement a tes criteres.</p>
        </div>
      {/if}

      <button
        class="text-xs text-dim tracking-[2px] hover:text-white/60 transition-colors"
        onclick={finishWithoutProgram}
      >
        VOIR TOUS LES PROGRAMMES
      </button>
    </div>
  {/if}
</div>

<style>
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(12px); }
    to { opacity: 1; transform: translateY(0); }
  }
  .animate-fade-in {
    animation: fadeIn 0.4s ease-out both;
  }

  @keyframes dotPulse {
    0%, 100% { box-shadow: 0 0 4px rgba(230,57,70,0.4); }
    50% { box-shadow: 0 0 10px rgba(230,57,70,0.8); }
  }
  .dot-active {
    animation: dotPulse 1.5s ease-in-out infinite;
  }
</style>

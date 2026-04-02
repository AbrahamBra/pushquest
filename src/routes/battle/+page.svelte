<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/state';
  import { getBoss, type Boss } from '$lib/game/bosses';
  import { createBattle, type BattleState, type Battle } from '$lib/game/battle-engine';
  import { EXERCISES, type ExerciseConfig } from '$lib/ai/exercises.config';
  import { playSound, preloadSounds } from '$lib/game/audio';
  import { computeLevel } from '$lib/game/progression';
  import { onVisibilityChange } from '$lib/utils/visibility';
  import { saveBattleState, loadBattleState, clearBattleState } from '$lib/utils/local-storage';
  import { getBossSprite, type AnimationType } from '$lib/game/sprite-config';
  import CameraDetection from '$lib/components/CameraDetection.svelte';
  import SpriteAnimator from '$lib/components/SpriteAnimator.svelte';
  import HPBar from '$lib/components/HPBar.svelte';
  import RepCounter from '$lib/components/RepCounter.svelte';
  import FormScoreBar from '$lib/components/FormScoreBar.svelte';
  import VictoryScreen from '$lib/components/VictoryScreen.svelte';
  import DefeatScreen from '$lib/components/DefeatScreen.svelte';

  // URL params
  const bossId = $derived(page.url.searchParams.get('boss') ?? 'goblin');
  const exerciseType = $derived(page.url.searchParams.get('exercise') ?? 'pushup');
  const isResume = $derived(page.url.searchParams.get('resume') === 'true');

  // Boss and exercise config
  const boss: Boss = $derived(getBoss(bossId) ?? getBoss('goblin')!);
  const exerciseConfig: ExerciseConfig = $derived(EXERCISES[exerciseType] ?? EXERCISES['pushup']!);

  // Core state
  let battle: Battle | null = $state(null);
  let battleState: BattleState = $state({
    bossHP: 0, bossMaxHP: 0, reps: 0, damageDealt: 0,
    result: 'active', xpEarned: 0, timeElapsedSecs: 0,
  });

  // UI state
  let isLoading = $state(true);
  let loadingMsg = $state('DEMARRAGE...');
  let isPaused = $state(false);
  let secsLeft = $state(0);
  let formScore = $state(0);
  let showRepCounter = $state(false);
  let currentReps = $state(0);
  let countdown = $state(0);
  let showLevelUp = $state(false);
  let shaking = $state(false);
  let cameraActive = $state(false);
  let levelBefore = 0;

  // Boss sprite
  const bossSprite = $derived(getBossSprite(bossId));
  let bossAnim: AnimationType = $state('idle');
  let animTimer: ReturnType<typeof setTimeout> | null = null;

  function playBossAnim(anim: AnimationType, durationMs: number = 600): void {
    bossAnim = anim;
    if (animTimer) clearTimeout(animTimer);
    animTimer = setTimeout(() => { bossAnim = 'idle'; }, durationMs);
  }

  // Random boss attack (every 8-15s)
  let bossAttackHandle: ReturnType<typeof setInterval> | null = null;

  // Handles
  let timerHandle: ReturnType<typeof setInterval> | null = null;
  let saveHandle: ReturnType<typeof setInterval> | null = null;
  let repPopTimer: ReturnType<typeof setTimeout> | null = null;

  // Timer display
  const timerDisplay = $derived(() => {
    const m = Math.floor(secsLeft / 60);
    const s = secsLeft % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  });
  const timerWarning = $derived(secsLeft <= 30 && secsLeft > 0);

  // Battle result checks
  const isVictory = $derived(battleState.result === 'victory');
  const isDefeat = $derived(battleState.result === 'defeat' || battleState.result === 'fled');
  const isActive = $derived(battleState.result === 'active');

  function updateBattleState(): void {
    if (battle) battleState = battle.getState();
  }

  // --- Camera callbacks ---
  function handleRep(): void {
    if (!battle || !cameraActive) return;
    battle.dealDamage();
    updateBattleState();
    currentReps = battleState.reps;
    playSound('rep');

    // Boss hurt animation
    playBossAnim('hurt', 400);

    // Screen shake
    shaking = true;
    setTimeout(() => { shaking = false; }, 150);

    // Rep pop
    showRepCounter = true;
    if (repPopTimer) clearTimeout(repPopTimer);
    repPopTimer = setTimeout(() => { showRepCounter = false; }, 750);

    if (battleState.result === 'victory') {
      bossAnim = 'death';
      endBattle('victory');
    }
  }

  function handleFormUpdate(score: number): void {
    formScore = score;
  }

  function handleCameraReady(): void {
    isLoading = false;
    levelBefore = computeLevel(parseInt(localStorage.getItem('pushquest_xp') ?? '0', 10));

    // Resume: skip countdown
    if (isResume) {
      const saved = loadBattleState();
      if (saved && saved.bossId === bossId) {
        // Restore state
        for (let i = 0; i < saved.reps; i++) battle?.dealDamage();
        updateBattleState();
        currentReps = saved.reps;
        secsLeft = boss.timeLimitSecs - saved.timeElapsedSecs;
        cameraActive = true;
        startTimer();
        clearBattleState();
        return;
      }
    }

    // Normal: 3-2-1 countdown
    countdown = 3;
    const countdownInterval = setInterval(() => {
      countdown--;
      playSound('countdown');
      if (countdown <= 0) {
        clearInterval(countdownInterval);
        cameraActive = true;
        startTimer();
      }
    }, 1000);
  }

  function handleCameraError(msg: string): void {
    loadingMsg = msg;
  }

  // --- Timer ---
  function startTimer(): void {
    if (!secsLeft) secsLeft = boss.timeLimitSecs;
    timerHandle = setInterval(() => {
      if (isPaused || !cameraActive) return;
      secsLeft--;
      if (battle) { battle.tick(); updateBattleState(); }
      if (secsLeft <= 30 && secsLeft > 0) playSound('warning');
      if (secsLeft <= 0) endBattle('defeat');
    }, 1000);

    // Random boss attacks (visual only, every 8-15s)
    bossAttackHandle = setInterval(() => {
      if (isPaused || !cameraActive || battleState.result !== 'active') return;
      playBossAnim('attack', 800);
    }, 8000 + Math.random() * 7000);

    // Auto-save
    saveHandle = setInterval(() => {
      if (!battle || !cameraActive) return;
      const s = battle.getState();
      saveBattleState({ bossId: boss.id, exerciseType, bossHP: s.bossHP, reps: s.reps, timeElapsedSecs: s.timeElapsedSecs, savedAt: Date.now() });
    }, 5000);
  }

  function endBattle(result: 'victory' | 'defeat'): void {
    cameraActive = false;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    if (saveHandle) { clearInterval(saveHandle); saveHandle = null; }
    clearBattleState();

    if (result === 'victory') {
      if (battle) updateBattleState();
      playSound('victory');
      const earned = battleState.xpEarned;
      const currentXP = parseInt(localStorage.getItem('pushquest_xp') ?? '0', 10);
      const newXP = currentXP + earned;
      localStorage.setItem('pushquest_xp', String(newXP));
      const levelAfter = computeLevel(newXP);
      if (levelAfter > levelBefore) {
        showLevelUp = true; playSound('levelup');
        setTimeout(() => { showLevelUp = false; }, 3000);
      }
      saveBattleHistory('victory');
    } else {
      if (battle) { battle.timeUp(); updateBattleState(); }
      playSound('defeat');
      saveBattleHistory('defeat');
    }
  }

  function saveBattleHistory(result: string): void {
    try {
      const history = JSON.parse(localStorage.getItem('pushquest_history') ?? '[]');
      history.unshift({ bossId: boss.id, bossName: boss.name, result, reps: battleState.reps, date: new Date().toISOString() });
      if (history.length > 50) history.length = 50;
      localStorage.setItem('pushquest_history', JSON.stringify(history));
    } catch {}
  }

  function pauseGame(): void { isPaused = true; }
  function resumeGame(): void { isPaused = false; }

  function fleeGame(): void {
    cameraActive = false;
    if (battle) battle.flee();
    updateBattleState();
    cleanup(); goto('/');
  }

  function closeBattle(): void { cameraActive = false; cleanup(); goto('/'); }
  function handleVictoryClaim(): void { cleanup(); goto('/'); }
  function handleRetry(): void { cleanup(); goto(`/battle?boss=${bossId}&exercise=${exerciseType}`); }
  function handleEasierBoss(): void { cleanup(); goto('/'); }

  function cleanup(): void {
    cameraActive = false;
    if (timerHandle) { clearInterval(timerHandle); timerHandle = null; }
    if (saveHandle) { clearInterval(saveHandle); saveHandle = null; }
    if (repPopTimer) { clearTimeout(repPopTimer); repPopTimer = null; }
    if (bossAttackHandle) { clearInterval(bossAttackHandle); bossAttackHandle = null; }
    if (animTimer) { clearTimeout(animTimer); animTimer = null; }
  }

  onMount(() => {
    preloadSounds();
    battle = createBattle(boss);
    updateBattleState();
    secsLeft = boss.timeLimitSecs;

    const visCleanup = onVisibilityChange(
      () => { if (cameraActive) pauseGame(); },
      () => {},
    );

    return () => { cleanup(); visCleanup(); };
  });
</script>

<div class="fixed inset-0 bg-black flex flex-col overflow-hidden {shaking ? 'animate-shake' : ''}">
  <!-- Camera Detection Component -->
  <CameraDetection
    {exerciseConfig}
    active={cameraActive}
    paused={isPaused}
    onRep={handleRep}
    onFormUpdate={handleFormUpdate}
    onLoadingMsg={(msg) => { loadingMsg = msg; }}
    onReady={handleCameraReady}
    onError={handleCameraError}
  />

  <!-- Boss Sprite -->
  {#if bossSprite && isActive && !isLoading && countdown <= 0}
    <div class="absolute top-[15%] left-1/2 -translate-x-1/2 z-[3] flex items-center justify-center
      {bossAnim === 'hurt' ? 'brightness-200' : ''}
      {bossAnim === 'death' ? 'opacity-80' : ''}"
      style="filter: drop-shadow(0 0 20px rgba(230,57,70,0.4)) drop-shadow(0 4px 12px rgba(0,0,0,0.6));
             transition: filter 0.15s ease-out;">
      <SpriteAnimator
        sprite={bossSprite}
        animation={bossAnim}
        class="max-h-[35vh]"
      />
    </div>
  {/if}

  <!-- Gradient overlays -->
  <div class="absolute top-0 left-0 right-0 h-[200px] bg-gradient-to-b from-black/[0.88] to-transparent pointer-events-none z-[2]"></div>
  <div class="absolute bottom-0 left-0 right-0 h-[220px] bg-gradient-to-t from-black/[0.92] to-transparent pointer-events-none z-[2]"></div>

  {#if isActive || isLoading}
    <!-- Top HUD -->
    <div class="absolute top-0 left-0 right-0 flex justify-between items-center px-5 z-10"
      style="padding-top: calc(18px + var(--safe-top, 0px))">
      <button class="w-[38px] h-[38px] rounded-full bg-white/[0.12] border-none text-white text-sm cursor-pointer flex items-center justify-center"
        onclick={closeBattle}>✕</button>
      <div class="text-[1.05rem] font-black tracking-[5px] uppercase">{boss.name}</div>
      <div class="font-mono text-[0.95rem] font-bold tracking-[1px] flex items-center gap-1.5 {timerWarning ? 'text-primary' : 'text-white'}">
        ⏱ {timerDisplay()}
      </div>
    </div>

    <!-- HP Bar -->
    <div class="absolute left-5 right-5 z-10" style="top: calc(60px + var(--safe-top, 0px))">
      <div class="relative">
        <div class="absolute -top-2 -left-2 w-6 h-6 border-t border-l border-primary/40"></div>
        <div class="absolute -top-2 -right-2 w-6 h-6 border-t border-r border-primary/40"></div>
        <div class="absolute -bottom-2 -left-2 w-6 h-6 border-b border-l border-primary/40"></div>
        <div class="absolute -bottom-2 -right-2 w-6 h-6 border-b border-r border-primary/40"></div>
        <HPBar current={battleState.bossHP} max={battleState.bossMaxHP} />
      </div>
    </div>

    <!-- Rep Counter -->
    <RepCounter count={currentReps} visible={showRepCounter} />

    <!-- Bottom HUD -->
    <div class="absolute left-5 right-5 z-10 flex flex-col gap-2.5"
      style="bottom: calc(36px + var(--safe-bottom, 0px))">
      <FormScoreBar value={formScore} />
      <div class="flex gap-2.5">
        <button class="flex-1 py-3.5 bg-black/50 border-[1.5px] border-white/[0.18] text-white font-bold text-xs tracking-[3px] uppercase rounded-[12px] cursor-pointer backdrop-blur-md"
          onclick={pauseGame}>PAUSE</button>
        <button class="flex-1 py-3.5 bg-black/50 border-[1.5px] border-primary/60 text-primary font-bold text-xs tracking-[3px] uppercase rounded-[12px] cursor-pointer backdrop-blur-md"
          onclick={fleeGame}>FUIR</button>
      </div>
    </div>
  {/if}

  <!-- Loading Overlay -->
  {#if isLoading}
    <div class="absolute inset-0 bg-[rgba(8,8,15,0.92)] flex flex-col items-center justify-center z-30 gap-[18px] loading-grid">
      <div class="w-[38px] h-[38px] border-[3px] border-white/[0.08] border-t-primary rounded-full animate-spin"></div>
      <div class="text-xs tracking-[4px] text-dim">{loadingMsg}</div>
      {#if loadingMsg === 'CAMERA REFUSEE' || loadingMsg === 'ECHEC CHARGEMENT'}
        <button class="mt-4 py-3 px-8 bg-primary text-white font-bold rounded-[14px] text-xs tracking-[3px] uppercase hover:bg-primary-hover active:scale-[0.97] transition-all"
          onclick={closeBattle}>RETOUR</button>
      {/if}
    </div>
  {/if}

  <!-- Countdown Overlay -->
  {#if countdown > 0 && !isLoading}
    <div class="absolute inset-0 bg-[rgba(8,8,15,0.85)] flex items-center justify-center z-[28]">
      <span class="font-mono text-8xl font-black text-primary"
        style="text-shadow: 0 0 40px rgba(230,57,70,0.8), 0 0 80px rgba(230,57,70,0.4);
               animation: repPop 0.8s ease-out both">{countdown}</span>
    </div>
  {/if}

  <!-- Level Up Overlay -->
  {#if showLevelUp}
    <div class="absolute top-[15%] left-0 right-0 flex flex-col items-center z-[35] pointer-events-none"
      style="animation: fadeInUp 0.5s ease-out both">
      <span class="font-mono text-[0.6rem] tracking-[6px] text-gold/80 uppercase mb-2">NIVEAU SUPERIEUR</span>
      <span class="text-5xl font-black text-gold"
        style="text-shadow: 0 0 30px rgba(255,209,102,0.8), 0 0 60px rgba(255,209,102,0.4);
               animation: repPop 0.8s ease-out both">LEVEL UP!</span>
    </div>
  {/if}

  <!-- Pause Overlay -->
  {#if isPaused && isActive}
    <div class="absolute inset-0 bg-[rgba(8,8,15,0.9)] flex flex-col items-center justify-center z-[25] gap-4">
      <h2 class="text-3xl font-black tracking-[8px]">EN PAUSE</h2>
      <button class="py-3 px-9 bg-primary text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary-hover active:scale-[0.98] transition-all"
        onclick={resumeGame}>REPRENDRE</button>
      <button class="py-3 px-9 bg-transparent border-[1.5px] border-white/25 text-white font-bold text-xs tracking-[3px] rounded-[12px] cursor-pointer"
        onclick={closeBattle}>QUITTER</button>
    </div>
  {/if}

  <!-- Victory Screen -->
  {#if isVictory}
    <div class="absolute inset-0 bg-background/95 z-30 flex items-center justify-center overflow-y-auto">
      <VictoryScreen state={battleState} {boss} onClaim={handleVictoryClaim} />
    </div>
  {/if}

  <!-- Defeat Screen -->
  {#if isDefeat}
    <div class="absolute inset-0 bg-background/95 z-30 flex items-center justify-center overflow-y-auto">
      <DefeatScreen state={battleState} {boss} onRetry={handleRetry} onEasier={handleEasierBoss} />
    </div>
  {/if}
</div>

<style>
  .loading-grid {
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 32px 32px;
  }
</style>

<script lang="ts">
  import type { SetLog } from '$lib/game/session-engine';

  let { sessionName, programName, logs, durationSecs, xpEarned, onClose }: {
    sessionName: string;
    programName: string;
    logs: SetLog[];
    durationSecs: number;
    xpEarned: number;
    onClose: () => void;
  } = $props();

  const totalReps = $derived(logs.reduce((sum, l) => sum + l.repsCompleted, 0));
  const totalSets = $derived(logs.length);
  const uniqueExercises = $derived(new Set(logs.map(l => l.exerciseId)).size);
  const avgFormScore = $derived(() => {
    const scored = logs.filter(l => l.formScore !== null);
    if (!scored.length) return null;
    return Math.round(scored.reduce((s, l) => s + (l.formScore ?? 0), 0) / scored.length * 100);
  });

  const durationDisplay = $derived(() => {
    const m = Math.floor(durationSecs / 60);
    const s = durationSecs % 60;
    return `${m}:${s.toString().padStart(2, '0')}`;
  });
</script>

<div class="flex flex-col items-center w-full max-w-[380px] mx-auto px-6 py-8">
  <!-- Status -->
  <div class="flex items-center gap-2 mb-4" style="animation: fadeInDown 0.5s ease-out both">
    <span class="w-1.5 h-1.5 rounded-full bg-gold"
      style="animation: statusDot 1.2s ease-in-out infinite; box-shadow: 0 0 6px rgba(255,209,102,0.8)"></span>
    <span class="font-mono text-[0.6rem] tracking-[4px] text-gold/70 uppercase">SESSION_COMPLETE</span>
  </div>

  <!-- Victory beam -->
  <div class="w-full h-[2px] mb-5"
    style="background: linear-gradient(to right, transparent, rgba(255,209,102,0.6), transparent);
           animation: victoryBeam 0.8s 0.2s ease-out both;"></div>

  <!-- Title -->
  <h1 class="text-[1.6rem] font-black tracking-[3px] uppercase text-gold italic mb-1"
    style="text-shadow: 0 0 20px rgba(255,209,102,0.5); animation: fadeInUp 0.5s 0.2s ease-out both">
    SESSION COMPLETE
  </h1>
  <p class="font-mono text-[0.6rem] text-dim/60 tracking-[2px] mb-6"
    style="animation: fadeInUp 0.5s 0.25s ease-out both">
    {programName} · {sessionName}
  </p>

  <!-- XP Card -->
  <div class="relative w-full bg-surface/80 border border-gold/20 rounded-xl px-5 py-5 mb-5"
    style="animation: fadeInUp 0.5s 0.3s ease-out both; box-shadow: 0 0 30px rgba(255,209,102,0.15)">
    <div class="absolute -top-2 -left-2 w-5 h-5 border-t-2 border-l-2 border-gold/50"></div>
    <div class="absolute -top-2 -right-2 w-5 h-5 border-t-2 border-r-2 border-gold/50"></div>
    <div class="absolute -bottom-2 -left-2 w-5 h-5 border-b-2 border-l-2 border-gold/50"></div>
    <div class="absolute -bottom-2 -right-2 w-5 h-5 border-b-2 border-r-2 border-gold/50"></div>

    <div class="text-center">
      <span class="text-4xl font-black text-gold font-mono"
        style="text-shadow: 0 0 20px rgba(255,209,102,0.6)">+{xpEarned}</span>
      <span class="text-[0.6rem] text-gold/60 font-mono tracking-[3px] ml-1">XP</span>
    </div>
  </div>

  <!-- Stats grid -->
  <div class="grid grid-cols-2 gap-2 w-full mb-6" style="animation: fadeInUp 0.5s 0.4s ease-out both">
    <div class="bg-surface/60 border border-white/[0.06] rounded-lg px-3 py-3 text-center">
      <span class="block text-xl font-black text-primary font-mono">{totalReps}</span>
      <span class="text-[0.5rem] text-dim/50 font-mono tracking-[2px] uppercase">Reps</span>
    </div>
    <div class="bg-surface/60 border border-white/[0.06] rounded-lg px-3 py-3 text-center">
      <span class="block text-xl font-black text-primary font-mono">{totalSets}</span>
      <span class="text-[0.5rem] text-dim/50 font-mono tracking-[2px] uppercase">Series</span>
    </div>
    <div class="bg-surface/60 border border-white/[0.06] rounded-lg px-3 py-3 text-center">
      <span class="block text-xl font-black text-primary font-mono">{durationDisplay()}</span>
      <span class="text-[0.5rem] text-dim/50 font-mono tracking-[2px] uppercase">Duree</span>
    </div>
    <div class="bg-surface/60 border border-white/[0.06] rounded-lg px-3 py-3 text-center">
      <span class="block text-xl font-black text-primary font-mono">{uniqueExercises}</span>
      <span class="text-[0.5rem] text-dim/50 font-mono tracking-[2px] uppercase">Exercices</span>
    </div>
  </div>

  <!-- Form score if available -->
  {#if avgFormScore() !== null}
    <div class="w-full bg-surface/40 border border-white/[0.04] rounded-lg px-4 py-2.5 text-center mb-5"
      style="animation: fadeInUp 0.5s 0.45s ease-out both">
      <span class="text-[0.55rem] text-dim/50 font-mono tracking-[2px] uppercase">Form Score IA</span>
      <span class="block text-lg font-black text-gold font-mono"
        style="text-shadow: 0 0 10px rgba(255,209,102,0.4)">{avgFormScore()}%</span>
    </div>
  {/if}

  <!-- Close button -->
  <div class="w-full" style="animation: fadeInUp 0.5s 0.55s ease-out both">
    <button
      class="w-full py-4 bg-gold/20 border-2 border-gold/40 text-gold font-black rounded-[14px] text-[0.9rem] tracking-[4px] uppercase
        hover:bg-gold/30 active:scale-[0.97] transition-all -skew-x-[10deg]"
      style="text-shadow: 0 0 12px rgba(255,209,102,0.5)"
      onclick={onClose}
    >
      <span class="inline-block skew-x-[10deg]">◆ TERMINER</span>
    </button>
  </div>
</div>

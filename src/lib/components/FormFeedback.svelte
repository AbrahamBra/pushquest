<script lang="ts">
  import type { ExerciseConfig } from '$lib/ai/exercises.config';

  let { score, cues, onDismiss }: {
    score: number;  // 0-100
    cues?: ExerciseConfig['formCues'];
    onDismiss: () => void;
  } = $props();

  const color = $derived(score >= 80 ? '#4ADE80' : score >= 50 ? '#FFD166' : '#E63946');
  const label = $derived(score >= 80 ? 'EXCELLENT' : score >= 50 ? 'CORRECT' : 'A AMELIORER');
  const tip = $derived(() => {
    if (score < 50 && cues?.depthWarning) return cues.depthWarning;
    if (score < 70 && cues?.tooFast) return cues.tooFast;
    if (cues?.symmetryWarning && score < 60) return cues.symmetryWarning;
    return null;
  });

  // Auto-dismiss after 3s
  $effect(() => {
    const timer = setTimeout(onDismiss, 3000);
    return () => clearTimeout(timer);
  });

  // SVG gauge
  const radius = 42;
  const circumference = 2 * Math.PI * radius;
  const offset = $derived(circumference - (score / 100) * circumference);
</script>

<div class="fixed inset-0 z-40 flex items-center justify-center bg-black/60 backdrop-blur-sm"
  style="animation: fadeInUp 0.2s ease-out both"
  role="dialog"
>
  <div class="bg-surface/95 border border-white/[0.1] rounded-2xl p-6 max-w-[280px] w-full text-center"
    style="box-shadow: 0 0 40px rgba(0,0,0,0.5)">
    <!-- Gauge -->
    <div class="relative w-[100px] h-[100px] mx-auto mb-3">
      <svg class="w-full h-full -rotate-90" viewBox="0 0 100 100">
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6" />
        <circle cx="50" cy="50" r={radius}
          fill="none" stroke={color} stroke-width="6" stroke-linecap="round"
          stroke-dasharray={circumference} stroke-dashoffset={offset}
          class="transition-all duration-700 ease-out"
          style="filter: drop-shadow(0 0 8px {color}80)"
        />
      </svg>
      <div class="absolute inset-0 flex items-center justify-center">
        <span class="font-mono text-2xl font-black" style="color: {color}; text-shadow: 0 0 15px {color}80">{Math.round(score)}%</span>
      </div>
    </div>

    <!-- Label -->
    <p class="font-black tracking-[3px] uppercase text-sm mb-1" style="color: {color}">{label}</p>

    <!-- Tip -->
    {#if tip()}
      <p class="text-[0.6rem] text-dim/60 font-mono tracking-[0.5px] italic">{tip()}</p>
    {/if}
  </div>
</div>

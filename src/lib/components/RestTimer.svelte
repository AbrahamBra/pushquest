<script lang="ts">
  let { seconds, total, onSkip }: {
    seconds: number;
    total: number;
    onSkip: () => void;
  } = $props();

  const pct = $derived(total > 0 ? ((total - seconds) / total) * 100 : 0);
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeOffset = $derived(circumference - (pct / 100) * circumference);
  const isLow = $derived(seconds <= 3 && seconds > 0);

  const display = $derived(() => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}:${s.toString().padStart(2, '0')}` : `${s}`;
  });
</script>

<div class="flex flex-col items-center gap-4">
  <p class="font-mono text-[0.58rem] tracking-[5px] text-dim/80 uppercase">◆ Repos</p>

  <!-- Circular timer -->
  <div class="relative w-[140px] h-[140px]">
    <svg class="w-full h-full -rotate-90" viewBox="0 0 120 120">
      <!-- Track -->
      <circle cx="60" cy="60" r={radius}
        fill="none" stroke="rgba(255,255,255,0.06)" stroke-width="6" />
      <!-- Progress -->
      <circle cx="60" cy="60" r={radius}
        fill="none"
        stroke={isLow ? '#E63946' : '#FFD166'}
        stroke-width="6"
        stroke-linecap="round"
        stroke-dasharray={circumference}
        stroke-dashoffset={strokeOffset}
        class="transition-all duration-1000 ease-linear"
        style={isLow ? 'filter: drop-shadow(0 0 8px rgba(230,57,70,0.8))' : 'filter: drop-shadow(0 0 8px rgba(255,209,102,0.5))'}
      />
    </svg>
    <!-- Time display -->
    <div class="absolute inset-0 flex items-center justify-center">
      <span class="font-mono text-3xl font-black {isLow ? 'text-primary' : 'text-gold'}"
        style={isLow ? 'text-shadow: 0 0 15px rgba(230,57,70,0.7); animation: timerPulse 1s infinite' : 'text-shadow: 0 0 15px rgba(255,209,102,0.6)'}
      >{display()}</span>
    </div>
  </div>

  <!-- Skip button -->
  <button
    class="py-2.5 px-6 bg-surface/80 border border-white/[0.1] text-dim/70 font-bold text-[0.65rem] tracking-[3px] uppercase rounded-lg
      hover:border-primary/40 hover:text-white transition-all -skew-x-3"
    onclick={onSkip}
  >
    <span class="inline-block skew-x-3">PASSER ▶</span>
  </button>
</div>

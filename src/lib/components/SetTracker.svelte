<script lang="ts">
  let { totalSets, completedSets, currentSet }: {
    totalSets: number;
    completedSets: number;
    currentSet: number;
  } = $props();
</script>

<div class="flex items-center gap-1.5">
  {#each Array(totalSets) as _, i}
    {@const setNum = i + 1}
    {@const isCompleted = setNum <= completedSets}
    {@const isCurrent = setNum === currentSet && !isCompleted}
    <div class="relative">
      <div class="w-6 h-6 rounded-sm flex items-center justify-center text-[0.55rem] font-mono font-bold transition-all
        {isCompleted
          ? 'bg-primary/80 text-white shadow-[0_0_8px_rgba(230,57,70,0.5)]'
          : isCurrent
            ? 'bg-gold/20 border-2 border-gold/60 text-gold'
            : 'bg-white/[0.04] border border-white/[0.08] text-dim/30'}"
        style={isCurrent ? 'animation: pulseGlowGold 2s ease-in-out infinite' : ''}
      >
        {isCompleted ? '✓' : setNum}
      </div>
    </div>
  {/each}
  <span class="text-[0.5rem] text-dim/40 font-mono ml-1">{completedSets}/{totalSets}</span>
</div>

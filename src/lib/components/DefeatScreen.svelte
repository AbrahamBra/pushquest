<script lang="ts">
  import type { BattleState } from '$lib/game/battle-engine';
  import type { Boss } from '$lib/game/bosses';
  let { state, boss, onRetry, onEasier }: { state: BattleState; boss: Boss; onRetry: () => void; onEasier?: () => void } = $props();
  const pct = $derived(Math.round((state.damageDealt / state.bossMaxHP) * 100));
  const encouragement = $derived(
    pct >= 80 ? 'SO CLOSE! One more try!' : pct >= 50 ? 'Great effort! Keep pushing!' : 'Every rep counts. You got this!'
  );
</script>
<div class="flex flex-col items-center text-center px-7 py-14 gap-0">
  <h1 class="text-4xl font-black tracking-[5px] text-primary mb-2" style="text-shadow: 0 0 20px rgba(230,57,70,0.4)">TIME'S UP!</h1>

  <div class="bg-surface/80 backdrop-blur-sm border border-white/[0.07] rounded-[14px] px-8 py-5 mb-4 w-full">
    <p class="font-mono text-2xl font-black text-white">{state.damageDealt} / {state.bossMaxHP} <span class="text-sm text-dim">damage dealt</span></p>
    <div class="h-2 bg-white/10 rounded-full overflow-hidden mt-3">
      <div class="h-full bg-primary rounded-full transition-[width] duration-500" style="width: {pct}%; box-shadow: 0 0 8px rgba(230,57,70,0.5)"></div>
    </div>
    <p class="font-mono text-xs text-dim tracking-[2px] mt-2 text-right">{pct}% damage dealt</p>
  </div>

  <p class="text-sm tracking-[2px] mb-8" style="color: #FFD166; text-shadow: 0 0 10px rgba(255,209,102,0.3)">{encouragement}</p>

  <!-- Skewed TRY AGAIN button -->
  <div class="w-full relative mb-3">
    <div class="absolute inset-0 bg-primary/20 transform -skew-x-3 rounded-[14px]"></div>
    <button
      class="relative w-full py-4 bg-primary/90 backdrop-blur-sm text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary active:scale-[0.98] transition-all transform -skew-x-3"
      onclick={onRetry}
    >
      <span class="inline-block skew-x-3">TRY AGAIN</span>
    </button>
  </div>

  {#if onEasier}
  <button class="w-full py-3 bg-transparent border border-white/20 text-white/70 font-bold rounded-[14px] tracking-[2px] text-sm hover:border-white/40 transition-all" onclick={onEasier}>Try an easier boss</button>
  {/if}
</div>

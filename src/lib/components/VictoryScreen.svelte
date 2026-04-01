<script lang="ts">
  import type { BattleState } from '$lib/game/battle-engine';
  import type { Boss } from '$lib/game/bosses';
  let { state, boss, onClaim }: { state: BattleState; boss: Boss; onClaim: () => void } = $props();
  const timeLeft = $derived(boss.timeLimitSecs - state.timeElapsedSecs);
  const fmtTime = $derived(`${Math.floor(timeLeft/60)}:${(timeLeft%60).toString().padStart(2,'0')}`);
</script>
<div class="flex flex-col items-center text-center px-7 py-14 gap-0">
  <h1 class="text-5xl font-black tracking-[8px] text-gold" style="text-shadow: 0 0 50px rgba(255,209,102,0.5); animation: fadeInUp 0.5s ease-out both">VICTORY</h1>
  <p class="text-xs tracking-[4px] text-dim mt-1">SLAIN</p>
  <p class="text-xl font-black tracking-[5px] text-primary mt-1 mb-9" style="text-shadow: 0 0 15px rgba(230,57,70,0.5)">{boss.name}</p>

  <!-- XP card with decorative corner brackets -->
  <div class="relative bg-surface/80 backdrop-blur-sm border-[1.5px] border-gold/25 rounded-[18px] px-12 py-6 mb-5" style="animation: fadeInUp 0.5s 0.15s ease-out both">
    <!-- Corner brackets -->
    <span class="absolute top-2 left-2 text-gold/40 text-lg leading-none font-mono select-none">⌐</span>
    <span class="absolute top-2 right-2 text-gold/40 text-lg leading-none font-mono select-none rotate-90">⌐</span>
    <span class="absolute bottom-2 left-2 text-gold/40 text-lg leading-none font-mono select-none -rotate-90">⌐</span>
    <span class="absolute bottom-2 right-2 text-gold/40 text-lg leading-none font-mono select-none rotate-180">⌐</span>

    <p class="font-mono text-5xl font-black text-gold" style="text-shadow: 0 0 30px rgba(255,209,102,0.6), 0 0 60px rgba(255,209,102,0.2)">+{state.xpEarned}</p>
    <p class="text-xs tracking-[5px] text-dim mt-1">XP EARNED</p>
  </div>

  <div class="flex gap-7 mb-10 text-sm text-dim font-mono" style="animation: fadeInUp 0.5s 0.25s ease-out both">
    <span>⚡ <strong class="text-white font-bold">{state.reps}</strong> reps</span>
    <span>⏱ <strong class="text-white font-bold">{fmtTime}</strong> left</span>
  </div>

  <!-- Skewed CLAIM REWARDS button -->
  <div class="w-full relative" style="animation: fadeInUp 0.5s 0.35s ease-out both">
    <div class="absolute inset-0 bg-primary/20 transform -skew-x-3 rounded-[14px]"></div>
    <button
      class="relative w-full py-4 bg-primary/90 backdrop-blur-sm text-white font-black rounded-[14px] tracking-[4px] uppercase hover:bg-primary active:scale-[0.98] transition-all transform -skew-x-3"
      onclick={onClaim}
    >
      <span class="inline-block skew-x-3">CLAIM REWARDS</span>
    </button>
  </div>
</div>
<style>
  @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
</style>

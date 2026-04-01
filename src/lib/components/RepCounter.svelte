<script lang="ts">
  let { count, visible }: { count: number; visible: boolean } = $props();
  let animKey = $state(0);
  $effect(() => { if (count > 0) animKey++; });
</script>
{#if visible}
<div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10 pointer-events-none flex flex-col items-center">
  {#key animKey}
  <!-- Background pulse -->
  <div class="absolute inset-0 rounded-full bg-gold/10 blur-xl" style="animation: pulseFade 0.7s ease-out forwards"></div>
  <span class="relative font-mono text-[80px] font-black text-gold leading-none" style="text-shadow: 0 0 40px rgba(255,209,102,0.7), 0 0 80px rgba(255,209,102,0.3); animation: repPop 0.7s ease-out forwards">{count}</span>
  {/key}
  <span class="text-xs tracking-[5px] text-white/55 mt-1">DAMAGE DEALT</span>
</div>
{/if}
<style>
  @keyframes repPop {
    0% { transform: scale(1.5); opacity: 1; }
    60% { transform: scale(1); opacity: 1; }
    100% { transform: scale(0.9) translateY(-20px); opacity: 0; }
  }
  @keyframes pulseFade {
    0% { transform: scale(0.5); opacity: 0.8; }
    100% { transform: scale(2.5); opacity: 0; }
  }
</style>

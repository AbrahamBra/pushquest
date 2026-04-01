<script lang="ts">
  import type { Boss } from '$lib/game/bosses';
  let { boss, selected, locked, onclick }: { boss: Boss; selected: boolean; locked: boolean; onclick: () => void } = $props();
  const meta = $derived(`${boss.difficulty.charAt(0).toUpperCase() + boss.difficulty.slice(1)}  ·  ${boss.hp} reps  ·  ${Math.floor(boss.timeLimitSecs / 60)} min`);
</script>

<button
  class="w-full relative group transition-all select-none text-left"
  onclick={locked ? undefined : onclick}
  disabled={locked}
>
  <!-- Skewed background layer -->
  <div class="absolute inset-0 {selected ? 'bg-primary/10' : 'bg-primary/[0.03]'} transform -skew-x-6 rounded-lg transition-colors {locked ? '' : 'group-hover:bg-primary/[0.08]'}"></div>

  <!-- Card content -->
  <div class="relative bg-surface/80 backdrop-blur-sm border-l-4 {selected ? 'border-primary shadow-[0_0_15px_rgba(230,57,70,0.2)]' : 'border-white/10'}
    border-y border-r border-white/[0.07] p-4 transform -skew-x-6 rounded-lg transition-all
    {locked ? 'opacity-50' : 'hover:border-primary/40'}">

    <div class="transform skew-x-6 flex items-center justify-between">
      <div class="flex flex-col gap-1">
        <span class="font-black tracking-[3px] uppercase" style="{selected ? 'text-shadow: 0 0 10px rgba(230,57,70,0.5)' : ''}">{boss.name}</span>
        <span class="text-sm text-dim font-normal tracking-[1px]">{locked ? `Level ${boss.requiredLevel} required` : meta}</span>
      </div>
      <div class="text-2xl font-black font-mono text-primary flex flex-col items-end">
        {#if locked}
          <span class="text-dim text-lg">🔒</span>
        {:else}
          {boss.hp}<span class="text-xs text-dim font-normal tracking-[2px]">HP</span>
        {/if}
      </div>
    </div>
  </div>
</button>

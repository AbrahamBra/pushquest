<script lang="ts">
  import type { ProgramGoal } from '$lib/data/types';
  import { GOAL_INFO } from '$lib/data/program-service';

  let { selected, onselect }: {
    selected: ProgramGoal | null;
    onselect: (goal: ProgramGoal | null) => void;
  } = $props();

  const goals = Object.entries(GOAL_INFO) as [ProgramGoal, typeof GOAL_INFO[ProgramGoal]][];
</script>

<div class="flex gap-1.5 flex-wrap">
  <!-- All filter -->
  <button
    class="relative py-2 px-3 rounded-lg text-[0.6rem] font-bold tracking-[2px] uppercase transition-all -skew-x-3
      {selected === null
        ? 'bg-primary/90 backdrop-blur-sm text-white border-l-2 border-primary shadow-[0_0_12px_rgba(230,57,70,0.2)]'
        : 'bg-surface/80 backdrop-blur-sm border border-white/10 text-dim hover:border-primary/40'}"
    onclick={() => onselect(null)}
  >
    <span class="inline-block skew-x-3">TOUS</span>
  </button>

  {#each goals as [goalId, info]}
    <button
      class="relative py-2 px-3 rounded-lg text-[0.6rem] font-bold tracking-[2px] uppercase transition-all -skew-x-3
        {selected === goalId
          ? 'bg-primary/90 backdrop-blur-sm text-white border-l-2 border-primary shadow-[0_0_12px_rgba(230,57,70,0.2)]'
          : 'bg-surface/80 backdrop-blur-sm border border-white/10 text-dim hover:border-primary/40'}"
      onclick={() => onselect(goalId)}
    >
      <span class="inline-block skew-x-3">{info.emoji} {info.label}</span>
    </button>
  {/each}
</div>

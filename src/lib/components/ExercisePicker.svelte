<script lang="ts">
  import { EXERCISES } from '$lib/ai/exercises.config';
  let { selected, onselect }: { selected: string; onselect: (id: string) => void } = $props();
  const exercises = Object.values(EXERCISES);
</script>
<div class="flex gap-2">
  {#each exercises as ex}
  <div class="flex-1 relative group">
    <!-- Skewed background layer -->
    <div class="absolute inset-0 -skew-x-3 rounded-[12px] transition-colors
      {selected === ex.id ? 'bg-primary/20' : 'bg-transparent group-hover:bg-primary/[0.06]'}"></div>
    <button
      class="relative w-full py-3 rounded-[12px] text-sm font-bold tracking-[2px] uppercase transition-all -skew-x-3
        {selected === ex.id
          ? 'bg-primary/90 backdrop-blur-sm text-white border-l-2 border-primary shadow-[0_0_12px_rgba(230,57,70,0.2)]'
          : 'bg-surface/80 backdrop-blur-sm border border-white/10 text-dim hover:border-primary/40'}"
      onclick={() => onselect(ex.id)}
    >
      <span class="inline-block skew-x-3">{ex.name}</span>
    </button>
  </div>
  {/each}
</div>

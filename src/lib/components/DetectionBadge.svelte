<script lang="ts">
  import { hasDetection } from '$lib/ai/exercises.config';
  let { exerciseId }: { exerciseId: string } = $props();
  const isAI = $derived(hasDetection(exerciseId));
</script>

{#if isAI}
  <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-gold/15 border border-gold/25"
    title="Detection IA par camera">
    <svg class="w-3 h-3 text-gold/80" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
    <span class="text-[0.45rem] font-mono font-bold text-gold/80 tracking-[1px]">IA</span>
  </span>
{:else}
  <span class="inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded bg-white/[0.03] border border-white/[0.06]"
    title="Saisie manuelle">
    <svg class="w-3 h-3 text-dim/40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M17 3a2.83 2.83 0 114 4L7.5 20.5 2 22l1.5-5.5z"/>
    </svg>
  </span>
{/if}

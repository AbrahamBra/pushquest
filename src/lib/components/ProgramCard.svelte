<script lang="ts">
  import type { Program } from '$lib/data/types';
  import { GOAL_INFO, SPLIT_INFO } from '$lib/data/program-service';

  let { program, selected = false, onclick }: {
    program: Program;
    selected?: boolean;
    onclick: () => void;
  } = $props();

  const goal = $derived(GOAL_INFO[program.goal]);
  const split = $derived(SPLIT_INFO[program.split]);
  const meta = $derived(
    `${program.daysPerWeek}j/sem · ${program.durationWeeks} sem · ${split.label}`
  );
</script>

<button
  class="w-full relative group transition-all select-none text-left"
  onclick={() => onclick()}
>
  {#if selected}
    <div class="absolute inset-0 -skew-x-[12deg] rounded-lg"
      style="background: rgba(230,57,70,0.08); animation: pulseGlow 2.5s ease-in-out infinite;"></div>
  {/if}

  <div class="relative backdrop-blur-sm border-l-4 rounded-lg transition-all duration-200 overflow-hidden
    {selected
      ? 'bg-surface/90 border-primary border-y border-r border-white/10 shadow-[0_0_20px_rgba(230,57,70,0.25)]'
      : 'bg-surface/60 border-white/15 border-y border-r border-white/[0.05]'}
    {program.isFree ? 'group-hover:border-primary/50 group-hover:bg-surface/80' : 'opacity-70'}
    -skew-x-[12deg]"
  >
    {#if !program.isFree}
      <div class="absolute inset-0 bg-[repeating-linear-gradient(45deg,transparent,transparent_10px,rgba(255,255,255,0.015)_10px,rgba(255,255,255,0.015)_20px)] pointer-events-none"></div>
    {/if}

    {#if program.isFree}
      <div class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300
        bg-[linear-gradient(rgba(230,57,70,0.04)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none"></div>
    {/if}

    <div class="skew-x-[12deg] flex items-center justify-between px-4 py-4">
      <div class="flex flex-col gap-1.5">
        <!-- Goal tag + name -->
        <div class="flex items-center gap-2">
          {#if selected}
            <span class="w-1.5 h-1.5 rounded-full bg-primary"
              style="animation: statusDot 1.2s ease-in-out infinite; box-shadow: 0 0 6px rgba(230,57,70,0.8)"></span>
          {/if}
          <span class="font-black tracking-[3px] uppercase text-sm
            {selected ? 'text-white' : 'text-white/80'}"
            style="{selected ? 'text-shadow: 0 0 12px rgba(230,57,70,0.6)' : ''}"
          >{program.name}</span>
        </div>
        <!-- Description -->
        <span class="text-[0.6rem] text-dim/70 font-mono tracking-[0.5px] leading-relaxed max-w-[220px] line-clamp-2">
          {program.description}
        </span>
        <!-- Meta -->
        <span class="text-[0.55rem] text-dim/50 font-mono tracking-[1px]">
          {meta}
        </span>
      </div>

      <div class="flex flex-col items-end gap-1">
        {#if !program.isFree}
          <span class="text-gold text-[0.55rem] font-mono tracking-[2px] font-bold"
            style="text-shadow: 0 0 8px rgba(255,209,102,0.5)">PREMIUM</span>
        {/if}
        <span class="text-lg font-mono {selected ? 'text-primary' : 'text-primary/60'}"
          style="{selected ? 'text-shadow: 0 0 15px rgba(230,57,70,0.7)' : ''}">
          {goal.emoji}
        </span>
        <span class="text-[0.5rem] text-dim/50 font-mono tracking-[2px] uppercase">{goal.label}</span>
      </div>
    </div>
  </div>
</button>

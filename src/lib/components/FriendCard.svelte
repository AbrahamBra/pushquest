<script lang="ts">
  import type { FriendInfo } from '$lib/supabase/friends';

  let { friend, onRemove, onChallenge }: {
    friend: FriendInfo;
    onRemove?: (id: string) => void;
    onChallenge?: (id: string) => void;
  } = $props();
</script>

<div class="relative backdrop-blur-sm border-l-4 border-white/15 rounded-lg bg-surface/60
  border-y border-r border-white/[0.05] -skew-x-[10deg] group hover:border-primary/30 hover:bg-surface/80 transition-all">
  <div class="skew-x-[10deg] flex items-center justify-between px-4 py-3">
    <div class="flex items-center gap-3">
      <!-- Level badge -->
      <div class="w-8 h-8 rounded-full bg-primary/20 border border-primary/40 flex items-center justify-center shrink-0">
        <span class="font-mono text-[0.6rem] font-bold text-primary">{friend.level}</span>
      </div>
      <div class="min-w-0">
        <span class="block font-bold tracking-[1.5px] uppercase text-[0.75rem] text-white/85 truncate">{friend.display_name}</span>
        <span class="text-[0.5rem] text-dim/50 font-mono tracking-[1px]">{friend.total_reps} reps total</span>
      </div>
    </div>

    <div class="flex items-center gap-1.5">
      {#if onChallenge}
        <button
          class="px-2 py-1.5 rounded-md bg-primary/15 border border-primary/30 text-[0.5rem] font-bold text-primary tracking-[1px] uppercase
            hover:bg-primary/25 active:scale-95 transition-all"
          onclick={() => onChallenge?.(friend.id)}
          title="Defier"
        >
          ⚔
        </button>
      {/if}
      {#if onRemove}
        <button
          class="px-2 py-1.5 rounded-md bg-white/[0.04] border border-white/[0.06] text-[0.5rem] text-dim/40
            hover:bg-primary/10 hover:text-primary/60 hover:border-primary/20 active:scale-95 transition-all opacity-0 group-hover:opacity-100"
          onclick={() => onRemove?.(friend.id)}
          title="Retirer"
        >
          ✕
        </button>
      {/if}
    </div>
  </div>
</div>

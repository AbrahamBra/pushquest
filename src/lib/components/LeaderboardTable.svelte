<script lang="ts">
  import type { LeaderboardEntry } from '$lib/supabase/friends';

  let { entries, currentUserId }: {
    entries: LeaderboardEntry[];
    currentUserId?: string;
  } = $props();

  const medals = ['🥇', '🥈', '🥉'];
</script>

<div class="flex flex-col gap-1">
  {#each entries as entry, i}
    {@const isMe = entry.user_id === currentUserId}
    <div class="relative backdrop-blur-sm border-l-4 rounded-lg transition-all -skew-x-[8deg]
      {isMe
        ? 'bg-primary/10 border-primary border-y border-r border-primary/20'
        : 'bg-surface/50 border-white/10 border-y border-r border-white/[0.04]'}"
    >
      <div class="skew-x-[8deg] flex items-center justify-between px-3 py-2.5">
        <div class="flex items-center gap-2.5">
          <!-- Rank -->
          <span class="w-6 text-center shrink-0">
            {#if i < 3}
              <span class="text-lg">{medals[i]}</span>
            {:else}
              <span class="font-mono text-[0.6rem] text-dim/40 font-bold">{i + 1}</span>
            {/if}
          </span>
          <!-- Name -->
          <div class="min-w-0">
            <span class="block text-[0.7rem] font-bold tracking-[1px] truncate
              {isMe ? 'text-white' : 'text-white/70'}">
              {entry.display_name} {isMe ? '(toi)' : ''}
            </span>
            <span class="text-[0.5rem] text-dim/40 font-mono">Niv.{entry.level} · {entry.victories} victoires</span>
          </div>
        </div>
        <!-- Reps -->
        <div class="text-right shrink-0">
          <span class="block font-mono text-sm font-black {isMe ? 'text-primary' : 'text-primary/70'}"
            style="{isMe ? 'text-shadow: 0 0 10px rgba(230,57,70,0.5)' : ''}">{entry.total_reps}</span>
          <span class="text-[0.45rem] text-dim/40 font-mono tracking-[1px]">REPS</span>
        </div>
      </div>
    </div>
  {/each}
  {#if entries.length === 0}
    <div class="text-center py-6">
      <p class="text-[0.6rem] text-dim/40 font-mono tracking-[1px]">Aucune donnee cette semaine</p>
    </div>
  {/if}
</div>

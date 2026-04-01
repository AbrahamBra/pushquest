<script lang="ts">
  import type { ChallengeInfo } from '$lib/supabase/friends';
  import { getBoss } from '$lib/game/bosses';

  let { challenge, onAccept }: {
    challenge: ChallengeInfo;
    onAccept: (challenge: ChallengeInfo) => void;
  } = $props();

  const boss = $derived(getBoss(challenge.boss_id));
  const timeAgo = $derived(() => {
    const diff = Date.now() - new Date(challenge.created_at).getTime();
    const hours = Math.floor(diff / 3600000);
    if (hours < 1) return 'Il y a quelques minutes';
    if (hours < 24) return `Il y a ${hours}h`;
    return `Il y a ${Math.floor(hours / 24)}j`;
  });
</script>

<div class="relative backdrop-blur-sm border-l-4 border-gold/50 rounded-lg bg-surface/70
  border-y border-r border-gold/20 -skew-x-[10deg]"
  style="box-shadow: 0 0 15px rgba(255,209,102,0.1)">
  <div class="skew-x-[10deg] px-4 py-3">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <span class="text-gold text-sm">⚔</span>
        <span class="font-bold tracking-[1.5px] uppercase text-[0.7rem] text-gold/90">DEFI</span>
      </div>
      <span class="text-[0.5rem] text-dim/40 font-mono">{timeAgo()}</span>
    </div>
    <p class="text-[0.6rem] text-dim/70 font-mono mb-2">
      <strong class="text-white/80">{challenge.sender_name}</strong> (Niv.{challenge.sender_level}) t'a defie :
    </p>
    <div class="flex items-center justify-between bg-surface/50 rounded-md px-3 py-2 mb-2">
      <div>
        <span class="text-[0.6rem] font-bold text-white/80 tracking-[1px] uppercase">{boss?.name ?? challenge.boss_id}</span>
        <span class="block text-[0.5rem] text-dim/50 font-mono">{challenge.sender_reps} reps en {Math.floor(challenge.sender_time_secs / 60)}min</span>
      </div>
      <span class="text-primary font-mono font-bold text-sm">{challenge.sender_reps}</span>
    </div>
    <button
      class="w-full py-2.5 bg-gold/20 border border-gold/40 text-gold font-bold text-[0.65rem] tracking-[3px] uppercase rounded-lg
        hover:bg-gold/30 active:scale-[0.97] transition-all"
      style="text-shadow: 0 0 8px rgba(255,209,102,0.4)"
      onclick={() => onAccept(challenge)}
    >
      ACCEPTER LE DEFI
    </button>
  </div>
</div>

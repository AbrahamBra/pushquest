<script lang="ts">
  import { goto } from '$app/navigation';
  import { challengeStore } from '$lib/stores/challenges';
  import { fly } from 'svelte/transition';

  let visible = $state(false);
  let count = $derived($challengeStore?.count ?? 0);

  $effect(() => {
    if (count > 0 && typeof sessionStorage !== 'undefined') {
      const shown = sessionStorage.getItem('pushquest_toast_shown');
      if (!shown) {
        visible = true;
        sessionStorage.setItem('pushquest_toast_shown', '1');
        setTimeout(() => { visible = false; }, 4000);
      }
    }
  });

  function handleClick() {
    visible = false;
    goto('/friends');
  }
</script>

{#if visible}
  <button
    role="alert"
    class="fixed top-4 left-1/2 -translate-x-1/2 z-[60] max-w-[360px] w-[calc(100%-2rem)]
      bg-[#0a0a14]/95 backdrop-blur-md border border-[#FFD166]/30 rounded-xl
      px-4 py-3 flex items-center gap-3 cursor-pointer
      shadow-[0_0_20px_rgba(255,209,102,0.15)]"
    onclick={handleClick}
    transition:fly={{ y: -20, duration: 300 }}
  >
    <span class="text-xl">⚔️</span>
    <span class="font-mono text-[0.65rem] tracking-[1px] text-[#FFD166]">
      {count === 1 ? '1 guerrier te defie !' : `${count} guerriers te defient !`}
    </span>
    <span class="ml-auto text-[#6B7280]/40 text-xs">→</span>
  </button>
{/if}

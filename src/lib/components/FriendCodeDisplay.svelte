<script lang="ts">
  let { code }: { code: string } = $props();
  let copied = $state(false);

  async function copyCode(): Promise<void> {
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => { copied = false; }, 2000);
    } catch {}
  }
</script>

<div class="flex items-center justify-between bg-surface/80 border border-white/[0.08] rounded-xl px-4 py-3">
  <div class="flex flex-col gap-0.5">
    <span class="font-mono text-[0.5rem] text-dim/50 tracking-[3px] uppercase">Ton code ami</span>
    <span class="font-mono text-2xl font-black tracking-[8px] text-gold"
      style="text-shadow: 0 0 15px rgba(255,209,102,0.4)">{code}</span>
  </div>
  <button
    class="px-3 py-2 rounded-lg text-[0.6rem] font-bold tracking-[2px] uppercase transition-all
      {copied
        ? 'bg-success/20 text-success border border-success/30'
        : 'bg-gold/15 text-gold/80 border border-gold/30 hover:bg-gold/25 active:scale-95'}"
    onclick={copyCode}
  >
    {copied ? 'COPIE !' : 'COPIER'}
  </button>
</div>

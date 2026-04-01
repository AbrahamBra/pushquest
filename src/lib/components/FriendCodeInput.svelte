<script lang="ts">
  let { onSubmit, loading = false }: {
    onSubmit: (code: string) => void;
    loading?: boolean;
  } = $props();

  let code = $state('');
  let error = $state('');

  function handleInput(e: Event): void {
    const input = e.target as HTMLInputElement;
    // Only allow alphanumeric, uppercase, max 6 chars
    code = input.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 6);
    input.value = code;
    error = '';
  }

  function submit(): void {
    if (code.length !== 6) {
      error = 'Le code doit faire 6 caracteres';
      return;
    }
    onSubmit(code);
  }
</script>

<div class="flex flex-col gap-2 w-full">
  <div class="flex gap-2">
    <input
      type="text"
      value={code}
      oninput={handleInput}
      maxlength="6"
      placeholder="CODE AMI"
      class="flex-1 bg-surface/80 border border-white/[0.1] rounded-lg px-3 py-2.5
        font-mono text-lg tracking-[6px] text-center text-white placeholder:text-dim/30
        focus:outline-none focus:border-primary/50 transition-colors uppercase"
    />
    <button
      class="px-4 py-2.5 bg-primary text-white font-bold text-[0.65rem] tracking-[2px] uppercase rounded-lg
        hover:bg-primary-hover active:scale-95 transition-all disabled:opacity-40 disabled:cursor-not-allowed -skew-x-3"
      onclick={submit}
      disabled={code.length !== 6 || loading}
    >
      <span class="inline-block skew-x-3">{loading ? '...' : 'AJOUTER'}</span>
    </button>
  </div>
  {#if error}
    <p class="text-[0.55rem] text-primary font-mono tracking-[1px]">{error}</p>
  {/if}
</div>

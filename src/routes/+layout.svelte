<script lang="ts">
  import '../app.css';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { createClient } from '$lib/supabase/client';
  import { invalidateAll } from '$app/navigation';
  import InstallPrompt from '$lib/components/InstallPrompt.svelte';

  let { data, children } = $props();
  const supabase = createClient();

  onMount(() => {
    const { data: { subscription } } = supabase.auth.onAuthStateChange(() => {
      invalidateAll();
    });
    return () => subscription.unsubscribe();
  });
</script>

<div class="min-h-screen bg-background text-white font-sans">
  {#key page.url.pathname}
    <div style="animation: pageFadeIn 0.2s ease-out both">
      {@render children()}
    </div>
  {/key}
</div>

<InstallPrompt />

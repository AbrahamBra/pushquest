<script lang="ts">
  import { onMount } from 'svelte';
  let container: HTMLDivElement;
  onMount(() => {
    for (let i = 0; i < 40; i++) {
      const star = document.createElement('div');
      const size = Math.random() * 2 + 1;
      star.className = 'absolute rounded-full bg-white';
      star.style.cssText = `width:${size}px;height:${size}px;left:${Math.random()*100}%;top:${Math.random()*100}%;animation:twinkle ${2+Math.random()*3}s infinite alternate ${Math.random()*4}s;`;
      container.appendChild(star);
    }
  });
</script>

<div class="fixed inset-0 pointer-events-none z-0">
  <!-- Grid pattern -->
  <div class="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:40px_40px]"></div>
  <!-- Blur orbs -->
  <div class="absolute top-[-50px] right-[-50px] w-[300px] h-[300px] bg-primary/10 blur-[100px] rounded-full"></div>
  <div class="absolute bottom-[20%] left-[-50px] w-[200px] h-[200px] bg-gold/[0.08] blur-[80px] rounded-full"></div>
  <!-- Stars -->
  <div bind:this={container} class="absolute inset-0"></div>
</div>

<style>
  @keyframes twinkle { from { opacity: 0.05 } to { opacity: 0.6 } }
</style>

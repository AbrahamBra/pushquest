<script lang="ts">
  import { onMount } from 'svelte';
  import type { SpriteConfig, AnimationType, SpriteAnimation } from '$lib/game/sprite-config';

  let {
    sprite,
    animation = 'idle',
    onAnimationEnd,
    class: className = '',
  }: {
    sprite: SpriteConfig;
    animation: AnimationType;
    onAnimationEnd?: () => void;
    class?: string;
  } = $props();

  let canvas: HTMLCanvasElement;
  let frameIndex = $state(0);
  let loadedFrames: Map<string, HTMLImageElement[]> = new Map();
  let rafId: number | null = null;
  let lastFrameTime = 0;

  // Current animation config
  const currentAnim = $derived(sprite.animations[animation]);

  // Build a cache key for an animation
  function animKey(anim: SpriteAnimation): string {
    return `${anim.folder}/${anim.prefix}`;
  }

  // Preload all frames for an animation
  function preloadAnimation(anim: SpriteAnimation): Promise<HTMLImageElement[]> {
    const key = animKey(anim);
    if (loadedFrames.has(key)) return Promise.resolve(loadedFrames.get(key)!);

    const promises: Promise<HTMLImageElement>[] = [];
    for (let i = 1; i <= anim.frames; i++) {
      promises.push(new Promise((resolve, reject) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = reject;
        img.src = `${anim.folder}/${anim.prefix}${i}.png`;
      }));
    }

    return Promise.all(promises).then(imgs => {
      loadedFrames.set(key, imgs);
      return imgs;
    });
  }

  // Preload all animations for this sprite
  async function preloadAll(): Promise<void> {
    const anims = Object.values(sprite.animations).filter((a): a is SpriteAnimation => a !== null);
    await Promise.all(anims.map(a => preloadAnimation(a)));
  }

  // Render loop
  function renderLoop(timestamp: number): void {
    const anim = sprite.animations[animation];
    if (!anim || !canvas) return;

    const key = animKey(anim);
    const frames = loadedFrames.get(key);
    if (!frames || frames.length === 0) {
      rafId = requestAnimationFrame(renderLoop);
      return;
    }

    const interval = 1000 / anim.fps;
    if (timestamp - lastFrameTime >= interval) {
      lastFrameTime = timestamp;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = frames[frameIndex];
      if (img) {
        // Size canvas to image (scaled)
        const w = img.naturalWidth * sprite.scale;
        const h = img.naturalHeight * sprite.scale;
        canvas.width = w;
        canvas.height = h;

        ctx.clearRect(0, 0, w, h);
        ctx.imageSmoothingEnabled = false; // Pixel art crisp
        ctx.drawImage(img, 0, 0, w, h);
      }

      // Advance frame
      const nextFrame = frameIndex + 1;
      if (nextFrame >= anim.frames) {
        if (anim.loop) {
          frameIndex = 0;
        } else {
          // Stay on last frame, signal end
          onAnimationEnd?.();
          // Keep rendering last frame but don't advance
          rafId = requestAnimationFrame(renderLoop);
          return;
        }
      } else {
        frameIndex = nextFrame;
      }
    }

    rafId = requestAnimationFrame(renderLoop);
  }

  // Reset frame index when animation type changes
  $effect(() => {
    // Access animation to track it
    const _anim = animation;
    frameIndex = 0;
    lastFrameTime = 0;
  });

  onMount(() => {
    preloadAll().then(() => {
      rafId = requestAnimationFrame(renderLoop);
    });

    return () => {
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  });
</script>

<canvas
  bind:this={canvas}
  class="pointer-events-none {className}"
  style="image-rendering: pixelated;"
></canvas>

<script lang="ts">
  import { onMount } from 'svelte';
  import { initDetector, detectPose, isDetectorReady } from '$lib/ai/pose-detector';
  import { createExerciseDetector, type ExerciseDetector } from '$lib/ai/exercise-detector';
  import type { ExerciseConfig } from '$lib/ai/exercises.config';

  // MoveNet skeleton connections
  const CONNECTIONS: [string, string][] = [
    ['nose','left_eye'],['nose','right_eye'],
    ['left_eye','left_ear'],['right_eye','right_ear'],
    ['left_shoulder','right_shoulder'],
    ['left_shoulder','left_elbow'],['left_elbow','left_wrist'],
    ['right_shoulder','right_elbow'],['right_elbow','right_wrist'],
    ['left_shoulder','left_hip'],['right_shoulder','right_hip'],
    ['left_hip','right_hip'],
    ['left_hip','left_knee'],['right_hip','right_knee'],
    ['left_knee','left_ankle'],['right_knee','right_ankle'],
  ];

  let {
    exerciseConfig,
    active = false,
    paused = false,
    onRep,
    onFormUpdate,
    onLoadingMsg,
    onReady,
    onError,
  }: {
    exerciseConfig: ExerciseConfig;
    active: boolean;
    paused: boolean;
    onRep: () => void;
    onFormUpdate?: (score: number) => void;
    onLoadingMsg?: (msg: string) => void;
    onReady?: () => void;
    onError?: (msg: string) => void;
  } = $props();

  let canvasEl: HTMLCanvasElement | undefined = $state();
  let videoEl: HTMLVideoElement | undefined = $state();
  let detector: ExerciseDetector | null = null;
  let animHandle = 0;
  let stream: MediaStream | null = null;

  function renderLoop(): void {
    if (!active || !canvasEl || !videoEl) return;

    const ctx = canvasEl.getContext('2d');
    if (!ctx) return;

    if (canvasEl.width !== canvasEl.offsetWidth) canvasEl.width = canvasEl.offsetWidth;
    if (canvasEl.height !== canvasEl.offsetHeight) canvasEl.height = canvasEl.offsetHeight;

    const W = canvasEl.width, H = canvasEl.height;

    // Draw mirrored video
    ctx.save();
    ctx.translate(W, 0);
    ctx.scale(-1, 1);
    if (videoEl.readyState >= 2) {
      const vw = videoEl.videoWidth || W, vh = videoEl.videoHeight || H;
      const scale = Math.max(W / vw, H / vh);
      const dw = vw * scale, dh = vh * scale;
      ctx.drawImage(videoEl, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }
    ctx.restore();

    // Pose detection + skeleton
    if (!paused && videoEl.readyState >= 2 && isDetectorReady()) {
      detectPose(videoEl).then((keypoints) => {
        if (!active || !canvasEl || keypoints.length === 0) return;
        const cCtx = canvasEl.getContext('2d');
        if (!cCtx) return;

        const cW = canvasEl.width, cH = canvasEl.height;
        const vw = videoEl!.videoWidth || cW, vh = videoEl!.videoHeight || cH;
        const scale = Math.max(cW / vw, cH / vh);
        const ox = (cW - vw * scale) / 2, oy = (cH - vh * scale) / 2;

        const scaled = keypoints.map(k => ({
          name: k.name, score: k.score,
          x: cW - (k.x * scale + ox), y: k.y * scale + oy,
        }));
        const sm = Object.fromEntries(scaled.map(k => [k.name, k]));

        // Draw skeleton
        cCtx.lineWidth = 3; cCtx.lineCap = 'round';
        for (const [a, b] of CONNECTIONS) {
          const ka = sm[a], kb = sm[b];
          if (ka && kb && ka.score > 0.3 && kb.score > 0.3) {
            cCtx.beginPath(); cCtx.strokeStyle = 'rgba(255,60,60,0.85)';
            cCtx.moveTo(ka.x, ka.y); cCtx.lineTo(kb.x, kb.y); cCtx.stroke();
          }
        }
        for (const k of scaled) {
          if (k.score > 0.3) {
            cCtx.beginPath(); cCtx.arc(k.x, k.y, 5, 0, 2 * Math.PI);
            cCtx.fillStyle = '#ff3a3a'; cCtx.fill();
            cCtx.strokeStyle = 'rgba(255,255,255,0.6)'; cCtx.lineWidth = 1.5; cCtx.stroke();
          }
        }

        // Exercise detection
        if (detector) {
          const prevReps = detector.getReps();
          detector.processFrame(keypoints);
          const newReps = detector.getReps();
          if (onFormUpdate) onFormUpdate(detector.getFormScore() * 100);
          if (newReps > prevReps) onRep();
        }
      }).catch(() => {});
    }

    animHandle = requestAnimationFrame(renderLoop);
  }

  function stopCamera(): void {
    if (stream) { stream.getTracks().forEach(t => t.stop()); stream = null; }
    if (videoEl?.srcObject) { videoEl.srcObject = null; }
    cancelAnimationFrame(animHandle);
  }

  onMount(() => {
    detector = createExerciseDetector(exerciseConfig);

    async function init(): Promise<void> {
      onLoadingMsg?.('DEMARRAGE...');
      try {
        const [mediaStream] = await Promise.all([
          navigator.mediaDevices.getUserMedia({
            video: { facingMode: 'user', width: { ideal: 640 }, height: { ideal: 480 } },
          }),
          initDetector((msg) => { onLoadingMsg?.(msg.toUpperCase()); }),
        ]);
        stream = mediaStream;
        if (!videoEl) return;
        videoEl.srcObject = stream;
        await videoEl.play();
        onReady?.();
        renderLoop();
      } catch (e) {
        const msg = (e as Error)?.message?.includes('Permission') ? 'CAMERA REFUSEE' : 'ECHEC CHARGEMENT';
        onError?.(msg);
      }
    }

    init();
    return () => { stopCamera(); };
  });

  // Restart loop when active changes
  $effect(() => {
    if (active && canvasEl && videoEl) {
      cancelAnimationFrame(animHandle);
      renderLoop();
    }
  });
</script>

<div class="relative w-full h-full">
  <video bind:this={videoEl} class="hidden" autoplay playsinline muted></video>
  <canvas bind:this={canvasEl} class="absolute inset-0 w-full h-full"></canvas>
</div>

type SoundName = 'rep' | 'warning' | 'victory' | 'defeat' | 'levelup' | 'countdown';

const audioCache = new Map<SoundName, HTMLAudioElement>();

const SOUND_URLS: Record<SoundName, string> = {
  rep: '/sounds/rep.wav',
  warning: '/sounds/warning.wav',
  victory: '/sounds/victory.wav',
  defeat: '/sounds/defeat.wav',
  levelup: '/sounds/levelup.wav',
  countdown: '/sounds/countdown.wav',
};

export function preloadSounds(): void {
  if (typeof window === 'undefined') return;
  for (const [name, url] of Object.entries(SOUND_URLS)) {
    const audio = new Audio(url);
    audio.preload = 'auto';
    audioCache.set(name as SoundName, audio);
  }
}

export function playSound(name: SoundName): void {
  const audio = audioCache.get(name);
  if (!audio) return;
  const clone = audio.cloneNode() as HTMLAudioElement;
  clone.volume = name === 'rep' ? 0.6 : 0.8;
  clone.play().catch(() => {});
}

/**
 * Play a sound with random pitch variation for variety.
 * pitchRange: [min, max] multiplier (e.g. [0.85, 1.15])
 */
export function playSoundPitched(name: SoundName, pitchRange: [number, number] = [0.85, 1.15]): void {
  const audio = audioCache.get(name);
  if (!audio) return;
  const clone = audio.cloneNode() as HTMLAudioElement;
  clone.volume = name === 'rep' ? 0.6 : 0.8;
  clone.preservesPitch = false;
  clone.playbackRate = pitchRange[0] + Math.random() * (pitchRange[1] - pitchRange[0]);
  clone.play().catch(() => {});
}

/**
 * Trigger haptic vibration on mobile (Android).
 * Does nothing on unsupported devices.
 */
export function vibrate(pattern: number | number[]): void {
  if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
    navigator.vibrate(pattern);
  }
}

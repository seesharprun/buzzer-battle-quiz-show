'use client';

// Simple sound effect system
class SoundEffect {
  private audio: HTMLAudioElement | null = null;
  private loaded = false;
  
  constructor(private src: string) {
    if (typeof window !== 'undefined') {
      this.audio = new Audio(src);
      this.audio.addEventListener('canplaythrough', () => {
        this.loaded = true;
      });
      this.audio.load();
    }
  }
  
  play() {
    if (this.audio && this.loaded) {
      // Clone the audio to allow overlapping sounds
      const sound = this.audio.cloneNode() as HTMLAudioElement;
      sound.volume = 0.5; // Adjust volume as needed
      sound.play().catch(e => console.warn('Error playing sound:', e));
      return sound;
    }
    return null;
  }
}

// Game sound effects
export const sounds = {
  buzzer: new SoundEffect('/sounds/buzzer.mp3'),
  correct: new SoundEffect('/sounds/correct.mp3'),
  wrong: new SoundEffect('/sounds/wrong.mp3'),
  gameStart: new SoundEffect('/sounds/game-start.mp3'),
  tick: new SoundEffect('/sounds/tick.mp3'),
};

// Audio context for more advanced sounds if needed
let audioContext: AudioContext | null = null;

export function getAudioContext() {
  if (typeof window !== 'undefined' && !audioContext) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (AudioContextClass) {
        audioContext = new AudioContextClass();
      }
    } catch (e) {
      console.warn('Web Audio API not supported:', e);
    }
  }
  return audioContext;
}

// Create a simple synth sound
export function playTone(frequency: number, duration: number, type: OscillatorType = 'sine') {
  const ctx = getAudioContext();
  if (!ctx) return;
  
  const oscillator = ctx.createOscillator();
  const gain = ctx.createGain();
  
  oscillator.type = type;
  oscillator.frequency.setValueAtTime(frequency, ctx.currentTime);
  
  gain.gain.setValueAtTime(0.5, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
  
  oscillator.connect(gain);
  gain.connect(ctx.destination);
  
  oscillator.start();
  oscillator.stop(ctx.currentTime + duration);
}
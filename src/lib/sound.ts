// Subtle Web Audio API Synthesizer for Tactile Haptic Audio Feedback

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  constructor() {
    // Lazy init audio context on user interaction
    if (typeof window !== "undefined") {
      const savedMute = localStorage.getItem("sound_muted");
      this.isMuted = savedMute === "true";
    }
  }

  private getContext(): AudioContext | null {
    if (this.isMuted) return null;
    if (!this.ctx && typeof window !== "undefined") {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  public toggleSound(): boolean {
    this.isMuted = !this.isMuted;
    if (typeof window !== "undefined") {
      localStorage.setItem("sound_muted", String(this.isMuted));
    }
    if (!this.isMuted) {
      this.playTick(1200, 0.04);
    }
    return !this.isMuted;
  }

  public getIsMuted(): boolean {
    return this.isMuted;
  }

  public triggerHaptics(pattern: number | number[] = 8) {
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch (e) {
        // Ignore vibration errors
      }
    }
  }

  public playTick(frequency = 900, duration = 0.02, volume = 0.025) {
    if (this.isMuted) return;
    const ctx = this.getContext();
    if (!ctx) return;

    try {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(frequency, ctx.currentTime);

      gain.gain.setValueAtTime(volume, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {
      // Ignore audio synthesis errors
    }
  }

  public playClick() {
    this.playTick(1100, 0.015, 0.02);
    this.triggerHaptics(6);
  }

  public playScrollTick() {
    this.playTick(600 + Math.random() * 300, 0.01, 0.01);
  }

  public playDecryptTick() {
    this.playTick(1400 + Math.random() * 400, 0.015, 0.015);
  }
}

export const sound = new SoundEngine();

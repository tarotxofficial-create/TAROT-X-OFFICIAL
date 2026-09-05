// TAROT X OFFICIAL — Web Audio API Solfeggio Frequency & Celestial Sound Engine

class SacredSoundEngine {
  constructor() {
    this.ctx = null;
    this.ambientOsc = null;
    this.ambientGain = null;
    this.isPlayingAmbient = false;
    this.currentFrequency = 432; // 432Hz Solfeggio Default
  }

  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      this.ctx = new AudioContext();
    }
    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  // Play an ethereal crystal singing bowl chime upon drawing/flipping cards
  playCardFlipSound() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      // Dual frequencies for harmonic resonance
      osc.type = 'sine';
      osc.frequency.setValueAtTime(528, now); // 528Hz Transformation tone
      osc.frequency.exponentialRampToValueAtTime(852, now + 0.4);

      gain.gain.setValueAtTime(0.001, now);
      gain.gain.linearRampToValueAtTime(0.18, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 1.25);
    } catch (e) {
      console.warn('Audio sound playback skipped:', e);
    }
  }

  // Play a deep Tibetan gong / oracle awakening resonance
  playOracleChime() {
    try {
      this.init();
      if (!this.ctx) return;

      const now = this.ctx.currentTime;
      [432, 864, 1296].forEach((freq, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        const volume = (0.15 / (i + 1));
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(volume, now + 0.08);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 2.6);
      });
    } catch (e) {
      console.warn('Audio chime skipped:', e);
    }
  }

  // Continuous Solfeggio 432Hz / 528Hz Ambient Meditation Drone
  toggleAmbientSound(freq = 432) {
    this.init();
    if (!this.ctx) return false;

    if (this.isPlayingAmbient) {
      this.stopAmbientSound();
      return false;
    } else {
      this.startAmbientSound(freq);
      return true;
    }
  }

  startAmbientSound(freq = 432) {
    try {
      this.init();
      if (this.isPlayingAmbient) this.stopAmbientSound();

      const now = this.ctx.currentTime;
      this.currentFrequency = freq;

      // Base Carrier Oscillator
      this.ambientOsc = this.ctx.createOscillator();
      this.ambientGain = this.ctx.createGain();

      // Low Pass Filter for warm cosmic drone
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, now);

      this.ambientOsc.type = 'sine';
      this.ambientOsc.frequency.setValueAtTime(freq, now);

      this.ambientGain.gain.setValueAtTime(0.001, now);
      this.ambientGain.gain.linearRampToValueAtTime(0.08, now + 2); // Soft gentle fade in

      this.ambientOsc.connect(filter);
      filter.connect(this.ambientGain);
      this.ambientGain.connect(this.ctx.destination);

      this.ambientOsc.start(now);
      this.isPlayingAmbient = true;
    } catch (e) {
      console.warn('Could not start ambient drone:', e);
      this.isPlayingAmbient = false;
    }
  }

  stopAmbientSound() {
    if (this.ambientOsc && this.ambientGain && this.ctx) {
      const now = this.ctx.currentTime;
      this.ambientGain.gain.linearRampToValueAtTime(0.0001, now + 1);
      setTimeout(() => {
        try {
          if (this.ambientOsc) {
            this.ambientOsc.stop();
            this.ambientOsc.disconnect();
            this.ambientOsc = null;
          }
        } catch (e) {
          // ignore cleanup errors
        }
      }, 1100);
    }
    this.isPlayingAmbient = false;
  }
}

export const soundEngine = new SacredSoundEngine();

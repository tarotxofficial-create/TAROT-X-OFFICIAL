// Antigravity Audio Engine - Web Audio API Synthesizer
// Provides 432Hz deep space drone and synthesized tactile UI sound effects

class AntigravityAudioEngine {
  constructor() {
    this.ctx = null;
    this.isMuted = true;
    this.droneGain = null;
    this.masterGain = null;
    this.droneOsc1 = null;
    this.droneOsc2 = null;
    this.isInitialized = false;
  }

  init() {
    if (this.isInitialized) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      this.masterGain.connect(this.ctx.destination);

      this.isInitialized = true;
    } catch (e) {
      console.warn('AudioContext not supported or blocked:', e);
    }
  }

  toggleAudio() {
    this.init();
    if (!this.ctx) return false;

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }

    this.isMuted = !this.isMuted;

    if (!this.isMuted) {
      this.startAmbientDrone();
    } else {
      this.stopAmbientDrone();
    }

    return !this.isMuted;
  }

  startAmbientDrone() {
    if (!this.ctx || this.isMuted) return;

    if (this.droneOsc1) return; // Already running

    try {
      const now = this.ctx.currentTime;
      
      // Dual oscillators for 432Hz sub-bass drone harmonic texture
      this.droneOsc1 = this.ctx.createOscillator();
      this.droneOsc2 = this.ctx.createOscillator();
      
      // Base frequency 432Hz octave dropped to deep rumble (54Hz / 108Hz)
      this.droneOsc1.type = 'sawtooth';
      this.droneOsc1.frequency.setValueAtTime(54, now); // 432 / 8 = 54Hz deep sub-bass

      this.droneOsc2.type = 'sine';
      this.droneOsc2.frequency.setValueAtTime(108, now); // 432 / 4 = 108Hz resonant harmonic

      // Lowpass filter to muffle into deep space ambient rumble
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(140, now);
      filter.Q.setValueAtTime(3.0, now);

      this.droneGain = this.ctx.createGain();
      this.droneGain.gain.setValueAtTime(0.001, now);
      this.droneGain.gain.exponentialRampToValueAtTime(0.18, now + 3);

      this.droneOsc1.connect(filter);
      this.droneOsc2.connect(filter);
      filter.connect(this.droneGain);
      this.droneGain.connect(this.masterGain);

      this.droneOsc1.start();
      this.droneOsc2.start();
    } catch (e) {
      console.warn('Could not start drone:', e);
    }
  }

  stopAmbientDrone() {
    if (!this.ctx || !this.droneGain) return;
    try {
      const now = this.ctx.currentTime;
      this.droneGain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      setTimeout(() => {
        if (this.droneOsc1) {
          this.droneOsc1.stop();
          this.droneOsc1.disconnect();
          this.droneOsc1 = null;
        }
        if (this.droneOsc2) {
          this.droneOsc2.stop();
          this.droneOsc2.disconnect();
          this.droneOsc2 = null;
        }
      }, 600);
    } catch (e) {
      console.warn('Error stopping drone:', e);
    }
  }

  // Mechanical micro-click for card hover & navigation
  playMechanicalClick() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(1800, now);
      osc.frequency.exponentialRampToValueAtTime(300, now + 0.03);

      filter.type = 'bandpass';
      filter.frequency.setValueAtTime(2400, now);

      gain.gain.setValueAtTime(0.12, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.03);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.masterGain);

      osc.start(now);
      osc.stop(now + 0.035);
    } catch (e) {
      // ignore
    }
  }

  // Heavy pneumatic lock sound on booking / slot selection
  playPneumaticLock() {
    if (!this.ctx || this.isMuted) return;
    try {
      const now = this.ctx.currentTime;
      
      // Low air burst
      const noiseBuffer = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.2, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = Math.random() * 2 - 1;
      }
      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const noiseFilter = this.ctx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(800, now);
      noiseFilter.frequency.exponentialRampToValueAtTime(100, now + 0.18);

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.2, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);

      whiteNoise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(this.masterGain);

      // Heavy metallic latch thud
      const thudOsc = this.ctx.createOscillator();
      const thudGain = this.ctx.createGain();
      thudOsc.type = 'sine';
      thudOsc.frequency.setValueAtTime(180, now + 0.04);
      thudOsc.frequency.exponentialRampToValueAtTime(38, now + 0.2);

      thudGain.gain.setValueAtTime(0.35, now + 0.04);
      thudGain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

      thudOsc.connect(thudGain);
      thudGain.connect(this.masterGain);

      whiteNoise.start(now);
      thudOsc.start(now + 0.04);
      thudOsc.stop(now + 0.26);
    } catch (e) {
      // ignore
    }
  }
}

export const audioEngine = new AntigravityAudioEngine();

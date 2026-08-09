// Web Audio API Retro Sound Effects & Chiptune Audio Synthesizer

class RetroAudioEngine {
  constructor() {
    this.ctx = null;
    this.muted = localStorage.getItem('antigames_muted') === 'true';
    this.volume = 0.3;
    this.musicPlaying = false;
    this.musicInterval = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    localStorage.setItem('antigames_muted', this.muted);
    return this.muted;
  }

  // Play a simple synthesized retro tone
  playTone(freq, type = 'square', duration = 0.1, startVol = 0.2, endVol = 0.01) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

      gain.gain.setValueAtTime(startVol * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(Math.max(endVol, 0.0001), this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  // Frequency slide for retro sweep sounds (lasers, portals, explosions)
  playSweep(startFreq, endFreq, type = 'sawtooth', duration = 0.15, vol = 0.25) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(startFreq, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(Math.max(endFreq, 10), this.ctx.currentTime + duration);

      gain.gain.setValueAtTime(vol * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn('Audio sweep error:', e);
    }
  }

  // Noise generator for explosive anti-matter blasts or sand rustle
  playNoise(duration = 0.2, vol = 0.3) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const bufferSize = this.ctx.sampleRate * duration;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = buffer.getChannelData(0);

      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = buffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.linearRampToValueAtTime(100, this.ctx.currentTime + duration);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(vol * this.volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);

      whiteNoise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);

      whiteNoise.start();
    } catch (e) {
      console.warn('Noise play error:', e);
    }
  }

  // SFX Actions
  sfxDropSand() {
    // Subtle retro tick with small pitch variance
    const freq = 400 + Math.random() * 200;
    this.playTone(freq, 'triangle', 0.04, 0.08, 0.001);
  }

  sfxLaserZap() {
    this.playSweep(1200, 200, 'sawtooth', 0.1, 0.3);
  }

  sfxPortalWarp() {
    this.playSweep(300, 1400, 'sine', 0.2, 0.25);
  }

  sfxElectricitySpark() {
    this.playSweep(800, 1100, 'square', 0.06, 0.15);
  }

  sfxAntiMatterExplode() {
    this.playNoise(0.25, 0.4);
    this.playSweep(300, 40, 'triangle', 0.25, 0.35);
  }

  sfxGoalTriggered(number = 1) {
    // Harmonious ascending notes for 1 -> 2 -> 3
    const freqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const f = freqs[(number - 1) % freqs.length] || 523;
    this.playTone(f, 'sine', 0.3, 0.4, 0.01);
    setTimeout(() => {
      this.playTone(f * 1.25, 'triangle', 0.2, 0.3, 0.01);
    }, 80);
  }

  sfxDoorOpen() {
    this.playSweep(150, 400, 'square', 0.18, 0.2);
  }

  sfxVictoryFanfare() {
    if (this.muted) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C E G C
    notes.forEach((note, index) => {
      setTimeout(() => {
        this.playTone(note, 'square', 0.2, 0.3, 0.01);
      }, index * 120);
    });
  }

  sfxFail() {
    this.playSweep(300, 100, 'sawtooth', 0.3, 0.2);
  }
}

export const SFX = new RetroAudioEngine();

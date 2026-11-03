// Web Audio API 8-Bit Chiptune Sound Engine
class RetroAudio {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.bgmPlaying = false;
    this.bgmTimer = null;
    this.hbdTimer = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startTime = 0, gainLevel = 0.15) {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + startTime);

      gain.gain.setValueAtTime(gainLevel, this.ctx.currentTime + startTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + startTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(this.ctx.currentTime + startTime);
      osc.stop(this.ctx.currentTime + startTime + duration);
    } catch (e) {
      // Audio fallback silent
    }
  }

  jump() {
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "square";
      const now = this.ctx.currentTime;
      osc.frequency.setValueAtTime(150, now);
      osc.frequency.exponentialRampToValueAtTime(600, now + 0.12);
      gain.gain.setValueAtTime(0.12, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.12);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.12);
    } catch (e) {}
  }

  collect() {
    this.playTone(523.25, "square", 0.08, 0, 0.12);     // C5
    this.playTone(659.25, "square", 0.08, 0.07, 0.12);  // E5
    this.playTone(783.99, "square", 0.15, 0.14, 0.15);  // G5
  }

  key() {
    this.playTone(440.00, "triangle", 0.08, 0, 0.15);
    this.playTone(554.37, "triangle", 0.08, 0.08, 0.15);
    this.playTone(659.25, "triangle", 0.08, 0.16, 0.15);
    this.playTone(880.00, "square", 0.25, 0.24, 0.18);
  }

  hurt() {
    this.playTone(220, "sawtooth", 0.12, 0, 0.15);
    this.playTone(160, "sawtooth", 0.15, 0.08, 0.15);
  }

  clawWhoosh() {
    this.playTone(800, "square", 0.04, 0, 0.05);
    this.playTone(600, "square", 0.04, 0.03, 0.05);
  }

  blowCandle() {
    // Noise burst simulation
    if (this.muted) return;
    this.init();
    if (!this.ctx) return;
    try {
      const bufferSize = this.ctx.sampleRate * 0.4;
      const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = this.ctx.createBufferSource();
      noise.buffer = buffer;
      const filter = this.ctx.createBiquadFilter();
      filter.type = "lowpass";
      filter.frequency.setValueAtTime(800, this.ctx.currentTime);
      filter.frequency.exponentialRampToValueAtTime(100, this.ctx.currentTime + 0.4);

      const gain = this.ctx.createGain();
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.linearRampToValueAtTime(0.01, this.ctx.currentTime + 0.4);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(this.ctx.destination);
      noise.start();
    } catch (e) {}
  }

  startBGM() {
    if (this.bgmPlaying) return;
    this.init();
    this.bgmPlaying = true;

    // Sweet romantic retro melody loop
    const notes = [
      { f: 392.00, d: 0.25 }, // G4
      { f: 440.00, d: 0.25 }, // A4
      { f: 493.88, d: 0.25 }, // B4
      { f: 587.33, d: 0.5 },  // D5
      { f: 493.88, d: 0.25 }, // B4
      { f: 440.00, d: 0.5 },  // A4
      { f: 392.00, d: 0.25 }, // G4
      { f: 329.63, d: 0.5 },  // E4
      { f: 392.00, d: 0.5 },  // G4
      { f: 440.00, d: 0.75 }  // A4
    ];

    let step = 0;
    const playNext = () => {
      if (!this.bgmPlaying || this.muted) {
        this.bgmTimer = setTimeout(playNext, 400);
        return;
      }
      const item = notes[step % notes.length];
      this.playTone(item.f, "triangle", item.d * 0.8, 0, 0.06);
      step++;
      this.bgmTimer = setTimeout(playNext, item.d * 1000);
    };
    playNext();
  }

  stopBGM() {
    this.bgmPlaying = false;
    if (this.bgmTimer) clearTimeout(this.bgmTimer);
  }

  playHappyBirthdayTune() {
    this.stopBGM();
    this.init();

    // Happy Birthday melody notes: [freq, beatDuration]
    const C4 = 261.63, D4 = 293.66, E4 = 329.63, F4 = 349.23, G4 = 392.00, A4 = 440.00, B4 = 493.88;
    const C5 = 523.25, D5 = 587.33, E5 = 659.25, F5 = 698.46, Bb4 = 466.16;

    const melody = [
      [G4, 0.3], [G4, 0.15], [A4, 0.45], [G4, 0.45], [C5, 0.45], [B4, 0.9],
      [G4, 0.3], [G4, 0.15], [A4, 0.45], [G4, 0.45], [D5, 0.45], [C5, 0.9],
      [G4, 0.3], [G4, 0.15], [G4 * 2, 0.45], [E5, 0.45], [C5, 0.45], [B4, 0.45], [A4, 0.7],
      [F5, 0.3], [F5, 0.15], [E5, 0.45], [C5, 0.45], [D5, 0.45], [C5, 1.2]
    ];

    let timeOffset = 0;
    melody.forEach(([freq, dur]) => {
      setTimeout(() => {
        if (!this.muted) {
          this.playTone(freq, "square", dur * 0.9, 0, 0.18);
          // Harmony voice
          this.playTone(freq * 0.5, "triangle", dur * 0.9, 0, 0.1);
        }
      }, timeOffset * 1000);
      timeOffset += dur;
    });
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }
}

const audio = new RetroAudio();

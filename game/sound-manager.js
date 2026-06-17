/* ═══════════════════════════════════════════════════════════════
   TapFlow — Procedural Sound Manager
   Synthesizes all game sounds using Web Audio API
   No external audio files needed — everything is code-generated
   ═══════════════════════════════════════════════════════════════ */

// ─── Master Configuration ───────────────────────────────────
const SOUND_CONFIG = {
  masterVolume: 0.35,       // Master gain (0-1)
};

// ─── State ──────────────────────────────────────────────────
let audioCtx = null;
let initialized = false;

// ─── Lazy-init AudioContext on first user interaction ───────
function initAudio() {
  if (initialized) return true;
  try {
    audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    initialized = true;

    // Resume if suspended (autoplay policy)
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }

    console.log('🔊 Audio context initialized');
    return true;
  } catch (err) {
    console.warn('🔊 Web Audio API not available:', err);
    return false;
  }
}

// ─── Utility: create gain node ──────────────────────────────
function createGain(volume = 1, duration = 0) {
  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(volume * SOUND_CONFIG.masterVolume, audioCtx.currentTime);
  if (duration > 0) {
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  }
  gain.connect(audioCtx.destination);
  return gain;
}

// ─── Utility: play a tone ───────────────────────────────────
function playTone(freq, type, duration, volume = 1, rampDown = true) {
  if (!initAudio()) return;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();

  osc.type = type;
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime);

  gain.gain.setValueAtTime(volume * SOUND_CONFIG.masterVolume, audioCtx.currentTime);
  if (rampDown) {
    gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
  }

  osc.connect(gain);
  gain.connect(audioCtx.destination);

  osc.start(audioCtx.currentTime);
  osc.stop(audioCtx.currentTime + duration);
}

// ─── 1. Lane Switch — quick swoosh/glide ────────────────────
function playSwitch() {
  if (!initAudio()) return;

  const duration = 0.12;
  const osc = audioCtx.createOscillator();
  const gain = audioCtx.createGain();
  const filter = audioCtx.createBiquadFilter();

  // White noise swoosh by using a short noise burst through a filter
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  // Bandpass filter sweeps up quickly
  filter.type = 'bandpass';
  filter.frequency.setValueAtTime(800, audioCtx.currentTime);
  filter.frequency.exponentialRampToValueAtTime(3000, audioCtx.currentTime + duration);
  filter.Q.setValueAtTime(2, audioCtx.currentTime);

  gain.gain.setValueAtTime(0.4 * SOUND_CONFIG.masterVolume, audioCtx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  noise.start(audioCtx.currentTime);
  noise.stop(audioCtx.currentTime + duration);
}

// ─── 2. Gem Collect — bright ding/chime ─────────────────────
function playGem() {
  if (!initAudio()) return;

  const duration = 0.25;
  const now = audioCtx.currentTime;

  // Two overlapping sine waves for a rich chime
  const freqs = [1760, 2640]; // A6 + E7 (chord)

  freqs.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'sine';
    // Pitch bend up
    osc.frequency.setValueAtTime(freq * 0.8, now);
    osc.frequency.exponentialRampToValueAtTime(freq, now + 0.05);

    const vol = 0.3 - i * 0.08;
    gain.gain.setValueAtTime(vol * SOUND_CONFIG.masterVolume, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration - i * 0.03);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.04);
    osc.stop(now + duration);
  });
}

// ─── 3. Game Over — crash + descending tone ─────────────────
function playGameOver() {
  if (!initAudio()) return;

  const duration = 0.8;
  const now = audioCtx.currentTime;

  // Part 1: Impact noise burst
  const bufferSize = audioCtx.sampleRate * 0.15;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const noiseGain = audioCtx.createGain();
  noiseGain.gain.setValueAtTime(0.5 * SOUND_CONFIG.masterVolume, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);

  const noiseFilter = audioCtx.createBiquadFilter();
  noiseFilter.type = 'lowpass';
  noiseFilter.frequency.setValueAtTime(3000, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(200, now + 0.15);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(audioCtx.destination);
  noise.start(now);
  noise.stop(now + 0.15);

  // Part 2: Descending tone
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();

  osc.type = 'sawtooth';
  osc.frequency.setValueAtTime(400, now + 0.05);
  osc.frequency.exponentialRampToValueAtTime(60, now + duration);

  oscGain.gain.setValueAtTime(0.3 * SOUND_CONFIG.masterVolume, now + 0.05);
  oscGain.gain.linearRampToValueAtTime(0.2 * SOUND_CONFIG.masterVolume, now + 0.2);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);
  osc.start(now + 0.05);
  osc.stop(now + duration);
}

// ─── 4. Score Milestone — ascending 3-note arpeggio ─────────
function playMilestone() {
  if (!initAudio()) return;

  const duration = 0.4;
  const now = audioCtx.currentTime;
  const notes = [523, 659, 784]; // C5, E5, G5 (C major triad)

  notes.forEach((freq, i) => {
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = 'triangle';
    osc.frequency.setValueAtTime(freq, now + i * 0.1);

    const vol = 0.25 - i * 0.04;
    gain.gain.setValueAtTime(0, now + i * 0.1);
    gain.gain.linearRampToValueAtTime(vol * SOUND_CONFIG.masterVolume, now + i * 0.1 + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + i * 0.1 + 0.12);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(now + i * 0.1);
    osc.stop(now + i * 0.1 + 0.12);
  });
}

// ─── 5. Speed Level Up — whoosh riser ───────────────────────
function playSpeedUp() {
  if (!initAudio()) return;

  const duration = 0.35;
  const now = audioCtx.currentTime;

  // Filtered noise sweep up (riser effect)
  const bufferSize = audioCtx.sampleRate * duration;
  const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    const env = Math.sin((i / bufferSize) * Math.PI); // Bell envelope
    data[i] = (Math.random() * 2 - 1) * env;
  }

  const noise = audioCtx.createBufferSource();
  noise.buffer = buffer;

  const filter = audioCtx.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.setValueAtTime(200, now);
  filter.frequency.exponentialRampToValueAtTime(8000, now + duration);
  filter.Q.setValueAtTime(1, now);

  const gain = audioCtx.createGain();
  gain.gain.setValueAtTime(0.3 * SOUND_CONFIG.masterVolume, now);
  gain.gain.linearRampToValueAtTime(0.5 * SOUND_CONFIG.masterVolume, now + duration * 0.3);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  // Add a rising sine underneath
  const osc = audioCtx.createOscillator();
  const oscGain = audioCtx.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(300, now);
  osc.frequency.exponentialRampToValueAtTime(1200, now + duration);
  oscGain.gain.setValueAtTime(0.15 * SOUND_CONFIG.masterVolume, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(audioCtx.destination);

  osc.connect(oscGain);
  oscGain.connect(audioCtx.destination);

  noise.start(now);
  osc.start(now);
  noise.stop(now + duration);
  osc.stop(now + duration);
}

// ─── Initialize sounds after first user interaction ─────────
function initSounds() {
  initAudio();
}

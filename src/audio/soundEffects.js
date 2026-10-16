// Pure Web Audio API Sound Effects Engine
// Works 100% offline with zero external audio assets

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.childVoice = null;

    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      const updateVoices = () => {
        this.childVoice = this.findBestChildFriendlyVoice();
      };
      updateVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = updateVoices;
      }
      if (window.speechSynthesis.addEventListener) {
        window.speechSynthesis.addEventListener('voiceschanged', updateVoices);
      }
    }
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) {
        this.ctx = new AudioContextClass();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playPop() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, t);
      osc.frequency.exponentialRampToValueAtTime(800, t + 0.08);

      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.09);
    } catch (e) {
      console.warn('Audio pop error', e);
    }
  }

  playCandyBorrow() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;
      
      // Magical ascending glockenspiel twinkle (C5, E5, G5, C6)
      const notes = [523.25, 659.25, 783.99, 1046.50];
      notes.forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = t + idx * 0.08;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, noteStart);

        gain.gain.setValueAtTime(0.25, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.42);
      });
    } catch (e) {
      console.warn('Audio borrow error', e);
    }
  }

  playBagDrop() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Gentle candy thud with rattle
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(160, t);
      osc.frequency.exponentialRampToValueAtTime(60, t + 0.15);

      gain.gain.setValueAtTime(0.35, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.16);

      // Candy wrapper rattle burst
      const bufferSize = Math.floor(this.ctx.sampleRate * 0.12);
      const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
      }

      const whiteNoise = this.ctx.createBufferSource();
      whiteNoise.buffer = noiseBuffer;

      const filter = this.ctx.createBiquadFilter();
      filter.type = 'highpass';
      filter.frequency.value = 2400;

      const noiseGain = this.ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18, t);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

      whiteNoise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(this.ctx.destination);

      whiteNoise.start(t);
    } catch (e) {
      console.warn('Audio bag drop error', e);
    }
  }

  playLanternJump() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Whimsical ghost hop whoosh with bright chime (F4 -> C5 -> A5)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(349.23, t);
      osc.frequency.exponentialRampToValueAtTime(880.00, t + 0.18);

      gain.gain.setValueAtTime(0.3, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.22);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(t);
      osc.stop(t + 0.24);

      // Sparkle ping
      const chime = this.ctx.createOscillator();
      const chimeGain = this.ctx.createGain();
      chime.type = 'triangle';
      chime.frequency.setValueAtTime(1318.51, t + 0.08); // E6
      chimeGain.gain.setValueAtTime(0.2, t + 0.08);
      chimeGain.gain.exponentialRampToValueAtTime(0.001, t + 0.35);
      chime.connect(chimeGain);
      chimeGain.connect(this.ctx.destination);
      chime.start(t + 0.08);
      chime.stop(t + 0.36);
    } catch (e) {
      console.warn('Audio lantern jump error', e);
    }
  }

  playSuccess() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Joyful triumphant chord (G4, B4, D5, G5)
      const freqs = [392.00, 493.88, 587.33, 783.99];
      freqs.forEach((f, i) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const noteStart = t + i * 0.06;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, noteStart);

        gain.gain.setValueAtTime(0.2, noteStart);
        gain.gain.exponentialRampToValueAtTime(0.001, noteStart + 0.5);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(noteStart);
        osc.stop(noteStart + 0.52);
      });
    } catch (e) {
      console.warn('Audio success error', e);
    }
  }

  playIncorrect() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Soft friendly whimsical boing (descending pitches)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, t);
      osc.frequency.exponentialRampToValueAtTime(200, t + 0.25);

      gain.gain.setValueAtTime(0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.01, t + 0.25);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(t);
      osc.stop(t + 0.26);
    } catch (e) {
      console.warn('Audio incorrect error', e);
    }
  }

  playVictory() {
    if (!this.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const t = this.ctx.currentTime;

      // Fanfare sequence
      const melody = [
        { f: 523.25, d: 0.12, off: 0 },
        { f: 659.25, d: 0.12, off: 0.14 },
        { f: 783.99, d: 0.12, off: 0.28 },
        { f: 1046.50, d: 0.45, off: 0.44 },
      ];

      melody.forEach(({ f, d, off }) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const start = t + off;

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(f, start);

        gain.gain.setValueAtTime(0.28, start);
        gain.gain.exponentialRampToValueAtTime(0.001, start + d);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(start);
        osc.stop(start + d + 0.05);
      });
    } catch (e) {
      console.warn('Audio victory error', e);
    }
  }

  findBestChildFriendlyVoice() {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
    try {
      const voices = window.speechSynthesis.getVoices();
      if (!voices || voices.length === 0) return null;

      let bestVoice = null;
      let highestScore = -1000;

      // Detect user language preference
      const navLang = (typeof navigator !== 'undefined' && navigator.language)
        ? navigator.language.toLowerCase()
        : 'en-us';

      for (let i = 0; i < voices.length; i++) {
        const v = voices[i];
        const name = (v.name || '').toLowerCase();
        const lang = (v.lang || '').toLowerCase();

        // Must be English for our curriculum
        if (!lang.startsWith('en')) continue;

        let score = 0;

        // 1. Dedicated & Natural Female Voices Across Major Platforms
        // Microsoft Natural / Neural Female voices (Windows / Edge)
        if (name.includes('jenny')) score += 120; // Microsoft Jenny - warm, friendly, natural
        if (name.includes('aria')) score += 110;  // Microsoft Aria - expressive neural female
        if (name.includes('michelle')) score += 100;
        if (name.includes('ava')) score += 95;
        if (name.includes('ana')) score += 95;
        if (name.includes('zira')) score += 80;   // Windows standard desktop female

        // Google / Android / Chrome Female Voices
        if (name.includes('google uk english female')) score += 105;
        if (name.includes('google us english')) score += 85;
        if (name.includes('journey-f') || name.includes('wavenet-c') || name.includes('wavenet-e') || name.includes('standard-c') || name.includes('standard-e')) score += 100;

        // Apple (macOS / iOS / iPadOS) Female Voices
        if (name.includes('samantha')) score += 100; // Apple's standard friendly female voice
        if (name.includes('victoria') || name.includes('karen') || name.includes('tessa')) score += 85;
        if (name.includes('fiona') || name.includes('moira') || name.includes('serena') || name.includes('zoe') || name.includes('kate') || name.includes('allison') || name.includes('susan')) score += 80;

        // Friendly, youthful, or female keywords
        if (name.includes('child') || name.includes('kid') || name.includes('junior')) score += 110;
        if (name.includes('female') || name.includes('woman') || name.includes('girl')) score += 60;
        if (name.includes('natural') || name.includes('online') || name.includes('neural')) score += 40;

        // Browser voice gender metadata if present
        if (v.gender && String(v.gender).toLowerCase() === 'female') score += 50;

        // Dialect preference matching user locale
        if (lang === navLang) score += 25;
        else if (lang === 'en-us') score += 20;
        else if (lang === 'en-gb') score += 15;
        else score += 10;

        // Heavily penalize deep, robotic, or adult male desktop voices
        const maleNames = ['david', 'mark', 'george', 'guy', 'richard', 'daniel', 'oliver', 'james', 'thomas', 'fred', 'alex', 'bruce', 'male'];
        for (const male of maleNames) {
          if (name.includes(male)) {
            score -= 150;
            break;
          }
        }
        if (v.gender && String(v.gender).toLowerCase() === 'male') {
          score -= 150;
        }

        if (score > highestScore) {
          highestScore = score;
          bestVoice = v;
        }
      }

      if (bestVoice && highestScore > 0) return bestVoice;

      // Fallback 1: Any English voice with female indicator
      const anyFemale = voices.find(v => {
        const n = (v.name || '').toLowerCase();
        const l = (v.lang || '').toLowerCase();
        return l.startsWith('en') && (n.includes('female') || n.includes('woman') || n.includes('girl') || n.includes('zira') || n.includes('samantha'));
      });
      if (anyFemale) return anyFemale;

      // Fallback 2: Any English voice not explicitly named male
      const anyNonMaleEn = voices.find(v => {
        const n = (v.name || '').toLowerCase();
        const l = (v.lang || '').toLowerCase();
        return l.startsWith('en') && !n.includes('david') && !n.includes('mark') && !n.includes('guy') && !n.includes('male');
      });
      if (anyNonMaleEn) return anyNonMaleEn;

      // Fallback 3: Any English voice
      const anyEn = voices.find(v => (v.lang || '').toLowerCase().startsWith('en'));
      if (anyEn) return anyEn;

      return voices[0] || null;
    } catch {
      return null;
    }
  }

  cleanSpeechForKids(text) {
    if (!text) return '';
    let s = String(text);
    // Replace subtraction minus expressions e.g. "500 − 36" or "500 - 36" -> "500 minus 36"
    s = s.replace(/(\d+)\s*[-−–]\s*(\d+)/g, '$1 minus $2');
    // Replace "+4" or "+60" -> "plus 4", "plus 60"
    s = s.replace(/\+(\d+)/g, 'plus $1');
    // Replace "=" -> "equals"
    s = s.replace(/=/g, ' equals ');
    // Replace arrows
    s = s.replace(/(?:→|➡️)/g, ' to ');
    // Place values pronunciation clarity
    s = s.replace(/\b10s\b/g, 'tens');
    s = s.replace(/\b100s\b/g, 'hundreds');
    s = s.replace(/\b1s\b/g, 'ones');
    // Remove emojis that may confuse child speech synthesizers
    s = s.replace(/[\u{1F300}-\u{1FAFF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, '');
    // Clean multiple spaces
    return s.replace(/\s+/g, ' ').trim();
  }

  speak(text) {
    if (!this.voiceEnabled || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    try {
      // Cancel any ongoing speech to prevent overlapping voices
      window.speechSynthesis.cancel();
      const cleaned = this.cleanSpeechForKids(text);
      if (!cleaned) return;

      const utterance = new SpeechSynthesisUtterance(cleaned);
      utterance.lang = 'en-US';

      // Always select or refresh the child-friendly female voice
      if (!this.childVoice) {
        this.childVoice = this.findBestChildFriendlyVoice();
      }
      if (this.childVoice) {
        utterance.voice = this.childVoice;
        if (this.childVoice.lang) {
          utterance.lang = this.childVoice.lang;
        }
      }

      // Warm, encouraging pitch like a patient teacher (1.08 is gentle and natural, avoiding squeaky chipmunk pitch)
      utterance.pitch = 1.08;
      // Slightly slower than ordinary adult conversation (0.90) so children can follow instructions comfortably
      utterance.rate = 0.90;
      utterance.volume = 1.0;

      // Chrome speech synthesis resume fix
      if (window.speechSynthesis.paused) {
        window.speechSynthesis.resume();
      }

      window.speechSynthesis.speak(utterance);
    } catch (e) {
      console.warn('Speech error', e);
    }
  }

  stopSpeech() {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      try {
        window.speechSynthesis.cancel();
      } catch {
        // Ignored
      }
    }
  }
}

export const sounds = new SoundEngine();

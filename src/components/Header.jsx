import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Share2, Printer, Sparkles, BookOpen, Gamepad2, FlaskConical, Check } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * Header Component
 * Contains the game branding, audio/voice toggles, navigation mode switchers,
 * and quick share/print buttons.
 */
export default function Header({
  activeTab = 'game', // 'game' | 'story' | 'practice'
  onTabChange,
}) {
  const [soundOn, setSoundOn] = useState(true);
  const [voiceOn, setVoiceOn] = useState(true);
  const [copied, setCopied] = useState(false);

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    sounds.soundEnabled = next;
    if (next) sounds.playPop();
  };

  const toggleVoice = () => {
    const next = !voiceOn;
    setVoiceOn(next);
    sounds.voiceEnabled = next;
    if (!next) sounds.stopSpeech();
    else sounds.speak("Voice narration enabled!");
  };

  const handleShare = async () => {
    const shareData = {
      title: 'Spooktacular Trick – Halloween Math Game',
      text: 'Play Spooktacular Trick: solve 500 − 53 = 447 with living haunted houses and candy regrouping!',
      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        if (err.name !== 'AbortError') copyLink();
      }
    } else {
      copyLink();
    }
  };

  const copyLink = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="w-full bg-[#130726]/90 border-b border-purple-800/60 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,140,0,0.6)] border border-white shrink-0">
            🎃
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-300 font-['Creepster',cursive] tracking-wider leading-none">
                Spooktacular Trick
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/50 text-[10px] font-bold text-purple-300">
                500 − 53 = 447
              </span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium hidden sm:block">
              A Halloween Subtraction Adventure with Living Haunted Houses!
            </p>
          </div>
        </div>

        {/* Mode Switcher Tabs */}
        <div className="flex items-center gap-1.5 bg-purple-950/80 p-1 rounded-2xl border border-purple-700/60 shadow-inner">
          <button
            onClick={() => {
              sounds.playPop();
              onTabChange('game');
            }}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'game'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md scale-102'
                : 'text-purple-200 hover:text-white hover:bg-purple-900/50'
            }`}
          >
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Play Game</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onTabChange('story');
            }}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'story'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md scale-102'
                : 'text-purple-200 hover:text-white hover:bg-purple-900/50'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Story Comic</span>
          </button>

          <button
            onClick={() => {
              sounds.playPop();
              onTabChange('practice');
            }}
            type="button"
            className={`px-3 py-1.5 rounded-xl font-extrabold text-xs flex items-center gap-1.5 transition-all cursor-pointer ${
              activeTab === 'practice'
                ? 'bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md scale-102'
                : 'text-purple-200 hover:text-white hover:bg-purple-900/50'
            }`}
          >
            <FlaskConical className="w-3.5 h-3.5" />
            <span>Sandbox</span>
          </button>
        </div>

        {/* Action Controls: Sound, Voice, Share, Print */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              soundOn
                ? 'bg-purple-900/70 border-purple-500/60 text-amber-300'
                : 'bg-gray-900/70 border-gray-700 text-gray-500'
            }`}
            title={soundOn ? 'Sound effects on' : 'Sound effects muted'}
            aria-label="Toggle sound effects"
          >
            {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          {/* Voice Narrator Toggle */}
          <button
            onClick={toggleVoice}
            type="button"
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 ${
              voiceOn
                ? 'bg-purple-900/70 border-purple-500/60 text-teal-300'
                : 'bg-gray-900/70 border-gray-700 text-gray-500'
            }`}
            title={voiceOn ? 'Voice narration on' : 'Voice narration off'}
            aria-label="Toggle voice narration"
          >
            {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
          </button>

          {/* Print Worksheet Button */}
          <button
            onClick={handlePrint}
            type="button"
            className="p-2 rounded-xl bg-purple-900/50 hover:bg-purple-800 text-purple-200 border border-purple-700 text-xs font-bold transition-colors hidden sm:flex items-center"
            title="Print printable story & problem"
            aria-label="Print worksheet"
          >
            <Printer className="w-4 h-4" />
          </button>

          {/* Share Game Button */}
          <button
            onClick={handleShare}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-xs flex items-center gap-1.5 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Share Game"
            aria-label="Share Game"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Share2 className="w-3.5 h-3.5 text-black" />}
            <span>{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

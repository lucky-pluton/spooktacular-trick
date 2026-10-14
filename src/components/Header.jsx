import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Share2, BookOpen, Gamepad2, BookText, RotateCcw, Home, Check, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * Header Component
 * Contains the game branding, audio/voice toggles, mode switcher,
 * story comic modal launcher, and share buttons.
 * 
 * Note: Printable worksheet functionality is strictly restricted to Notebook Mode
 * per requirement 12, so no print button is displayed in the global header.
 */
export default function Header({
  activeMode = 'welcome', // 'welcome' | 'game' | 'notebook'
  onSwitchMode,
  onOpenStory,
  onGoWelcome,
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

  return (
    <header className="w-full bg-[#130726]/90 border-b border-purple-800/60 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2.5">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
        {/* Branding & Logo */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              if (onGoWelcome) {
                sounds.playPop();
                onGoWelcome();
              }
            }}
            type="button"
            className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-2xl shadow-[0_0_15px_rgba(255,140,0,0.6)] border border-white shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Spooktacular Trick Home"
            aria-label="Spooktacular Trick Home"
          >
            🎃
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-300 font-['Creepster',cursive] tracking-wider leading-none">
                Spooktacular Trick
              </h1>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-full bg-purple-900/80 border border-purple-500/50 text-[10px] font-bold text-purple-300">
                Halloween Subtraction
              </span>
            </div>
            <p className="text-[11px] text-gray-300 font-medium hidden sm:block">
              Base-10 Borrowing Adventure with Living Haunted Houses!
            </p>
          </div>
        </div>

        {/* Center: Mode Indicator & Navigation Controls */}
        <div className="flex items-center gap-2 flex-wrap justify-center">
          {activeMode === 'welcome' ? (
            <div className="px-3 py-1 rounded-full bg-purple-900/60 border border-amber-400/40 text-amber-300 font-extrabold text-xs flex items-center gap-1.5 shadow">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Welcome Exploration</span>
            </div>
          ) : (
            <>
              {/* Active Mode Badge */}
              <div
                className={`px-3 py-1.5 rounded-2xl font-black text-xs flex items-center gap-1.5 shadow border ${
                  activeMode === 'game'
                    ? 'bg-gradient-to-r from-purple-900/90 to-purple-950/90 border-amber-400/70 text-amber-300'
                    : 'bg-gradient-to-r from-teal-950/90 to-teal-900/90 border-teal-400/70 text-teal-300'
                }`}
              >
                {activeMode === 'game' ? (
                  <>
                    <Gamepad2 className="w-3.5 h-3.5 text-amber-400" />
                    <span>Game Mode</span>
                  </>
                ) : (
                  <>
                    <BookText className="w-3.5 h-3.5 text-teal-300" />
                    <span>Notebook Mode</span>
                  </>
                )}
              </div>

              {/* Switch Mode Button */}
              {onSwitchMode && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onSwitchMode();
                  }}
                  type="button"
                  className="px-3 py-1.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102 active:scale-95 shadow"
                  title="Choose between Game Mode and Notebook Mode"
                >
                  <RotateCcw className="w-3.5 h-3.5 text-amber-300" />
                  <span>Switch Mode</span>
                </button>
              )}
            </>
          )}

          {/* Story Comic Launcher */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="px-3 py-1.5 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/50 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer hover:scale-102 active:scale-95 shadow"
              title="Read Illustrated Story Comic"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Story Comic</span>
            </button>
          )}

          {/* Home / Welcome button if not in welcome */}
          {activeMode !== 'welcome' && onGoWelcome && (
            <button
              onClick={() => {
                sounds.playPop();
                onGoWelcome();
              }}
              type="button"
              className="p-1.5 sm:px-2.5 sm:py-1.5 rounded-2xl bg-purple-950/70 hover:bg-purple-900 text-gray-300 hover:text-white border border-purple-700/50 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
              title="Return to Welcome Screen"
              aria-label="Return to Welcome Screen"
            >
              <Home className="w-3.5 h-3.5 text-purple-300" />
              <span className="hidden sm:inline">Welcome</span>
            </button>
          )}
        </div>

        {/* Action Controls: Sound, Voice, Share */}
        <div className="flex items-center gap-1.5">
          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
            className={`p-2 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
              voiceOn
                ? 'bg-purple-900/70 border-purple-500/60 text-teal-300'
                : 'bg-gray-900/70 border-gray-700 text-gray-500'
            }`}
            title={voiceOn ? 'Voice narration on' : 'Voice narration off'}
            aria-label="Toggle voice narration"
          >
            {voiceOn ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
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

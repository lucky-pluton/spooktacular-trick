import React, { useState } from 'react';
import { Volume2, VolumeX, Mic, MicOff, Share2, BookOpen, ArrowLeft, Check, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * Header Component
 * Provides a clean, focused, compact header tailored to the active screen/mode:
 * 
 * - Welcome: Branding, friendly tagline, audio toggles, story comic.
 * - Mode Select: Branding, "Choose Mode", audio toggles.
 * - Game Mode: Branding, "Game Mode" badge, unobtrusive "← Main Menu" button, audio toggles.
 *              (ZERO Notebook Mode tabs or printing controls).
 * - Notebook Mode: Branding, "Notebook Mode" badge, unobtrusive "← Main Menu" button, audio toggles.
 *                  (ZERO Game Mode tabs, points, or level locks).
 */
export default function Header({
  activeMode = 'welcome', // 'welcome' | 'mode_select' | 'game' | 'notebook'
  onReturnToMenu,
  onOpenStory,
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
    <header className="w-full bg-[#130726]/95 border-b border-purple-800/60 sticky top-0 z-40 backdrop-blur-md px-3 sm:px-6 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left: Branding & Current Mode Badge */}
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => {
              if (onReturnToMenu) {
                sounds.playPop();
                onReturnToMenu();
              }
            }}
            type="button"
            className="w-9 h-9 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-600 flex items-center justify-center text-xl shadow-[0_0_12px_rgba(255,140,0,0.5)] border border-white shrink-0 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title="Spooktacular Trick Home"
            aria-label="Spooktacular Trick Home"
          >
            🎃
          </button>
          <div className="flex items-center gap-2">
            <h1 className="text-lg sm:text-xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-300 font-['Creepster',cursive] tracking-wider leading-none">
              Spooktacular Trick
            </h1>

            {/* Mode-Specific Identifier Badge */}
            {activeMode === 'game' && (
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/80 text-amber-300 text-[11px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <span>🏰</span>
                <span>Trick-or-Think • Game</span>
              </span>
            )}

            {activeMode === 'notebook' && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/80 text-teal-300 text-[11px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <span>📓</span>
                <span>Trick-or-Think • Notebook</span>
              </span>
            )}

            {activeMode === 'trick_or_think_select' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/60 text-amber-300 text-[11px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1">
                <span>🏰</span>
                <span>Trick-or-Think</span>
              </span>
            )}

            {activeMode === 'math_o_lantern' && (
              <span className="px-2.5 py-0.5 rounded-full bg-teal-500/20 border border-teal-400/80 text-teal-300 text-[11px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1 shadow-sm">
                <span>🏮</span>
                <span>Math O' Lantern</span>
              </span>
            )}

            {activeMode === 'polotastic' && (
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/80 text-emerald-300 text-[11px] font-black uppercase tracking-wider hidden sm:inline-flex items-center gap-1 shadow-sm">
                <span>🍬</span>
                <span>Polotastic</span>
              </span>
            )}

            {activeMode === 'module_select' && (
              <span className="px-2.5 py-0.5 rounded-full bg-purple-900/60 border border-purple-500/60 text-purple-200 text-[11px] font-bold hidden sm:inline-flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                <span>Choose Module</span>
              </span>
            )}
          </div>
        </div>

        {/* Center: Small, Unobtrusive Way to Return to Modules or Main Menu */}
        {activeMode !== 'welcome' && onReturnToMenu && (
          <button
            onClick={() => {
              sounds.playPop();
              onReturnToMenu();
            }}
            type="button"
            className="px-3 py-1 rounded-xl bg-purple-950/80 hover:bg-purple-900 text-gray-300 hover:text-white border border-purple-700/60 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102 active:scale-95"
            title={
              activeMode === 'game' || activeMode === 'notebook'
                ? 'Return to Trick-or-Think menu'
                : 'Return to module selection'
            }
          >
            <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {activeMode === 'game' || activeMode === 'notebook'
                ? 'Main Menu'
                : activeMode === 'math_o_lantern' || activeMode === 'trick_or_think_select' || activeMode === 'polotastic'
                ? 'Modules'
                : 'Welcome'}
            </span>
          </button>
        )}

        {/* Right: Sound, Voice, Story Comic, Share */}
        <div className="flex items-center gap-1.5">
          {/* Story Comic Button */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-600/50 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer shadow"
              title={activeMode === 'math_o_lantern' ? "Read Ghostie's Story" : "Read Illustrated Story Comic"}
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span className="hidden sm:inline">
                {activeMode === 'math_o_lantern' ? "Ghostie's Story" : "Story Comic"}
              </span>
            </button>
          )}

          {/* Sound Toggle */}
          <button
            onClick={toggleSound}
            type="button"
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
            className={`p-1.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1 cursor-pointer ${
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
            className="px-2.5 py-1.5 rounded-xl bg-gradient-to-r from-amber-400 to-orange-500 hover:from-amber-300 hover:to-orange-400 text-black font-extrabold text-xs flex items-center gap-1 shadow-md transition-transform hover:scale-105 active:scale-95 cursor-pointer"
            title="Share Game"
            aria-label="Share Game"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-black" /> : <Share2 className="w-3.5 h-3.5 text-black" />}
            <span className="hidden md:inline">{copied ? 'Copied!' : 'Share'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { Sparkles, BookOpen, ArrowRight, Volume2, VolumeX } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * WelcomeScreen Component
 * Dedicated welcoming experience for Spooktacular Trick.
 * Warm, friendly, and inviting for children, parents, and teachers.
 * Focuses purely on welcoming children without gameplay scene illustration boxes.
 */
export default function WelcomeScreen({ onStart, onOpenStory, onSelectModule }) {
  const [isPlayingAudioGreeting, setIsPlayingAudioGreeting] = useState(false);

  const welcomeSpeechText =
    "Welcome, Little Math Explorer! Step into our friendly Halloween math world. " +
    "Together, we will explore candy sharing, base-ten regrouping, and the glowing lantern trail! " +
    "Click Let's Start to begin our magical adventure!";

  const handleAudioGreeting = () => {
    if (isPlayingAudioGreeting) {
      sounds.stopSpeech();
      setIsPlayingAudioGreeting(false);
    } else {
      sounds.playPop();
      setIsPlayingAudioGreeting(true);
      sounds.speak(welcomeSpeechText);
      setTimeout(() => setIsPlayingAudioGreeting(false), 9500);
    }
  };

  return (
    <div className="relative z-30 w-full max-w-4xl mx-auto my-2 sm:my-4 px-2 sm:px-4 animate-fadeIn">
      {/* Small playful decorative elements floating around the welcome card */}
      <div className="absolute -top-3 -left-2 text-2xl sm:text-3xl animate-float pointer-events-none select-none drop-shadow-md" aria-hidden="true">
        👻
      </div>
      <div className="absolute top-2 left-6 text-sm sm:text-base animate-pulse pointer-events-none select-none text-amber-300" aria-hidden="true">
        ✨
      </div>
      <div className="absolute -top-3 -right-2 text-2xl sm:text-3xl animate-float pointer-events-none select-none drop-shadow-md" style={{ animationDelay: '1.2s' }} aria-hidden="true">
        🎃
      </div>
      <div className="absolute top-2 right-6 text-sm sm:text-base animate-pulse pointer-events-none select-none text-amber-300" style={{ animationDelay: '0.8s' }} aria-hidden="true">
        ⭐
      </div>
      <div className="absolute -bottom-3 -left-2 text-xl sm:text-2xl animate-float pointer-events-none select-none drop-shadow-md" style={{ animationDelay: '1.8s' }} aria-hidden="true">
        🍁
      </div>
      <div className="absolute -bottom-3 -right-2 text-xl sm:text-2xl animate-float pointer-events-none select-none drop-shadow-md" style={{ animationDelay: '0.5s' }} aria-hidden="true">
        🍂
      </div>

      {/* Main Welcoming Card Container */}
      <div className="relative bg-[#1b0a33]/95 border-3 border-amber-400/90 rounded-[40px] p-5 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(255,180,0,0.38)] backdrop-blur-md flex flex-col items-center gap-4 sm:gap-5 overflow-hidden">
        
        {/* Subtle Ambient Background Glow */}
        <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-96 h-48 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Branding Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-purple-900/80 via-purple-800/80 to-purple-900/80 border border-purple-400/60 text-amber-300 font-black text-xs sm:text-sm uppercase tracking-wider shadow-md">
          <Sparkles className="w-4 h-4 text-amber-400 animate-spin" style={{ animationDuration: '6s' }} />
          <span>Spooktacular Trick • Friendly Halloween Math</span>
          <span className="text-amber-400">✨</span>
        </div>

        {/* Welcoming Headline for Children */}
        <div className="flex flex-col items-center gap-1.5">
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-amber-200 font-['Creepster',cursive] tracking-wide leading-tight drop-shadow-lg">
            Welcome, Little Math Explorer! 🎃
          </h1>
          <p className="text-xs sm:text-sm md:text-base text-amber-200 font-semibold tracking-wide">
            Where Subtraction Meets Playful Halloween Adventures & Gentle Learning
          </p>
        </div>

        {/* Short, Encouraging Introduction */}
        <p className="text-sm sm:text-base md:text-lg text-purple-100 font-medium leading-relaxed max-w-2xl px-2">
          Step into our enchanted Halloween world where subtraction is a friendly, smile-filled quest! 
          Whether you're helping our friendly Haunted Houses regroup and share candies, or travelling 
          with Ghostie along glowing lantern trails to reach friendly benchmark numbers, you'll discover 
          that math is magical, joyful, and easy to understand.
        </p>

        {/* Learning Adventure Preview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 w-full text-left my-1">
          {/* Adventure One: Trick-or-Think */}
          <div
            onClick={() => {
              sounds.playPop();
              if (onSelectModule) onSelectModule('trick_or_think');
              else onStart();
            }}
            className="group relative bg-purple-950/70 hover:bg-purple-900/80 border-2 border-purple-500/60 hover:border-amber-400 rounded-3xl p-4 sm:p-5 transition-all transform hover:scale-[1.02] cursor-pointer shadow-lg flex flex-col justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-purple-500 to-amber-400 text-black flex items-center justify-center text-2xl shadow font-black shrink-0 group-hover:rotate-6 transition-transform">
                🏰
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-amber-300">
                  Adventure One
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-amber-300 transition-colors">
                  Trick-or-Think
                </h3>
                <p className="text-xs text-purple-200 leading-snug mt-1 font-medium">
                  Help the Hundreds, Tens, and Ones houses borrow and share candies with excited trick-or-treaters!
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-purple-300">
              <span className="bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-600/50">
                🍬 Base-10 Borrowing
              </span>
              <span className="bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-600/50">
                📖 Story Comic
              </span>
              <span className="bg-purple-900/80 px-2 py-0.5 rounded-lg border border-purple-600/50">
                🖨️ Printable Worksheets
              </span>
            </div>
          </div>

          {/* Adventure Two: Math O' Lantern */}
          <div
            onClick={() => {
              sounds.playPop();
              if (onSelectModule) onSelectModule('math_o_lantern');
              else onStart();
            }}
            className="group relative bg-[#072433]/80 hover:bg-[#0b3348]/90 border-2 border-teal-500/60 hover:border-emerald-400 rounded-3xl p-4 sm:p-5 transition-all transform hover:scale-[1.02] cursor-pointer shadow-lg flex flex-col justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-teal-400 to-emerald-400 text-black flex items-center justify-center text-2xl shadow font-black shrink-0 group-hover:-rotate-6 transition-transform">
                🏮
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-teal-300">
                  Adventure Two
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-teal-300 transition-colors">
                  Math O' Lantern
                </h3>
                <p className="text-xs text-teal-200 leading-snug mt-1 font-medium">
                  Hop with Ghostie along glowing trails! Count up through friendly benchmarks to discover the difference.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-teal-300">
              <span className="bg-teal-950/80 px-2 py-0.5 rounded-lg border border-teal-600/50">
                ⭐ Interactive Tutorial
              </span>
              <span className="bg-teal-950/80 px-2 py-0.5 rounded-lg border border-teal-600/50">
                🎲 Fresh Questions
              </span>
              <span className="bg-teal-950/80 px-2 py-0.5 rounded-lg border border-teal-600/50">
                🔒 Guided Challenges
              </span>
            </div>
          </div>

          {/* Adventure Three: Polotastic */}
          <div
            onClick={() => {
              sounds.playPop();
              if (onSelectModule) onSelectModule('polotastic');
              else onStart();
            }}
            className="group relative bg-[#06241a]/80 hover:bg-[#083526]/90 border-2 border-emerald-500/60 hover:border-emerald-300 rounded-3xl p-4 sm:p-5 transition-all transform hover:scale-[1.02] cursor-pointer shadow-lg flex flex-col justify-between gap-3"
          >
            <div className="flex items-start gap-3">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-emerald-300 via-teal-300 to-cyan-300 text-black flex items-center justify-center text-2xl shadow font-black shrink-0 group-hover:rotate-6 transition-transform">
                🍬
              </span>
              <div className="flex flex-col min-w-0">
                <span className="text-[10px] uppercase font-black tracking-wider text-emerald-300">
                  Adventure Three
                </span>
                <h3 className="text-base sm:text-lg font-black text-white group-hover:text-emerald-300 transition-colors">
                  Polotastic
                </h3>
                <p className="text-xs text-emerald-200 leading-snug mt-1 font-medium">
                  Collect Polos, bundle rolls, packets & cartons, and master borrowing in "Break a Roll!"
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-1.5 text-[11px] font-bold text-emerald-300">
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-600/50">
                📖 Guidebook
              </span>
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-600/50">
                🏃 Polo Dash Runner
              </span>
              <span className="bg-emerald-950/80 px-2 py-0.5 rounded-lg border border-emerald-600/50">
                ⚡ Break a Roll!
              </span>
            </div>
          </div>
        </div>

        {/* Feature Highlights Bar */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-purple-200 my-1">
          <span className="bg-purple-900/60 border border-purple-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🔊 Child-Friendly Teacher Voice
          </span>
          <span className="bg-teal-900/60 border border-teal-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            💡 Zero-Stress Encouragement
          </span>
          <span className="bg-amber-900/60 border border-amber-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🏆 Joyful Celebrations
          </span>
          <span className="bg-emerald-900/60 border border-emerald-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🎲 Dynamic Randomized Math
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
          {/* Prominent "Let's Start!" Button */}
          <button
            id="welcome-start-button"
            onClick={() => {
              sounds.playPop();
              onStart();
            }}
            type="button"
            className="w-full sm:w-auto px-10 py-4 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-black font-black text-base sm:text-lg shadow-[0_0_35px_rgba(255,180,0,0.85)] hover:shadow-[0_0_45px_rgba(255,180,0,1)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-3 cursor-pointer"
          >
            <span>Let's Start!</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* "Read Story Comic" Button */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="w-full sm:w-auto px-6 py-3.5 rounded-2xl bg-purple-900/70 hover:bg-purple-800 text-purple-200 border-2 border-purple-500/70 font-black text-sm sm:text-base transition-all transform hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read Story Comic</span>
            </button>
          )}

          {/* Child-Friendly Female Teacher Voice Welcome Button */}
          <button
            onClick={handleAudioGreeting}
            type="button"
            className={`w-full sm:w-auto px-5 py-3.5 rounded-2xl border-2 font-black text-sm sm:text-base transition-all transform hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer shadow-md ${
              isPlayingAudioGreeting
                ? 'bg-amber-400 text-black border-amber-300 shadow-[0_0_20px_rgba(255,180,0,0.8)] animate-pulse'
                : 'bg-teal-950/70 hover:bg-teal-900 text-teal-200 border-teal-500/60'
            }`}
            title="Listen to teacher voice welcome"
          >
            {isPlayingAudioGreeting ? (
              <>
                <VolumeX className="w-4 h-4 text-black" />
                <span>Stop Voice</span>
              </>
            ) : (
              <>
                <Volume2 className="w-4 h-4 text-amber-300" />
                <span>Teacher Voice 🔊</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

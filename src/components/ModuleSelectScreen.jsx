import React from 'react';
import { Sparkles, ArrowRight, ArrowLeft, Home } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ModuleSelectScreen Component
 * Dedicated module selection screen for Spooktacular Trick.
 * Displays the 3 core educational modules:
 * 1. Trick-or-Think (Base-10 borrowing & candy regrouping)
 * 2. Math O' Lantern (Counting up jumps & finding distance)
 * 3. Polotastic (Place value units, manipulatives & borrowing notebook)
 */
export default function ModuleSelectScreen({
  onSelectModule, // (moduleId: 'trick_or_think' | 'math_o_lantern' | 'polotastic') => void
  onBackToWelcome,
}) {
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="module-select-title"
      className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-4 animate-fadeIn select-none"
    >
      <div className="bg-[#17082e]/98 border-3 border-purple-500/80 rounded-[40px] p-5 sm:p-8 text-center text-white shadow-[0_0_60px_rgba(184,69,255,0.45)] backdrop-blur-md flex flex-col gap-5 animate-popIn">
        {/* Top Bar with Home Navigation and Badge */}
        <div className="flex flex-wrap items-center justify-between gap-3 w-full">
          {onBackToWelcome && (
            <button
              id="module-select-home-btn"
              onClick={() => {
                sounds.playPop();
                onBackToWelcome();
              }}
              type="button"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 hover:text-white border border-purple-500/60 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer hover:scale-105 active:scale-95 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300"
              aria-label="Back to Home"
            >
              <Home className="w-4 h-4 text-amber-400" />
              <span>← Home</span>
            </button>
          )}

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-purple-900/80 border border-purple-400/50 text-amber-300 font-black text-xs uppercase tracking-wider ml-auto">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Choose Your Learning Adventure</span>
          </div>
        </div>

        {/* Heading */}
        <div className="flex flex-col gap-1 max-w-2xl mx-auto">
          <h2
            id="module-select-title"
            className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-teal-300 font-['Creepster',cursive] tracking-wide"
          >
            Three Fantastic Ways to Master Subtraction!
          </h2>
          <p className="text-xs sm:text-sm text-gray-300 font-medium">
            Explore candy sharing, the glowing lantern trail, or the Polo place-value bundling system!
          </p>
        </div>

        {/* THREE MODULES CARDS GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5 my-1 text-left items-stretch">
          {/* MODULE 1: TRICK-OR-THINK */}
          <div
            onClick={() => {
              sounds.playSuccess();
              onSelectModule('trick_or_think');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sounds.playSuccess();
                onSelectModule('trick_or_think');
              }
            }}
            className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-br from-purple-950/80 via-[#260c44]/90 to-[#16062a]/95 border-3 border-amber-400/80 hover:border-amber-300 shadow-[0_0_25px_rgba(255,180,0,0.3)] hover:shadow-[0_0_35px_rgba(255,180,0,0.6)] transition-all transform hover:scale-[1.02] active:scale-98 flex flex-col justify-between gap-3.5 cursor-pointer group"
          >
            {/* Module Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-black flex items-center justify-center text-2xl shadow-lg font-black">
                🏰
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase tracking-wider">
                Borrowing & Regrouping
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-400">Module 1</span>
              <h3 className="text-lg sm:text-xl font-black text-amber-300 group-hover:text-amber-200 mt-0.5">
                Trick-or-Think
              </h3>
              <p className="text-xs text-gray-200 font-medium italic mt-1 leading-snug">
                "Borrow, regroup, and help the houses share their candies!"
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-1 text-xs text-purple-200 font-semibold border-t border-purple-800/60 pt-2.5">
              <div className="flex items-center gap-1.5">
                <span>🏮</span>
                <span>Hundreds, Tens & Ones houses</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🍬</span>
                <span>Base-10 candy sharing</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🎮</span>
                <span>Game Mode & Printable Notebook</span>
              </div>
            </div>

            {/* Button */}
            <div className="w-full mt-1 py-2.5 px-3 rounded-2xl bg-amber-400 group-hover:bg-amber-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-2 transition-all">
              <span>Enter Trick-or-Think</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* MODULE 2: MATH O' LANTERN */}
          <div
            onClick={() => {
              sounds.playLanternJump();
              onSelectModule('math_o_lantern');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sounds.playLanternJump();
                onSelectModule('math_o_lantern');
              }
            }}
            className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-br from-teal-950/80 via-[#0a2633]/90 to-[#04141c]/95 border-3 border-teal-400/80 hover:border-teal-300 shadow-[0_0_25px_rgba(0,255,200,0.3)] hover:shadow-[0_0_35px_rgba(0,255,200,0.6)] transition-all transform hover:scale-[1.02] active:scale-98 flex flex-col justify-between gap-3.5 cursor-pointer group"
          >
            {/* Module Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-teal-400 to-emerald-400 text-black flex items-center justify-center text-2xl shadow-lg font-black">
                🏮
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-teal-400/20 border border-teal-400 text-teal-300 text-[10px] font-black uppercase tracking-wider">
                Counting Up Method
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-teal-400">Module 2</span>
              <h3 className="text-lg sm:text-xl font-black text-teal-300 group-hover:text-teal-200 mt-0.5">
                Math O' Lantern
              </h3>
              <p className="text-xs text-gray-200 font-medium italic mt-1 leading-snug">
                "Help Ghostie collect lanterns and discover the distance between numbers!"
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-1 text-xs text-teal-200 font-semibold border-t border-teal-800/60 pt-2.5">
              <div className="flex items-center gap-1.5">
                <span>👻</span>
                <span>Ghostie on the lantern trail</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>✨</span>
                <span>Hop to friendly benchmark tens</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🧪</span>
                <span>Guided Journey & Sandbox</span>
              </div>
            </div>

            {/* Button */}
            <div className="w-full mt-1 py-2.5 px-3 rounded-2xl bg-teal-400 group-hover:bg-teal-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-2 transition-all">
              <span>Enter Math O' Lantern</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>

          {/* MODULE 3: POLOTASTIC */}
          <div
            onClick={() => {
              sounds.playSuccess();
              onSelectModule('polotastic');
            }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                sounds.playSuccess();
                onSelectModule('polotastic');
              }
            }}
            className="p-5 sm:p-6 rounded-[32px] bg-gradient-to-br from-emerald-950/85 via-[#072d21]/90 to-[#021811]/95 border-3 border-emerald-400/80 hover:border-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.35)] hover:shadow-[0_0_35px_rgba(16,185,129,0.65)] transition-all transform hover:scale-[1.02] active:scale-98 flex flex-col justify-between gap-3.5 cursor-pointer group"
          >
            {/* Module Badge & Icon */}
            <div className="flex items-center justify-between">
              <span className="w-12 h-12 rounded-2xl bg-gradient-to-br from-emerald-300 via-teal-300 to-cyan-300 text-black flex items-center justify-center text-2xl shadow-lg font-black">
                🍬
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase tracking-wider">
                Place Value & Regrouping
              </span>
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-emerald-400">Module 3</span>
              <h3 className="text-lg sm:text-xl font-black text-emerald-300 group-hover:text-emerald-200 mt-0.5">
                Polotastic — Let's Make Maths Fantastic!
              </h3>
              <p className="text-xs text-gray-200 font-medium italic mt-1 leading-snug">
                "Collect Polos, build bigger numbers, exchange your bundles, and master subtraction and addition through games!"
              </p>
            </div>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-1 text-xs text-emerald-200 font-semibold border-t border-emerald-800/60 pt-2.5">
              <div className="flex items-center gap-1.5">
                <span>📖</span>
                <span>The Guidebook (Ones, Rolls, Packets, Cartons)</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>🏃</span>
                <span>Polo Dash Prerequisite Runner Game</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span>⚡</span>
                <span>Levels 1–9: Takeaway, Regrouping & Written Notebook</span>
              </div>
            </div>

            {/* Button */}
            <div className="w-full mt-1 py-2.5 px-3 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 group-hover:from-emerald-300 group-hover:to-teal-300 text-black font-black text-xs sm:text-sm text-center shadow flex items-center justify-center gap-2 transition-all">
              <span>Enter Polotastic</span>
              <ArrowRight className="w-4 h-4" />
            </div>
          </div>
        </div>

        {/* Back Link */}
        {onBackToWelcome && (
          <button
            onClick={() => {
              sounds.playPop();
              onBackToWelcome();
            }}
            type="button"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm text-purple-300 hover:text-amber-300 transition-colors cursor-pointer mt-1 self-center hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-300 rounded-lg px-2 py-1"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>← Back to Home</span>
          </button>
        )}
      </div>
    </div>
  );
}

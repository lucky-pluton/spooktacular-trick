import React, { useState } from 'react';
import GuidedJourney from './GuidedJourney';
import LanternSandbox from './LanternSandbox';
import MathOLanternStoryModal from './MathOLanternStoryModal';
import { sounds } from '../../audio/soundEffects';
import { Compass, Sparkles, BookOpen, ArrowLeft } from 'lucide-react';

/**
 * MathOLanternModule Component
 * Dedicated container for the Math O' Lantern learning method.
 * 
 * Offers two simple ways to learn:
 * 1. Guided Journey: Structured step-by-step sequence with Witchy's questions.
 * 2. Lantern Sandbox: Free exploratory jumping between benchmark numbers.
 * 
 * Contains its own gameplay, instructions, visual identity, and learning interaction.
 * Does NOT display Trick-or-Think's mode controls or borrowing boards.
 */
export default function MathOLanternModule({ onReturnToModules }) {
  const [activeSubMode, setActiveSubMode] = useState('guided'); // 'guided' | 'sandbox'
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  return (
    <div className="w-full flex flex-col gap-3 min-h-[85vh] justify-between">
      {/* 1. MODULE SUB-NAVIGATION BAR */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-[#0b1f2e]/95 border-2 border-teal-500/70 rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,200,0.25)] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Module Title & Subtitle */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-amber-400 to-emerald-400 text-black flex items-center justify-center text-2xl shadow font-black shrink-0">
              🏮
            </span>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-300 font-['Creepster',cursive] tracking-wide leading-none">
                  Math O' Lantern
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-teal-400/20 border border-teal-400/60 text-teal-300 text-[10px] font-black uppercase tracking-wider hidden xs:inline">
                  Counting Up Method
                </span>
              </div>
              <p className="text-xs text-gray-300 font-medium line-clamp-1">
                Help Ghostie collect lanterns and discover the distance between numbers!
              </p>
            </div>
          </div>

          {/* Module Actions & Mode Switcher Tabs */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Story Button */}
            <button
              onClick={() => {
                sounds.playPop();
                setIsStoryOpen(true);
              }}
              type="button"
              className="px-2.5 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-amber-300 border border-purple-500/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm hover:scale-102"
              title="Read Ghostie and Witchy's Story"
            >
              <BookOpen className="w-3.5 h-3.5 text-amber-300" />
              <span>Ghostie's Story</span>
            </button>

            {/* Sub-mode Switcher Tabs (Guided Journey vs Lantern Sandbox) */}
            <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-2xl border border-teal-500/30">
              {/* Guided Journey Tab */}
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveSubMode('guided');
                }}
                type="button"
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubMode === 'guided'
                    ? 'bg-amber-400 text-black shadow-md font-black scale-102'
                    : 'text-teal-200 hover:text-white hover:bg-teal-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Guided Journey</span>
              </button>

              {/* Lantern Sandbox Tab */}
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveSubMode('sandbox');
                }}
                type="button"
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeSubMode === 'sandbox'
                    ? 'bg-teal-400 text-black shadow-md font-black scale-102'
                    : 'text-teal-200 hover:text-white hover:bg-teal-900/60'
                }`}
              >
                <Compass className="w-3.5 h-3.5" />
                <span>Lantern Sandbox</span>
              </button>
            </div>

            {/* Return to Module Selection Button */}
            {onReturnToModules && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onReturnToModules();
                }}
                type="button"
                className="px-2.5 py-1.5 rounded-xl bg-teal-950/80 hover:bg-teal-900 text-gray-300 hover:text-white border border-teal-600/60 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Return to module selection screen"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-teal-300" />
                <span>All Modules</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. ACTIVE SUB-MODE CONTENT */}
      <div className="w-full flex-1">
        {activeSubMode === 'guided' ? (
          <GuidedJourney
            onOpenSandbox={() => setActiveSubMode('sandbox')}
            onOpenStory={() => setIsStoryOpen(true)}
          />
        ) : (
          <LanternSandbox
            onOpenStory={() => setIsStoryOpen(true)}
          />
        )}
      </div>

      {/* 3. STORY MODAL SPECIFIC TO MATH O' LANTERN */}
      <MathOLanternStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
        onStartJourney={() => {
          setIsStoryOpen(false);
          setActiveSubMode('guided');
        }}
      />
    </div>
  );
}

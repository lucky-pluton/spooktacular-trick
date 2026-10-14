import React from 'react';
import { Sparkles, BookOpen, ArrowRight } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * WelcomeScreen Component
 * The warm opening experience for Spooktacular Trick.
 * 
 * Requirements:
 * 1. Warm greeting: "Welcome to Spooktacular Trick! Meet the friendly haunted houses..."
 * 2. Does NOT start the game, deduct points, or show questions automatically.
 * 3. Houses remain visible in their idle, friendly state.
 * 4. Prominent "Let's Start!" button transitions to the mode selection screen.
 */
export default function WelcomeScreen({ onStart, onOpenStory }) {
  return (
    <div className="relative z-30 max-w-2xl mx-auto my-3 px-3 py-2 animate-fadeIn">
      <div className="bg-[#1b0a33]/95 border-3 border-amber-400/90 rounded-[36px] p-5 sm:p-8 text-center text-white shadow-[0_0_50px_rgba(255,180,0,0.45)] backdrop-blur-md flex flex-col items-center gap-3.5">
        {/* Friendly Halloween Badge */}
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500 text-black font-black text-xs uppercase tracking-wider shadow">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Friendly Halloween Math Adventure</span>
        </div>

        {/* Welcome Heading */}
        <h1 className="text-2xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-orange-400 to-purple-300 font-['Creepster',cursive] tracking-wide leading-tight">
          Welcome to Spooktacular Trick! 🎃
        </h1>

        {/* Warm Narrative Introduction */}
        <p className="text-sm sm:text-base text-gray-200 font-medium leading-relaxed max-w-xl">
          Meet the friendly haunted houses! They have a little candy problem, and they need your help with subtraction.
          Explore the neighbourhood, watch how base-10 borrowing works, and become a Subtraction Master!
        </p>

        {/* Feature Highlights Pill Row */}
        <div className="flex flex-wrap items-center justify-center gap-2 text-xs font-bold text-purple-200 my-1">
          <span className="bg-purple-900/60 border border-purple-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🏰 500 Candies
          </span>
          <span className="bg-teal-900/60 border border-teal-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🗼 10 Tens Regrouping
          </span>
          <span className="bg-amber-900/60 border border-amber-600/50 px-3 py-1 rounded-xl flex items-center gap-1.5">
            🎃 10 Ones to Trick-or-Treaters
          </span>
        </div>

        {/* Primary Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
          {/* Main "Let's Start!" Button */}
          <button
            onClick={() => {
              sounds.playPop();
              onStart();
            }}
            type="button"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-500 to-amber-400 hover:from-amber-300 hover:to-orange-400 text-black font-black text-base sm:text-lg shadow-[0_0_30px_rgba(255,180,0,0.8)] hover:shadow-[0_0_40px_rgba(255,180,0,1)] transition-all transform hover:scale-105 active:scale-95 flex items-center justify-center gap-2.5 cursor-pointer"
          >
            <span>Let's Start!</span>
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* "Story Comic" Button */}
          {onOpenStory && (
            <button
              onClick={() => {
                sounds.playPop();
                onOpenStory();
              }}
              type="button"
              className="w-full sm:w-auto px-6 py-3 rounded-2xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border-2 border-purple-500/60 font-black text-sm sm:text-base transition-all transform hover:scale-102 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <BookOpen className="w-4 h-4 text-amber-400" />
              <span>Read Story Comic</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

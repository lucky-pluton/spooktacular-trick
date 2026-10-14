import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';
import FloatingReward from './FloatingReward';

/**
 * ContextualQuestion Component
 * Renders the question card directly adjacent to the active mathematical action:
 * - Beside or below the Ones House when Ones needs help
 * - Beside or below the Tens House when Tens needs help
 * - Near the 100-candy or 10-candy transfer arrow during regrouping
 * - Beside the active subtraction column (Ones, Tens, Hundreds)
 */
export default function ContextualQuestion({
  targetAnchor = 'ones_house',
  anchorTitle = 'ONES HOUSE',
  question = '',
  options = [],
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onSelectOption,
  onContinue,
  isStartStep = false,
  onStartGame,
  hint = '',
  onShowHint,
  floatingReward = null,
  onRewardEnd,
}) {
  // Anchor badge colors and icons
  const anchorStyles = {
    ones_house: {
      border: 'border-amber-400',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-400/70',
      icon: '🎃',
      label: 'Ones House Operation',
      pointerClass: 'left-1/2 sm:left-3/4 -top-3',
    },
    tens_house: {
      border: 'border-teal-400',
      badge: 'bg-teal-950/90 text-teal-300 border-teal-400/70',
      icon: '🏚️',
      label: 'Tens House Operation',
      pointerClass: 'left-1/2 -top-3',
    },
    hundreds_house: {
      border: 'border-purple-400',
      badge: 'bg-purple-950/90 text-purple-300 border-purple-400/70',
      icon: '🏰',
      label: 'Hundreds House Operation',
      pointerClass: 'left-1/4 -top-3',
    },
    hundreds_to_tens: {
      border: 'border-orange-400',
      badge: 'bg-gradient-to-r from-purple-900 to-teal-900 text-amber-300 border-orange-400',
      icon: '🍬',
      label: '100 Candies (10 Tens) Transfer',
      pointerClass: 'left-1/3 -top-3',
    },
    tens_to_ones: {
      border: 'border-amber-400',
      badge: 'bg-gradient-to-r from-teal-900 to-amber-950 text-amber-300 border-amber-400',
      icon: '🍬',
      label: '10 Candies (10 Ones) Transfer',
      pointerClass: 'left-2/3 -top-3',
    },
    board_ones: {
      border: 'border-amber-400',
      badge: 'bg-amber-950/90 text-amber-300 border-amber-400/80',
      icon: '✏️',
      label: 'Ones Column Subtraction',
      pointerClass: 'left-3/4 -top-3',
    },
    board_tens: {
      border: 'border-teal-400',
      badge: 'bg-teal-950/90 text-teal-300 border-teal-400/80',
      icon: '✏️',
      label: 'Tens Column Subtraction',
      pointerClass: 'left-1/2 -top-3',
    },
    board_hundreds: {
      border: 'border-purple-400',
      badge: 'bg-purple-950/90 text-purple-300 border-purple-400/80',
      icon: '✏️',
      label: 'Hundreds Column Subtraction',
      pointerClass: 'left-1/4 -top-3',
    },
    start: {
      border: 'border-orange-400',
      badge: 'bg-orange-950/90 text-orange-300 border-orange-400',
      icon: '🎃',
      label: 'Welcome to Spooky Street',
      pointerClass: 'left-1/2 -top-3',
    },
  }[targetAnchor] || {
    border: 'border-purple-500',
    badge: 'bg-purple-950/90 text-purple-300 border-purple-500',
    icon: '🎃',
    label: 'Math Operation',
    pointerClass: 'left-1/2 -top-3',
  };

  // Case 1: Start Step
  if (isStartStep) {
    return (
      <div className="relative w-full max-w-xl mx-auto bg-[#1b0a36]/95 border-3 border-orange-500/80 rounded-3xl p-5 sm:p-6 shadow-[0_0_30px_rgba(255,140,0,0.4)] backdrop-blur-md text-center animate-popIn">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-500/20 border border-orange-500/50 text-orange-300 font-black text-xs uppercase tracking-wider mb-2">
          <span>🎃</span>
          <span>Spooktacular Adventure Begins!</span>
        </div>

        <p className="text-xs sm:text-sm text-purple-200 font-medium mb-5 leading-relaxed">
          The three living haunted houses hold all the candy on Spooky Street. Can you help the trick-or-treaters solve the subtraction problem by asking the houses to share?
        </p>

        <button
          onClick={() => {
            sounds.playPop();
            onStartGame();
          }}
          type="button"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-black text-lg sm:text-xl tracking-wide shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:shadow-[0_0_35px_rgba(255,180,0,0.85)] border-3 border-white transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
        >
          <span className="text-2xl">🎃</span>
          <span>Start the Trick!</span>
          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto bg-[#180a33]/95 border-3 ${anchorStyles.border} rounded-3xl p-4 sm:p-5 shadow-[0_0_35px_rgba(0,0,0,0.7)] backdrop-blur-md transition-all duration-300 animate-popIn`}
    >
      {/* Floating points reward animation */}
      {floatingReward && (
        <FloatingReward
          points={floatingReward.points}
          label={floatingReward.label}
          onAnimationEnd={onRewardEnd}
        />
      )}

      {/* Comic Upward Indicator Arrow (Visual connection to target operation above) */}
      <div
        className={`absolute ${anchorStyles.pointerClass} -translate-x-1/2 w-0 h-0 border-x-8 border-x-transparent border-b-8 border-b-[#180a33] filter drop-shadow-[0_-3px_3px_rgba(255,180,0,0.3)] select-none pointer-events-none hidden sm:block`}
      />

      {/* Header Bar: Anchor Badge & Hint Button */}
      <div className="flex items-center justify-between pb-2.5 border-b border-purple-800/60 mb-3 gap-2 flex-wrap">
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-black uppercase tracking-wider ${anchorStyles.badge}`}
          >
            <span>{anchorStyles.icon}</span>
            <span>{anchorTitle || anchorStyles.label}</span>
          </span>
        </div>

        {hint && onShowHint && (
          <button
            onClick={onShowHint}
            type="button"
            className="inline-flex items-center gap-1 text-xs font-bold text-amber-300 hover:text-amber-200 bg-amber-500/15 hover:bg-amber-500/25 px-2.5 py-1 rounded-lg border border-amber-500/40 transition-colors cursor-pointer"
            title="Ask for a place-value clue"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Need a Hint?</span>
          </button>
        )}
      </div>

      {/* Question Text */}
      <div className="text-sm sm:text-base md:text-lg font-black text-amber-300 mb-3 leading-snug">
        {question}
      </div>

      {/* Multiple Choice Options List */}
      <div className="flex flex-col gap-2.5 mb-3">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id || selectedOption === opt.value;
          const isRight = isSelected && isCorrect === true;
          const isWrong = isSelected && isCorrect === false;

          return (
            <button
              key={opt.id ?? opt.value}
              onClick={() => onSelectOption(opt)}
              disabled={isCorrect === true}
              type="button"
              className={`w-full text-left p-3 sm:p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-200 border-2 flex items-center justify-between gap-3 cursor-pointer ${
                isRight
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-white text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-[1.01]'
                  : isWrong
                  ? 'bg-red-950/80 border-red-500 text-red-200'
                  : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-600/60 text-gray-100 hover:border-amber-400 hover:scale-[1.01] active:scale-98'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-black/50 border border-white/20 flex items-center justify-center font-black text-xs shrink-0 text-amber-300">
                  {opt.id ?? '🍬'}
                </span>
                <span className="leading-snug text-xs sm:text-sm font-semibold">{opt.text}</span>
              </div>

              {isRight && (
                <div className="flex items-center gap-1 text-emerald-300 shrink-0">
                  <CheckCircle2 className="w-5 h-5" />
                </div>
              )}
              {isWrong && (
                <div className="flex items-center gap-1 text-red-300 shrink-0">
                  <AlertCircle className="w-5 h-5" />
                  <span className="text-[11px] font-bold">Try again!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Educational Place-Value Feedback & Points Notification */}
      {feedback && (
        <div
          className={`p-3 rounded-2xl mb-3 flex items-start gap-2.5 text-xs sm:text-sm font-semibold border transition-all ${
            isCorrect
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
              : 'bg-amber-950/90 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(255,180,0,0.2)]'
          }`}
        >
          {isCorrect ? (
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1">
            <span className="leading-relaxed">{feedback}</span>
          </div>
        </div>
      )}

      {/* Continue Button (When Answer is Correct) */}
      {isCorrect && (
        <div className="pt-1">
          <button
            onClick={() => {
              sounds.playPop();
              onContinue();
            }}
            type="button"
            className="w-full py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm sm:text-base shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.85)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Continue the Trick!</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}
    </div>
  );
}

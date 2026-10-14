import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * AnswerPanel Component
 * Reusable, house-contained interactive question and answer workspace.
 * Rendered directly INSIDE each haunted-house card (not as a separate floating card).
 */
export default function AnswerPanel({
  question = '',
  options = [],
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onSelectOption,
  onContinue,
  hint = '',
  onShowHint,
  placeType = 'ones', // 'hundreds' | 'tens' | 'ones'
}) {
  const accentTheme = {
    hundreds: {
      btnBg: 'bg-purple-900/60 hover:bg-purple-800/80',
      btnBorder: 'border-purple-500/60 hover:border-purple-300',
      badgeBg: 'bg-purple-800 text-purple-200',
      badgeBorder: 'border-purple-400',
    },
    tens: {
      btnBg: 'bg-teal-900/60 hover:bg-teal-800/80',
      btnBorder: 'border-teal-500/60 hover:border-teal-300',
      badgeBg: 'bg-teal-800 text-teal-200',
      badgeBorder: 'border-teal-400',
    },
    ones: {
      btnBg: 'bg-amber-950/60 hover:bg-amber-900/80',
      btnBorder: 'border-amber-500/60 hover:border-amber-300',
      badgeBg: 'bg-amber-800 text-amber-200',
      badgeBorder: 'border-amber-400',
    },
  }[placeType] || {
    btnBg: 'bg-purple-900/60',
    btnBorder: 'border-purple-500/60',
    badgeBg: 'bg-purple-800 text-purple-200',
    badgeBorder: 'border-purple-400',
  };

  return (
    <div className="w-full mt-2 pt-2 border-t border-white/15 flex flex-col gap-2.5 text-left animate-popIn">
      {/* Question Header & Hint */}
      <div className="flex items-start justify-between gap-1.5">
        <h3 className="text-sm sm:text-base font-black text-amber-300 leading-snug tracking-wide">
          {question}
        </h3>
        {hint && onShowHint && (
          <button
            onClick={() => {
              sounds.playPop();
              onShowHint();
            }}
            type="button"
            className="shrink-0 p-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold flex items-center gap-1 transition-colors cursor-pointer"
            title="Need a clue?"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Hint</span>
          </button>
        )}
      </div>

      {/* Answer Options List */}
      <div className="flex flex-col gap-2">
        {options.map((opt) => {
          const isSelected = selectedOption === opt.id || selectedOption === opt.value;
          const isRight = isSelected && isCorrect === true;
          const isWrong = isSelected && isCorrect === false;

          return (
            <button
              key={opt.id ?? opt.value ?? opt.text}
              onClick={() => onSelectOption(opt)}
              disabled={isCorrect === true}
              type="button"
              className={`w-full text-left p-2.5 sm:p-3 rounded-xl font-bold text-xs sm:text-sm transition-all duration-150 border-2 flex items-center justify-between gap-2.5 cursor-pointer ${
                isRight
                  ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-300 text-white shadow-[0_0_18px_rgba(16,185,129,0.7)] scale-[1.01]'
                  : isWrong
                  ? 'bg-red-950/90 border-red-500 text-red-200'
                  : `${accentTheme.btnBg} ${accentTheme.btnBorder} text-gray-100 hover:scale-[1.01] active:scale-98`
              }`}
            >
              <div className="flex items-center gap-2.5 min-w-0">
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center font-black text-xs shrink-0 border shadow-inner ${
                    isRight
                      ? 'bg-emerald-400 text-black border-white'
                      : isWrong
                      ? 'bg-red-500 text-white border-white'
                      : `${accentTheme.badgeBg} ${accentTheme.badgeBorder}`
                  }`}
                >
                  {opt.id ?? '🍬'}
                </span>
                <span className="leading-snug text-xs sm:text-sm font-semibold truncate">
                  {opt.text}
                </span>
              </div>

              {isRight && (
                <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />
              )}
              {isWrong && (
                <div className="flex items-center gap-1 text-red-300 text-[10px] font-bold shrink-0">
                  <AlertCircle className="w-4 h-4" />
                  <span>Try again!</span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Place-Value Feedback Explanation */}
      {feedback && (
        <div
          className={`p-2.5 rounded-xl text-xs font-semibold border flex items-start gap-2 transition-all ${
            isCorrect
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
              : 'bg-amber-950/90 border-amber-500 text-amber-200 shadow-[0_0_12px_rgba(255,180,0,0.2)]'
          }`}
        >
          {isCorrect ? (
            <Sparkles className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{feedback}</span>
        </div>
      )}

      {/* Continue Button (When Answer is Correct) */}
      {isCorrect && (
        <button
          onClick={() => {
            sounds.playPop();
            onContinue();
          }}
          type="button"
          className="w-full mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_25px_rgba(16,185,129,0.85)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
        >
          <span>Continue the Trick!</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

import React from 'react';
import { Volume2, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles, X } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * QuestionModal Component
 * Centered popup overlay for multiple-choice subtraction questions.
 * 
 * Features:
 * 1. Centered popup overlay that dims the haunted houses behind it while keeping them visible.
 * 2. 4 large, tap-friendly answer choices labelled A, B, C, D (randomized/shuffled).
 * 3. Stable identifier validation (never relies on array index or letter 'A').
 * 4. Rich Halloween styling themed to the active house (Hundreds/Tens/Ones).
 * 5. Immediate feedback with points (+100 on first try, +50 on retry) and place-value explanation.
 * 6. "Watch the Trick!" button that closes the modal to showcase the animated borrowing in the houses.
 */
export default function QuestionModal({
  isOpen = false,
  onClose,
  activeHouse = 'ones', // 'hundreds' | 'tens' | 'ones'
  question = '',
  speechText = '',
  dialogue = '',
  options = [], // 4 randomized options: [{ id, text, value, isCorrect, feedback, displayLetter }]
  selectedOption = null, // stable id/value
  isCorrect = null,
  feedback = '',
  onSelectOption,
  onContinue,
  hint = '',
  onShowHint,
  hintVisible = false,
  levelNumber = 1,
  stepNumber = 1,
  totalSteps = 7,
}) {
  if (!isOpen) return null;

  const houseTheme = {
    hundreds: {
      name: 'Hundreds House',
      icon: '🏰',
      borderColor: 'border-purple-400',
      glowShadow: 'shadow-[0_0_40px_rgba(184,69,255,0.45)]',
      badgeBg: 'bg-purple-950/90 text-purple-200 border-purple-500/60',
      accentBg: 'bg-purple-900/60 hover:bg-purple-800/80',
      letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
      cardBg: 'bg-[#18092f]/98',
    },
    tens: {
      name: 'Tens House',
      icon: '🗼',
      borderColor: 'border-teal-400',
      glowShadow: 'shadow-[0_0_40px_rgba(0,255,204,0.45)]',
      badgeBg: 'bg-teal-950/90 text-teal-200 border-teal-500/60',
      accentBg: 'bg-teal-900/60 hover:bg-teal-800/80',
      letterBadgeBg: 'bg-teal-800 text-teal-100 border-teal-400',
      cardBg: 'bg-[#091e2b]/98',
    },
    ones: {
      name: 'Ones House',
      icon: '🎃',
      borderColor: 'border-amber-400',
      glowShadow: 'shadow-[0_0_40px_rgba(255,180,0,0.45)]',
      badgeBg: 'bg-amber-950/90 text-amber-200 border-amber-500/60',
      accentBg: 'bg-amber-950/60 hover:bg-amber-900/80',
      letterBadgeBg: 'bg-amber-800 text-amber-100 border-amber-400',
      cardBg: 'bg-[#230f07]/98',
    },
  }[activeHouse] || {
    name: 'Haunted House',
    icon: '🎃',
    borderColor: 'border-purple-400',
    glowShadow: 'shadow-[0_0_40px_rgba(184,69,255,0.45)]',
    badgeBg: 'bg-purple-950/90 text-purple-200 border-purple-500/60',
    accentBg: 'bg-purple-900/60',
    letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
    cardBg: 'bg-[#18092f]/98',
  };

  const handleSpeak = () => {
    sounds.speak(speechText || question || dialogue);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="question-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/65 backdrop-blur-sm animate-fadeIn"
    >
      {/* Centered Modal Card */}
      <div
        className={`relative w-full max-w-lg ${houseTheme.cardBg} border-3 ${houseTheme.borderColor} rounded-3xl p-4 sm:p-6 text-white ${houseTheme.glowShadow} flex flex-col gap-3.5 transition-all duration-300 animate-popIn max-h-[92vh] overflow-y-auto`}
      >
        {/* Sky Decorative Elements */}
        <div className="absolute top-2 right-12 text-sm text-purple-300/30 select-none">✨</div>
        <div className="absolute top-4 left-6 text-sm text-purple-300/30 select-none">✨</div>

        {/* Top Header Bar */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
          {/* Active House Badge */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{houseTheme.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 leading-none">
                Level {levelNumber} • Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-xs sm:text-sm font-black text-amber-300 leading-tight">
                {houseTheme.name}
              </span>
            </div>
          </div>

          {/* Audio narration & Hint / Close buttons */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              type="button"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors cursor-pointer active:scale-95"
              title="Listen to question"
              aria-label="Listen to question"
            >
              <Volume2 className="w-4 h-4" />
            </button>

            {hint && onShowHint && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onShowHint();
                }}
                type="button"
                className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                title="Need a clue?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hint</span>
              </button>
            )}

            {onClose && (
              <button
                onClick={onClose}
                type="button"
                className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-400 hover:text-white transition-colors cursor-pointer ml-1"
                title="View haunted houses"
                aria-label="Close modal to view houses"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Character Dialogue Speech Quote */}
        {dialogue && (
          <div className="p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2 text-left">
            <span className="text-sm shrink-0">💬</span>
            <p className="text-xs sm:text-sm text-gray-200 font-medium italic leading-relaxed">
              "{dialogue}"
            </p>
          </div>
        )}

        {/* Clear Subtraction Question */}
        <div className="text-left my-1">
          <h2
            id="question-modal-title"
            className="text-base sm:text-lg font-black text-amber-300 leading-snug tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
          >
            {question}
          </h2>
        </div>

        {/* Clue / Hint Box (if toggled) */}
        {hintVisible && hint && (
          <div className="p-2.5 rounded-2xl bg-amber-950/90 border border-amber-400 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn text-left">
            <span className="text-base">💡</span>
            <span>{hint}</span>
          </div>
        )}

        {/* 4 Shuffled Answer Choices (A, B, C, D) */}
        <div className="flex flex-col gap-2.5 my-1">
          {options.map((opt, idx) => {
            const letter = opt.displayLetter || ['A', 'B', 'C', 'D'][idx] || `${idx + 1}`;
            const optKey = opt.id ?? opt.value ?? opt.text;
            const isSelected = selectedOption === opt.id || selectedOption === opt.value || selectedOption === optKey;
            const isRight = isSelected && isCorrect === true;
            const isWrong = isSelected && isCorrect === false;

            return (
              <button
                key={optKey}
                onClick={() => onSelectOption(opt)}
                disabled={isCorrect === true}
                type="button"
                className={`w-full text-left p-3 sm:p-3.5 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 border-2 flex items-center justify-between gap-3 cursor-pointer shadow-md ${
                  isRight
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-300 text-white shadow-[0_0_22px_rgba(16,185,129,0.7)] scale-[1.01]'
                    : isWrong
                    ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                    : `${houseTheme.accentBg} border-white/20 text-gray-100 hover:border-amber-400 hover:scale-[1.01] active:scale-98`
                }`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Distinct Letter Badge (A, B, C, D) */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border-2 shadow-inner transition-colors ${
                      isRight
                        ? 'bg-emerald-400 text-black border-white'
                        : isWrong
                        ? 'bg-red-500 text-white border-white'
                        : houseTheme.letterBadgeBg
                    }`}
                  >
                    {letter}
                  </span>

                  {/* Option Text */}
                  <span className="leading-snug text-xs sm:text-sm font-semibold truncate sm:whitespace-normal">
                    {opt.text}
                  </span>
                </div>

                {/* Status Indicator */}
                {isRight && (
                  <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />
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

        {/* Educational Feedback Explanation */}
        {feedback && (
          <div
            className={`p-3 rounded-2xl text-xs sm:text-sm font-semibold border-2 flex items-start gap-2.5 transition-all text-left ${
              isCorrect
                ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
                : 'bg-amber-950/95 border-amber-500 text-amber-200 shadow-[0_0_15px_rgba(255,180,0,0.25)]'
            }`}
          >
            {isCorrect ? (
              <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <span className="leading-relaxed">{feedback}</span>
          </div>
        )}

        {/* Action Button: Closes popup to watch the action in the houses! */}
        {isCorrect && (
          <button
            onClick={() => {
              sounds.playPop();
              onContinue();
            }}
            type="button"
            className="w-full mt-1 py-3 px-5 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-sm sm:text-base shadow-[0_0_25px_rgba(16,185,129,0.7)] hover:shadow-[0_0_35px_rgba(16,185,129,0.9)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Watch the Trick in the Houses! ✨</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
}

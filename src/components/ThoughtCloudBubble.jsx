import React from 'react';
import { Volume2, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * ThoughtCloudBubble Component
 * A soft, whimsical cloud-shaped speech & thought bubble that appears automatically
 * near the house encountering a subtraction question.
 * 
 * Features:
 * 1. Cloud-shaped rounded silhouette with connecting thought dots to the house.
 * 2. 4 tap-friendly multiple-choice options (A, B, C, D) shuffled dynamically.
 * 3. Validated by stable identifier / value, never by array index or letter 'A'.
 * 4. Audio read-aloud narration.
 * 5. Encouraging, child-friendly feedback and clue/hint support.
 * 6. "Watch the Trick! ✨" button that smoothly closes the bubble to watch the house animation.
 */
export default function ThoughtCloudBubble({
  isVisible = false,
  activeHouse = 'ones', // 'hundreds' | 'tens' | 'ones'
  question = '',
  speechText = '',
  dialogue = '',
  options = [], // 4 randomized options: [{ id, text, value, isCorrect, feedback, displayLetter }]
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onSelectOption,
  onContinue,
  hint = '',
  onShowHint,
  hintVisible = false,
  stepNumber = 1,
  totalSteps = 7,
}) {
  if (!isVisible) return null;

  const houseTheme = {
    hundreds: {
      name: 'Hundreds Castle',
      icon: '🏰',
      borderColor: 'border-purple-400',
      cloudBg: 'bg-[#1e0d38]/98',
      cloudGlow: 'shadow-[0_0_35px_rgba(184,69,255,0.4)]',
      badgeBg: 'bg-purple-900/90 text-purple-200 border-purple-500/60',
      btnDefault: 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-500/40',
      letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
      dotColor: 'bg-purple-400',
    },
    tens: {
      name: 'Tens Wizard Tower',
      icon: '🗼',
      borderColor: 'border-teal-400',
      cloudBg: 'bg-[#0d222e]/98',
      cloudGlow: 'shadow-[0_0_35px_rgba(0,255,204,0.4)]',
      badgeBg: 'bg-teal-900/90 text-teal-200 border-teal-500/60',
      btnDefault: 'bg-teal-900/60 hover:bg-teal-800/80 border-teal-500/40',
      letterBadgeBg: 'bg-teal-800 text-teal-100 border-teal-400',
      dotColor: 'bg-teal-400',
    },
    ones: {
      name: 'Ones Pumpkin Cottage',
      icon: '🎃',
      borderColor: 'border-amber-400',
      cloudBg: 'bg-[#291307]/98',
      cloudGlow: 'shadow-[0_0_35px_rgba(255,180,0,0.4)]',
      badgeBg: 'bg-amber-900/90 text-amber-200 border-amber-500/60',
      btnDefault: 'bg-amber-950/60 hover:bg-amber-900/80 border-amber-500/40',
      letterBadgeBg: 'bg-amber-800 text-amber-100 border-amber-400',
      dotColor: 'bg-amber-400',
    },
  }[activeHouse] || {
    name: 'Haunted House',
    icon: '🎃',
    borderColor: 'border-amber-400',
    cloudBg: 'bg-[#1e0d38]/98',
    cloudGlow: 'shadow-[0_0_35px_rgba(255,180,0,0.4)]',
    badgeBg: 'bg-amber-900/90 text-amber-200 border-amber-500/60',
    btnDefault: 'bg-purple-900/60',
    letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
    dotColor: 'bg-amber-400',
  };

  const handleSpeak = () => {
    sounds.speak(speechText || question || dialogue);
  };

  return (
    <div className="relative w-full max-w-xl mx-auto my-2 animate-fadeIn z-30">
      {/* SOFT CLOUD CONTAINER */}
      <div
        className={`relative w-full ${houseTheme.cloudBg} border-3 ${houseTheme.borderColor} rounded-[32px] sm:rounded-[40px] p-4 sm:p-6 text-white ${houseTheme.cloudGlow} backdrop-blur-md flex flex-col gap-3 transition-all duration-300 animate-popIn`}
      >
        {/* Soft Cloud Puffs (Decorative SVG accents along top/sides) */}
        <div className="absolute -top-3.5 left-10 w-9 h-7 rounded-full bg-inherit border-t-3 border-l-3 border-inherit pointer-events-none" />
        <div className="absolute -top-5 left-20 w-12 h-9 rounded-full bg-inherit border-t-3 border-inherit pointer-events-none" />
        <div className="absolute -top-3.5 right-12 w-10 h-7 rounded-full bg-inherit border-t-3 border-r-3 border-inherit pointer-events-none" />

        {/* Cloud Header Bar: Speaker & Action Controls */}
        <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
          {/* House Identity Tag */}
          <div className="flex items-center gap-2">
            <span className="text-xl sm:text-2xl">{houseTheme.icon}</span>
            <div className="flex flex-col text-left">
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-400 leading-none">
                {houseTheme.name} asks for help • Step {stepNumber} of {totalSteps}
              </span>
              <span className="text-xs sm:text-sm font-black text-white leading-tight">
                Spooky Subtraction Clue
              </span>
            </div>
          </div>

          {/* Controls: Audio Narration & Hint */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={handleSpeak}
              type="button"
              className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors cursor-pointer active:scale-95"
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
                className="px-2.5 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-colors cursor-pointer active:scale-95"
                title="Need a clue?"
              >
                <HelpCircle className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Hint</span>
              </button>
            )}
          </div>
        </div>

        {/* Character Dialogue Quote */}
        {dialogue && (
          <div className="p-2 sm:p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2 text-left">
            <span className="text-sm shrink-0 mt-0.5">💬</span>
            <p className="text-xs sm:text-sm text-gray-200 font-medium italic leading-relaxed">
              "{dialogue}"
            </p>
          </div>
        )}

        {/* Question Title */}
        <div className="text-left">
          <h3 className="text-sm sm:text-base md:text-lg font-black text-amber-300 leading-snug tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
            {question}
          </h3>
        </div>

        {/* Clue / Hint Box (if toggled) */}
        {hintVisible && hint && (
          <div className="p-2.5 rounded-2xl bg-amber-950/90 border border-amber-400 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn text-left">
            <span className="text-base shrink-0">💡</span>
            <span>{hint}</span>
          </div>
        )}

        {/* 4 Shuffled Answer Choices (A, B, C, D) */}
        <div className="flex flex-col gap-2 my-0.5">
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
                className={`w-full text-left p-2.5 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 border-2 flex items-center justify-between gap-2.5 cursor-pointer shadow-md ${
                  isRight
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)] scale-[1.01]'
                    : isWrong
                    ? 'bg-red-950/90 border-red-500 text-red-200 animate-pulse'
                    : `${houseTheme.btnDefault} text-gray-100 hover:border-amber-400 hover:scale-[1.01] active:scale-98`
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
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
            className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold border-2 flex items-start gap-2.5 transition-all text-left ${
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

        {/* Continue Action Button: Closes bubble and triggers borrowing animation */}
        {isCorrect && (
          <button
            onClick={() => {
              sounds.playPop();
              onContinue();
            }}
            type="button"
            className="w-full mt-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm shadow-[0_0_22px_rgba(16,185,129,0.7)] hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>Watch the Trick in the Neighbourhood! ✨</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

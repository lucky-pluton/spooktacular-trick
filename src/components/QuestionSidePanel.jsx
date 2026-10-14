import React from 'react';
import { Volume2, CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * QuestionSidePanel Component
 * Displays the current subtraction question, dialogue, and 4 multiple-choice options
 * on the RIGHT side of the screen, simultaneously visible with the haunted houses.
 */
export default function QuestionSidePanel({
  activeHouse = 'ones', // 'hundreds' | 'tens' | 'ones'
  question = '',
  speechText = '',
  dialogue = '',
  options = [], // 4 randomized options [{ id, text, value, isCorrect, displayLetter }]
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
  const houseTheme = {
    hundreds: {
      name: 'Hundreds Castle',
      shortName: '100s House',
      icon: '🏰',
      borderColor: 'border-purple-400',
      glow: 'shadow-[0_0_30px_rgba(184,69,255,0.35)]',
      badgeBg: 'bg-purple-900/90 text-purple-200 border-purple-400/60',
      cardBg: 'from-[#220d3d]/95 via-[#1a0833]/95 to-[#120524]/95',
      letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
      btnDefault: 'bg-purple-950/70 hover:bg-purple-900/80 border-purple-500/40 text-purple-100',
      accentText: 'text-purple-300',
      ringColor: 'ring-purple-400',
    },
    tens: {
      name: 'Tens Wizard Tower',
      shortName: '10s House',
      icon: '🗼',
      borderColor: 'border-teal-400',
      glow: 'shadow-[0_0_30px_rgba(0,255,204,0.35)]',
      badgeBg: 'bg-teal-900/90 text-teal-200 border-teal-400/60',
      cardBg: 'from-[#0d2730]/95 via-[#091e26]/95 to-[#06141a]/95',
      letterBadgeBg: 'bg-teal-800 text-teal-100 border-teal-400',
      btnDefault: 'bg-teal-950/70 hover:bg-teal-900/80 border-teal-500/40 text-teal-100',
      accentText: 'text-teal-300',
      ringColor: 'ring-teal-400',
    },
    ones: {
      name: 'Ones Pumpkin Cottage',
      shortName: '1s House',
      icon: '🎃',
      borderColor: 'border-amber-400',
      glow: 'shadow-[0_0_30px_rgba(255,180,0,0.35)]',
      badgeBg: 'bg-amber-900/90 text-amber-200 border-amber-400/60',
      cardBg: 'from-[#331808]/95 via-[#261005]/95 to-[#170a03]/95',
      letterBadgeBg: 'bg-amber-800 text-amber-100 border-amber-400',
      btnDefault: 'bg-amber-950/70 hover:bg-amber-900/80 border-amber-500/40 text-amber-100',
      accentText: 'text-amber-300',
      ringColor: 'ring-amber-400',
    },
  }[activeHouse] || {
    name: 'Haunted House',
    shortName: 'Active House',
    icon: '🎃',
    borderColor: 'border-amber-400',
    glow: 'shadow-[0_0_30px_rgba(255,180,0,0.35)]',
    badgeBg: 'bg-amber-900/90 text-amber-200 border-amber-400/60',
    cardBg: 'from-[#220d3d]/95 via-[#1a0833]/95 to-[#120524]/95',
    letterBadgeBg: 'bg-purple-800 text-purple-100 border-purple-400',
    btnDefault: 'bg-purple-950/70',
    accentText: 'text-amber-300',
    ringColor: 'ring-amber-400',
  };

  const handleSpeak = () => {
    sounds.speak(speechText || question || dialogue);
  };

  return (
    <aside
      aria-label="Active Subtraction Question"
      className={`relative w-full rounded-3xl bg-gradient-to-b ${houseTheme.cardBg} border-2 ${houseTheme.borderColor} p-3.5 sm:p-5 text-white ${houseTheme.glow} backdrop-blur-md flex flex-col gap-3 transition-all duration-300 shadow-2xl`}
    >
      {/* 1. TOP HEADER: ACTIVE HOUSE & STEP BADGES */}
      <div className="flex items-center justify-between pb-2 border-b border-white/10 gap-2">
        {/* Active House Badge */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="text-xl sm:text-2xl shrink-0 animate-bounce">{houseTheme.icon}</span>
          <div className="flex flex-col text-left min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className={`text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${houseTheme.badgeBg}`}>
                {houseTheme.shortName} Active
              </span>
              <span className="text-[11px] font-bold text-gray-300 font-mono">
                Step {stepNumber}/{totalSteps}
              </span>
            </div>
            <span className="text-xs sm:text-sm font-black text-white leading-tight truncate">
              {houseTheme.name}
            </span>
          </div>
        </div>

        {/* Action Controls: Read Aloud & Hint */}
        <div className="flex items-center gap-1.5 shrink-0">
          <button
            onClick={handleSpeak}
            type="button"
            className="p-1.5 sm:p-2 rounded-xl bg-white/10 hover:bg-white/20 text-yellow-300 transition-all cursor-pointer active:scale-95"
            title="Read question aloud"
            aria-label="Read question aloud"
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
              className="px-2 py-1 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer active:scale-95"
              title="Need a clue?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Clue</span>
            </button>
          )}
        </div>
      </div>

      {/* 2. STEP PROGRESS DOTS */}
      <div className="flex items-center gap-1.5 w-full">
        {[...Array(totalSteps)].map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full flex-1 transition-all duration-300 ${
              i + 1 < stepNumber
                ? 'bg-emerald-400'
                : i + 1 === stepNumber
                ? 'bg-amber-400 animate-pulse'
                : 'bg-white/15'
            }`}
            title={`Step ${i + 1}`}
          />
        ))}
      </div>

      {/* 3. HOUSE CHARACTER DIALOGUE QUOTE */}
      {dialogue && (
        <div className="p-2 sm:p-2.5 rounded-2xl bg-black/40 border border-white/10 flex items-start gap-2 text-left">
          <span className="text-base shrink-0 mt-0.5">💬</span>
          <p className="text-xs sm:text-sm text-gray-200 font-medium italic leading-relaxed">
            "{dialogue}"
          </p>
        </div>
      )}

      {/* 4. MAIN QUESTION PROMPT */}
      <div className="text-left">
        <h3 className="text-sm sm:text-base font-black text-amber-300 leading-snug tracking-wide drop-shadow-sm">
          {question}
        </h3>
      </div>

      {/* 5. TEACHER CLUE / HINT BOX (IF TOGGLED) */}
      {hintVisible && hint && (
        <div className="p-2.5 rounded-2xl bg-amber-950/90 border border-amber-400 text-amber-200 text-xs font-semibold flex items-center gap-2 animate-fadeIn text-left">
          <span className="text-base shrink-0">💡</span>
          <span className="leading-relaxed">{hint}</span>
        </div>
      )}

      {/* 6. 4 SHUFFLED MULTIPLE-CHOICE OPTIONS (A, B, C, D) */}
      <div className="flex flex-col gap-2 my-0.5">
        <div className="text-[11px] font-bold text-gray-400 uppercase tracking-wide text-left flex items-center gap-1">
          <span>Choose the right move:</span>
        </div>

        <div className="grid grid-cols-1 gap-2">
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
                className={`w-full text-left p-2.5 sm:p-3 rounded-2xl font-bold text-xs sm:text-sm transition-all duration-150 border-2 flex items-center justify-between gap-2.5 cursor-pointer shadow-md transform hover:scale-[1.01] active:scale-98 ${
                  isRight
                    ? 'bg-gradient-to-r from-emerald-800 to-teal-800 border-emerald-300 text-white shadow-[0_0_20px_rgba(16,185,129,0.7)]'
                    : isWrong
                    ? 'bg-rose-950/90 border-rose-500 text-rose-200 animate-pulse'
                    : `${houseTheme.btnDefault} hover:border-amber-400`
                }`}
              >
                <div className="flex items-center gap-2.5 min-w-0">
                  {/* Letter Stamp (A, B, C, D) */}
                  <span
                    className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-black text-xs sm:text-sm shrink-0 border-2 shadow-inner transition-colors ${
                      isRight
                        ? 'bg-emerald-400 text-black border-white'
                        : isWrong
                        ? 'bg-rose-500 text-white border-white'
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
                  <div className="flex items-center gap-1 text-rose-300 text-[10px] font-bold shrink-0">
                    <AlertCircle className="w-4 h-4" />
                    <span>Try again!</span>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* 7. EDUCATIONAL FEEDBACK */}
      {feedback && (
        <div
          className={`p-2.5 sm:p-3 rounded-2xl text-xs sm:text-sm font-semibold border-2 flex items-start gap-2.5 transition-all text-left animate-fadeIn ${
            isCorrect
              ? 'bg-emerald-950/95 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.35)]'
              : 'bg-rose-950/95 border-rose-500 text-rose-200 shadow-[0_0_15px_rgba(244,63,94,0.25)]'
          }`}
        >
          {isCorrect ? (
            <Sparkles className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <span className="leading-relaxed">{feedback}</span>
        </div>
      )}

      {/* 8. CONTINUE BUTTON (TRIGGERS BORROWING IN THE HOUSES) */}
      {isCorrect && (
        <button
          onClick={() => {
            sounds.playPop();
            onContinue();
          }}
          type="button"
          className="w-full mt-1 py-2.5 sm:py-3 px-4 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-xs sm:text-sm shadow-[0_0_22px_rgba(16,185,129,0.7)] hover:shadow-[0_0_30px_rgba(16,185,129,0.9)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer animate-popIn"
        >
          <span>Watch the Trick in the Houses! ✨</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      )}
    </aside>
  );
}

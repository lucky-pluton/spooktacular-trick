import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, HelpCircle, Check } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * AnswerPanel Component
 * Right-hand column interactive learning and MCQ interface:
 * - Current level number and title banner
 * - Question and multiple-choice options
 * - Immediate correct/incorrect feedback with place-value explanations
 * - Step-by-step subtraction column questions (Ones -> Tens -> Hundreds)
 * - Level complete state with next level progression
 * - Hint toggle button
 */
export default function AnswerPanel({
  currentLevel = 1,
  totalLevels = 5,
  levelTitle = "Level 1: 500 − 53",
  levelIcon = "🎃",
  stepTitle = "",
  question = '',
  options = [],
  onSelectOption,
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onContinue,
  onStartGame,
  isStartStep = false,
  isSubtractionPhase = false,
  subtractionStep = 0,
  subtractionData = null,
  onAnswerSubtraction,
  isLevelComplete = false,
  levelSummaryData = null,
  onNextLevel,
  hint = '',
  onShowHint,
}) {
  return (
    <div className="w-full bg-[#16092e]/90 border-3 border-purple-500/60 rounded-3xl p-4 sm:p-5 shadow-2xl backdrop-blur-md flex flex-col justify-between transition-all">
      {/* Level Header Banner */}
      <div className="pb-3 border-b border-purple-700/50 mb-3">
        <div className="flex items-center justify-between gap-2 flex-wrap mb-1">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-orange-500/20 to-amber-500/20 border border-orange-500/50 text-orange-300 font-black text-xs uppercase tracking-wider">
            <span>{levelIcon}</span>
            <span>LEVEL {currentLevel} OF {totalLevels}</span>
          </span>

          {hint && onShowHint && (
            <button
              onClick={onShowHint}
              type="button"
              className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-300 hover:text-amber-200 bg-amber-500/10 hover:bg-amber-500/25 px-2 py-1 rounded-lg border border-amber-500/40 transition-colors cursor-pointer"
              title="Need a hint?"
            >
              <HelpCircle className="w-3.5 h-3.5" />
              <span>Hint</span>
            </button>
          )}
        </div>

        <h2 className="text-base sm:text-lg font-black text-white tracking-wide">
          {levelTitle}
        </h2>
        {stepTitle && !isLevelComplete && (
          <div className="text-xs font-semibold text-purple-300 mt-0.5">
            {stepTitle}
          </div>
        )}
      </div>

      {/* BODY CONTENT */}

      {/* Case 1: Level Completed Banner */}
      {isLevelComplete ? (
        <div className="flex flex-col items-center py-2 text-center animate-fadeIn">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 border-2 border-emerald-400 flex items-center justify-center text-emerald-300 mb-2 shadow-[0_0_15px_rgba(16,185,129,0.5)]">
            <Check className="w-7 h-7 stroke-[3]" />
          </div>

          <h3 className="text-xl font-black text-emerald-300 mb-1">
            Level {currentLevel} Completed! 🎉
          </h3>

          {levelSummaryData && (
            <div className="w-full bg-[#0f0422] border border-emerald-500/50 rounded-2xl p-3 my-3 text-left">
              <div className="text-center text-lg font-black text-white pb-2 border-b border-purple-800/60 mb-2">
                {levelSummaryData.minuend} − {levelSummaryData.subtrahend} = <span className="text-emerald-400 font-extrabold">{levelSummaryData.diff}</span>
              </div>
              <p className="text-xs text-purple-200 leading-relaxed">
                {levelSummaryData.summaryExplanation || `Great work! Regrouping ${levelSummaryData.minuend} across zeros leaves ${levelSummaryData.diff} candies!`}
              </p>
            </div>
          )}

          <button
            onClick={() => {
              sounds.playPop();
              onNextLevel();
            }}
            type="button"
            className="w-full mt-2 py-3 px-6 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-500 hover:from-emerald-400 hover:to-teal-300 text-black font-black text-base shadow-[0_0_20px_rgba(16,185,129,0.6)] hover:shadow-[0_0_30px_rgba(16,185,129,0.85)] transition-all transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
          >
            <span>{currentLevel < totalLevels ? `Continue to Level ${currentLevel + 1}` : 'See Victory Celebration! 🏆'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      ) : isStartStep ? (
        /* Case 2: Start Step (e.g. Level 1 Step 1 Intro) */
        <div className="flex flex-col items-center justify-center py-6 text-center">
          <p className="text-xs sm:text-sm text-purple-200 font-medium mb-6 leading-relaxed">
            Look at the three haunted houses on the left holding all 500 candies. When you're ready, click below to begin borrowing candy bags!
          </p>

          <button
            onClick={() => {
              sounds.playPop();
              onStartGame();
            }}
            type="button"
            className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-black text-lg tracking-wide shadow-[0_0_20px_rgba(255,140,0,0.6)] hover:shadow-[0_0_30px_rgba(255,180,0,0.85)] border-2 border-white transform hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <span className="text-2xl">🎃</span>
            <span>Start the Trick!</span>
            <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      ) : isSubtractionPhase && subtractionData ? (
        /* Case 3: Step-by-Step Column Subtraction */
        (() => {
          const step = subtractionData[subtractionStep];
          return (
            <div className="flex flex-col gap-3">
              {/* Column subtitle */}
              <div className="flex items-center justify-between pb-1 text-xs">
                <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-extrabold uppercase border border-orange-500/40">
                  Step {subtractionStep + 1} of 3
                </span>
                <span className="text-gray-300 font-semibold">
                  <span className="text-amber-400 font-bold">{step.place}</span> Column
                </span>
              </div>

              {/* Expression */}
              <div className="text-center py-1 bg-black/40 border border-purple-700/40 rounded-xl p-2.5">
                <div className="text-xs text-purple-300 font-medium mb-1">
                  {step.explain}
                </div>
                <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider">
                  {step.expr} = <span className="text-white">{isCorrect ? step.correct : '?'}</span>
                </div>
              </div>

              {/* Choices Grid */}
              <div className="grid grid-cols-2 gap-2 my-1">
                {step.options.map((optVal) => {
                  const isSelected = selectedOption === optVal;
                  const isRight = isSelected && isCorrect === true;
                  const isWrong = isSelected && isCorrect === false;

                  return (
                    <button
                      key={optVal}
                      onClick={() => onAnswerSubtraction(optVal)}
                      disabled={isCorrect === true}
                      type="button"
                      className={`py-2.5 px-3 rounded-xl font-black text-lg transition-all shadow-md flex items-center justify-center gap-2 border-2 cursor-pointer ${
                        isRight
                          ? 'bg-emerald-600 border-white text-white scale-102 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                          : isWrong
                          ? 'bg-red-950/90 border-red-500 text-red-200'
                          : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-600/60 text-white hover:border-amber-400 hover:scale-[1.02]'
                      }`}
                    >
                      <span className="text-sm">🍬</span>
                      <span>{optVal}</span>
                    </button>
                  );
                })}
              </div>

              {/* Immediate Feedback */}
              {feedback && (
                <div
                  className={`p-2.5 rounded-xl flex items-start gap-2 text-xs font-semibold border ${
                    isCorrect
                      ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                      : 'bg-amber-950/90 border-amber-500 text-amber-200'
                  }`}
                >
                  {isCorrect ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                  )}
                  <span>{feedback}</span>
                </div>
              )}

              {/* Next Column Button */}
              {isCorrect && (
                <button
                  onClick={() => {
                    sounds.playPop();
                    onContinue();
                  }}
                  type="button"
                  className="w-full mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>{subtractionStep < 2 ? 'Next Column! ➔' : 'Complete Level! 🎉'}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          );
        })()
      ) : (
        /* Case 4: Standard Educational Multiple-Choice Question */
        <div className="flex flex-col gap-3">
          {/* Question Text */}
          <div className="font-bold text-sm sm:text-base text-amber-300 pb-1">
            {question}
          </div>

          {/* Options List */}
          <div className="flex flex-col gap-2">
            {options.map((opt) => {
              const isSelected = selectedOption === opt.id;
              const isRight = isSelected && isCorrect === true;
              const isWrong = isSelected && isCorrect === false;

              return (
                <button
                  key={opt.id}
                  onClick={() => onSelectOption(opt)}
                  disabled={isCorrect === true}
                  type="button"
                  className={`w-full text-left p-2.5 sm:p-3 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 border-2 flex items-center justify-between gap-2.5 cursor-pointer ${
                    isRight
                      ? 'bg-emerald-700/95 border-white text-white shadow-[0_0_15px_rgba(16,185,129,0.7)] scale-[1.01]'
                      : isWrong
                      ? 'bg-red-950/85 border-red-500 text-red-200'
                      : 'bg-purple-900/50 hover:bg-purple-800/70 border-purple-600/50 text-gray-100 hover:border-amber-400 hover:scale-[1.01]'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="w-6 h-6 rounded-full bg-black/40 border border-white/20 flex items-center justify-center font-bold text-xs shrink-0 text-amber-300">
                      {opt.id}
                    </span>
                    <span className="leading-snug">{opt.text}</span>
                  </div>

                  {isRight && <CheckCircle2 className="w-4 h-4 text-emerald-300 shrink-0" />}
                  {isWrong && <AlertCircle className="w-4 h-4 text-red-300 shrink-0" />}
                </button>
              );
            })}
          </div>

          {/* Educational Place-Value Feedback */}
          {feedback && (
            <div
              className={`p-2.5 rounded-xl flex items-start gap-2 text-xs font-semibold border ${
                isCorrect
                  ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
                  : 'bg-amber-950/90 border-amber-500 text-amber-200'
              }`}
            >
              {isCorrect ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
              )}
              <span className="leading-snug">{feedback}</span>
            </div>
          )}

          {/* Continue Button */}
          {isCorrect && (
            <button
              onClick={() => {
                sounds.playPop();
                onContinue();
              }}
              type="button"
              className="w-full mt-1 py-2.5 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm shadow-lg transition-transform hover:scale-[1.02] active:scale-98 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Continue the Trick!</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}

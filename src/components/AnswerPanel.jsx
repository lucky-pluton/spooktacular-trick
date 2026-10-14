import React from 'react';
import { CheckCircle2, AlertCircle, ArrowRight, Sparkles } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * AnswerPanel Component
 * Interactive choices and question interface for all game scenes.
 */
export default function AnswerPanel({
  sceneId = 1,
  question = '',
  options = [],
  onSelectOption,
  selectedOption = null,
  isCorrect = null,
  feedback = '',
  onContinue,
  onStartGame,
  subtractionStep = 0,
  subtractionData = null,
  onAnswerSubtraction,
}) {
  // Scene 1: Start Button
  if (sceneId === 1) {
    return (
      <div className="w-full max-w-md mx-auto text-center py-2">
        <button
          onClick={() => {
            sounds.playPop();
            onStartGame();
          }}
          type="button"
          className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 hover:from-orange-400 hover:to-orange-500 text-black font-black text-xl sm:text-2xl tracking-wide shadow-[0_0_25px_rgba(255,140,0,0.6)] hover:shadow-[0_0_35px_rgba(255,180,0,0.85)] border-3 border-white transform hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span className="text-3xl">🎃</span>
          <span>Start the Trick!</span>
          <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    );
  }

  // Scene 5: Step-by-Step Subtraction
  if (sceneId === 5 && subtractionData) {
    const step = subtractionData[subtractionStep];

    return (
      <div className="w-full max-w-xl mx-auto bg-purple-950/80 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
        {/* Step Indicator Header */}
        <div className="flex items-center justify-between pb-3 border-b border-purple-800/60 mb-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full bg-orange-500/20 text-orange-300 font-extrabold text-xs uppercase border border-orange-500/40">
              Step {subtractionStep + 1} of 3
            </span>
            <span className="font-extrabold text-white text-sm sm:text-base">
              Subtracting the <span className="text-amber-400">{step.place}</span> Column
            </span>
          </div>
          <span className="text-xs text-gray-400">Right to Left</span>
        </div>

        {/* Current Subtraction Formula */}
        <div className="text-center py-2">
          <div className="text-gray-300 text-xs sm:text-sm font-medium mb-1">
            {step.explain}
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-300 tracking-wider">
            {step.expr} = <span className="text-white">?</span>
          </div>
        </div>

        {/* Options Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-3">
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
                className={`py-3 px-2 rounded-xl font-black text-xl transition-all shadow-md flex items-center justify-center gap-2 border-2 ${
                  isRight
                    ? 'bg-emerald-600 border-white text-white scale-105 shadow-[0_0_15px_rgba(16,185,129,0.7)]'
                    : isWrong
                    ? 'bg-red-900/80 border-red-500 text-red-200'
                    : 'bg-purple-900/60 hover:bg-purple-800/80 border-purple-600/60 text-white hover:border-amber-400 hover:scale-102'
                }`}
              >
                <span>🍬</span>
                <span>{optVal}</span>
              </button>
            );
          })}
        </div>

        {/* Feedback Message */}
        {feedback && (
          <div
            className={`p-3 rounded-xl mb-3 flex items-start gap-2.5 text-xs sm:text-sm font-medium border ${
              isCorrect
                ? 'bg-emerald-950/80 border-emerald-500 text-emerald-200'
                : 'bg-amber-950/80 border-amber-500 text-amber-200'
            }`}
          >
            {isCorrect ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
            ) : (
              <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            )}
            <span>{feedback}</span>
          </div>
        )}

        {/* Continue to Next Subtraction Column */}
        {isCorrect && (
          <div className="text-center pt-1">
            <button
              onClick={onContinue}
              type="button"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95"
            >
              <span>{subtractionStep < 2 ? 'Next Column!' : 'Reveal Final Answer! 🎉'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    );
  }

  // Scenes 2, 3, 4: Multi-choice Interactive Problem Solving
  return (
    <div className="w-full max-w-xl mx-auto bg-purple-950/85 border-2 border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl backdrop-blur-md">
      {/* Question Title */}
      <div className="text-center font-bold text-base sm:text-lg text-amber-300 pb-2 mb-3 border-b border-purple-800/60">
        {question}
      </div>

      {/* Choice Options List */}
      <div className="flex flex-col gap-2.5 mb-3">
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
              className={`w-full text-left p-3 sm:p-3.5 rounded-xl font-semibold text-xs sm:text-sm transition-all duration-200 border-2 flex items-center justify-between gap-3 ${
                isRight
                  ? 'bg-emerald-700/90 border-white text-white shadow-[0_0_15px_rgba(16,185,129,0.7)] scale-[1.01]'
                  : isWrong
                  ? 'bg-red-950/80 border-red-500 text-red-200'
                  : 'bg-purple-900/50 hover:bg-purple-800/70 border-purple-600/50 text-gray-100 hover:border-amber-400 hover:scale-[1.01]'
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-full bg-black/40 border border-white/20 flex items-center justify-center font-bold text-xs shrink-0 text-amber-300">
                  {opt.id}
                </span>
                <span>{opt.text}</span>
              </div>

              {isRight && <CheckCircle2 className="w-5 h-5 text-emerald-300 shrink-0" />}
              {isWrong && <AlertCircle className="w-5 h-5 text-red-300 shrink-0" />}
            </button>
          );
        })}
      </div>

      {/* Feedback Message */}
      {feedback && (
        <div
          className={`p-3 rounded-xl mb-3 flex items-start gap-2.5 text-xs sm:text-sm font-medium border ${
            isCorrect
              ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200'
              : 'bg-amber-950/90 border-amber-500 text-amber-200'
          }`}
        >
          {isCorrect ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          )}
          <span>{feedback}</span>
        </div>
      )}

      {/* Continue Button */}
      {isCorrect && (
        <div className="text-center pt-1">
          <button
            onClick={() => {
              sounds.playPop();
              onContinue();
            }}
            type="button"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-black font-extrabold text-sm sm:text-base shadow-lg transition-transform hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Continue the Trick!</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
}

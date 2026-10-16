import React, { useState, useEffect, useRef } from 'react';
import { Check, Sparkles, AlertCircle, RotateCcw } from 'lucide-react';
import { sounds } from '../../audio/soundEffects';

/**
 * PoloAnswerInput Component
 * 
 * Reusable direct-answer entry component for Polotastic:
 * - Large, accessible numeric/text input field
 * - Physical keyboard support + Enter-key submission
 * - Touch-friendly on-screen numeric keypad (0-9, Backspace, Clear)
 * - Immediate, gentle feedback & hint display on incorrect attempts
 * - Disables key propagation so game runners don't steer when typing
 */
export default function PoloAnswerInput({
  targetValue, // single expected value (number or string) or array of acceptable values
  onSubmit, // callback ({ isCorrect, value, rawInput })
  onRetry, // optional callback on retry
  placeholder = 'Type your answer...',
  prefix = '',
  suffix = '',
  helperTip = '',
  disabled = false,
  autoFocus = true,
  showKeypad = true,
  type = 'number', // 'number' | 'text'
  ariaLabel = 'Answer entry field',
}) {
  const [inputValue, setInputValue] = useState('');
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, message: string }
  const [isShaking, setIsShaking] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (autoFocus && inputRef.current && !disabled) {
      inputRef.current.focus();
    }
  }, [autoFocus, disabled]);

  // Clean and check value against target(s)
  const checkAnswer = (valToTest) => {
    if (disabled || feedback?.isCorrect) return;

    const raw = String(valToTest ?? inputValue).trim();
    if (raw === '') {
      sounds.playIncorrect();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setFeedback({
        isCorrect: false,
        message: 'Please type an answer first!',
      });
      return;
    }

    let isCorrect = false;
    const acceptedList = Array.isArray(targetValue) ? targetValue : [targetValue];

    if (type === 'number') {
      // Normalize numbers (e.g. "1,000" -> 1000, " 10 " -> 10)
      const cleaned = raw.replace(/,/g, '');
      const parsedNum = Number(cleaned);

      if (!isNaN(parsedNum)) {
        isCorrect = acceptedList.some((target) => {
          if (typeof target === 'number') return parsedNum === target;
          const targetClean = String(target).replace(/,/g, '').trim();
          return parsedNum === Number(targetClean);
        });
      }
    } else {
      // Text normalization (case-insensitive, trimmed)
      const cleaned = raw.toLowerCase().replace(/[^a-z0-9]/g, '');
      isCorrect = acceptedList.some((target) => {
        const targetClean = String(target).toLowerCase().replace(/[^a-z0-9]/g, '');
        return cleaned === targetClean;
      });
    }

    if (isCorrect) {
      sounds.playSuccess();
      setFeedback({
        isCorrect: true,
        message: 'Spot on! That is correct!',
      });
    } else {
      sounds.playIncorrect();
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      setFeedback({
        isCorrect: false,
        message: helperTip || 'Not quite yet — check your count and try again!',
      });
    }

    if (onSubmit) {
      onSubmit({ isCorrect, value: raw, rawInput: raw });
    }
  };

  const handleKeyDown = (e) => {
    // Stop propagation so parent runner components don't steer while typing
    e.stopPropagation();

    if (e.key === 'Enter') {
      e.preventDefault();
      checkAnswer();
    }
  };

  const handleKeypadDigit = (digit) => {
    if (disabled || feedback?.isCorrect) return;
    sounds.playPop();
    setInputValue((prev) => prev + String(digit));
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeypadBackspace = () => {
    if (disabled || feedback?.isCorrect) return;
    sounds.playPop();
    setInputValue((prev) => prev.slice(0, -1));
    if (inputRef.current) inputRef.current.focus();
  };

  const handleKeypadClear = () => {
    if (disabled || feedback?.isCorrect) return;
    sounds.playPop();
    setInputValue('');
    setFeedback(null);
    if (inputRef.current) inputRef.current.focus();
  };

  const handleRetryClick = () => {
    sounds.playPop();
    setInputValue('');
    setFeedback(null);
    if (onRetry) onRetry();
    if (inputRef.current) inputRef.current.focus();
  };

  return (
    <div className="w-full flex flex-col items-center gap-3">
      {/* Primary Input Container */}
      <div
        className={`w-full max-w-md flex items-center justify-between gap-2 p-2 sm:p-2.5 rounded-2xl bg-[#021811] border-2 transition-all ${
          feedback?.isCorrect
            ? 'border-emerald-400 bg-emerald-950/60 shadow-[0_0_20px_rgba(16,185,129,0.5)]'
            : feedback?.isCorrect === false
            ? 'border-amber-400 bg-amber-950/30'
            : 'border-emerald-500/70 focus-within:border-emerald-300 focus-within:shadow-[0_0_15px_rgba(52,211,153,0.4)]'
        } ${isShaking ? 'animate-shake' : ''}`}
      >
        {prefix && (
          <span className="text-sm sm:text-base font-black text-amber-300 font-mono pl-2 shrink-0 select-none">
            {prefix}
          </span>
        )}

        <input
          ref={inputRef}
          type={type === 'number' ? 'text' : 'text'}
          inputMode={type === 'number' ? 'numeric' : 'text'}
          pattern={type === 'number' ? '[0-9,]*' : undefined}
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
            if (feedback && !feedback.isCorrect) setFeedback(null);
          }}
          onKeyDown={handleKeyDown}
          onKeyUp={(e) => e.stopPropagation()}
          disabled={disabled || feedback?.isCorrect}
          placeholder={placeholder}
          aria-label={ariaLabel}
          className="flex-1 bg-transparent text-white font-mono font-black text-xl sm:text-2xl text-center outline-none placeholder:text-emerald-500/50 min-w-0"
        />

        {suffix && (
          <span className="text-xs sm:text-sm font-bold text-emerald-300 pr-1 shrink-0 select-none">
            {suffix}
          </span>
        )}

        {/* Check Answer or Correct Indicator */}
        {feedback?.isCorrect ? (
          <div className="flex items-center gap-1 px-4 py-2 rounded-xl bg-emerald-400 text-black font-black text-sm shrink-0 shadow animate-popIn">
            <Check className="w-4 h-4 stroke-[3]" />
            <span>Correct!</span>
          </div>
        ) : (
          <button
            onClick={() => checkAnswer()}
            disabled={disabled}
            type="button"
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-400 to-teal-300 hover:from-emerald-300 hover:to-teal-200 text-black font-black text-sm transition-all transform hover:scale-102 active:scale-98 shadow cursor-pointer shrink-0 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-1.5"
          >
            <span>Check</span>
            <Sparkles className="w-3.5 h-3.5 text-black" />
          </button>
        )}
      </div>

      {/* Gentle Feedback Message & Retry Button */}
      {feedback && !feedback.isCorrect && (
        <div className="w-full max-w-md p-3 rounded-2xl bg-amber-950/70 border border-amber-400/80 text-amber-200 text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-2 animate-fadeIn shadow-md">
          <div className="flex items-center gap-1.5 text-amber-300 font-black">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>Hint:</span>
          </div>
          <p className="leading-snug">{feedback.message}</p>
          <button
            onClick={handleRetryClick}
            type="button"
            className="px-4 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shadow transition-all flex items-center gap-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Try Again</span>
          </button>
        </div>
      )}

      {/* Optional Touch-Friendly Keypad (visible for numbers, helpful on tablets / touch) */}
      {showKeypad && type === 'number' && !feedback?.isCorrect && !disabled && (
        <div className="w-full max-w-xs flex flex-col gap-1.5 p-2 rounded-2xl bg-[#031d16]/90 border border-emerald-500/40 shadow-inner">
          <div className="grid grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleKeypadDigit(d)}
                className="py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-white font-mono font-black text-base hover:scale-105 active:scale-95 transition-all cursor-pointer shadow"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[6, 7, 8, 9, 0].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => handleKeypadDigit(d)}
                className="py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/50 text-white font-mono font-black text-base hover:scale-105 active:scale-95 transition-all cursor-pointer shadow"
              >
                {d}
              </button>
            ))}
          </div>
          <div className="grid grid-cols-2 gap-1.5 pt-0.5">
            <button
              type="button"
              onClick={handleKeypadBackspace}
              className="py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 font-bold text-xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              ⌫ Backspace
            </button>
            <button
              type="button"
              onClick={handleKeypadClear}
              className="py-1.5 rounded-xl bg-emerald-900/60 hover:bg-emerald-800 border border-emerald-500/40 text-emerald-200 font-bold text-xs hover:scale-102 active:scale-98 transition-all cursor-pointer"
            >
              Clear
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { MATH_O_LANTERN_LEVELS } from '../../data/mathOLanternData';
import LanternTrail from './LanternTrail';
import WitchyCharacter from './WitchyCharacter';
import MathOLanternCelebration from './MathOLanternCelebration';
import { sounds } from '../../audio/soundEffects';
import { RotateCcw, Undo2, Plus, Compass, BookOpen, Target } from 'lucide-react';

/**
 * LanternSandbox Component
 * Free exploratory sandbox allowing children to experiment with different valid jumping sequences
 * from the smaller number to the destination number.
 * 
 * Supports:
 * - Choosing a specific next target number (e.g. reach 50 instead of 40)
 * - Automatic calculation of the increment from current to target
 * - Choosing fixed increment hops (+1, +5, +10, +25, +50, +100)
 * - Typing custom jumps
 * - Gentle explanations preventing backward or overshooting jumps
 */
export default function LanternSandbox({ onOpenStory }) {
  const [selectedLevelIdx, setSelectedLevelIdx] = useState(0);
  const activeLevel = MATH_O_LANTERN_LEVELS[selectedLevelIdx] || MATH_O_LANTERN_LEVELS[0];

  const [currentNumber, setCurrentNumber] = useState(activeLevel.subtrahend);
  const [completedJumps, setCompletedJumps] = useState([]);
  const [totalCollected, setTotalCollected] = useState(0);
  const [customJumpInput, setCustomJumpInput] = useState('');
  const [customTargetInput, setCustomTargetInput] = useState('');
  const [sandboxMessage, setSandboxMessage] = useState(
    'Choose any jump or next target! Watch how different paths all lead to the exact same difference.'
  );
  const [isCelebrationOpen, setIsCelebrationOpen] = useState(false);

  // Derive dynamic milestones along the trail
  const milestones = [
    activeLevel.subtrahend,
    ...completedJumps.map((j) => j.to),
    ...(currentNumber < activeLevel.minuend ? [activeLevel.minuend] : []),
  ].filter((v, i, a) => a.indexOf(v) === i); // unique

  const remaining = activeLevel.minuend - currentNumber;

  // Handle Level Selection
  const handleSelectLevel = (idx) => {
    sounds.playPop();
    const lvl = MATH_O_LANTERN_LEVELS[idx] || MATH_O_LANTERN_LEVELS[0];
    setSelectedLevelIdx(idx);
    setCurrentNumber(lvl.subtrahend);
    setCompletedJumps([]);
    setTotalCollected(0);
    setCustomJumpInput('');
    setCustomTargetInput('');
    setIsCelebrationOpen(false);
    setSandboxMessage(`Explore any jumps you like to get from ${lvl.subtrahend} to ${lvl.minuend}!`);
  };

  // Reset current trail
  const handleReset = () => {
    sounds.playPop();
    setCurrentNumber(activeLevel.subtrahend);
    setCompletedJumps([]);
    setTotalCollected(0);
    setCustomJumpInput('');
    setCustomTargetInput('');
    setIsCelebrationOpen(false);
    setSandboxMessage('Trail reset. Pick your first jump or target!');
  };

  // Undo last jump
  const handleUndo = () => {
    if (completedJumps.length === 0) return;
    sounds.playPop();
    const nextJumps = [...completedJumps];
    const removed = nextJumps.pop();
    setCompletedJumps(nextJumps);
    setCurrentNumber(removed.from);
    setTotalCollected((prev) => prev - removed.increment);
    setSandboxMessage(`Undid jump of +${removed.increment}. Ghostie is back at ${removed.from}.`);
  };

  // Execute a jump by increment
  const executeJump = (inc, reason = '') => {
    const increment = Number(inc);
    if (isNaN(increment) || increment <= 0) {
      setSandboxMessage('Please pick a jump greater than 0!');
      return;
    }

    const nextVal = currentNumber + increment;
    if (nextVal > activeLevel.minuend) {
      sounds.playWrong();
      setSandboxMessage(
        `A jump of +${increment} reaches ${nextVal}, which overshoots the destination ${activeLevel.minuend}! Ghostie only needs +${remaining} more.`
      );
      return;
    }

    sounds.playLanternJump();
    sounds.playSuccess();
    const newJump = { from: currentNumber, to: nextVal, increment };
    setCompletedJumps((prev) => [...prev, newJump]);
    setCurrentNumber(nextVal);
    setTotalCollected((prev) => prev + increment);
    setCustomJumpInput('');
    setCustomTargetInput('');

    if (nextVal === activeLevel.minuend) {
      setSandboxMessage(`🎉 Fantastic! You reached ${activeLevel.minuend}! Total lanterns collected: ${totalCollected + increment}.`);
      setTimeout(() => {
        sounds.playSuccess();
        setIsCelebrationOpen(true);
      }, 700);
    } else {
      const extraMsg = reason ? ` (${reason})` : '';
      setSandboxMessage(`Great jump of +${increment}${extraMsg}! Ghostie reached ${nextVal}. ${activeLevel.minuend - nextVal} lanterns left to reach ${activeLevel.minuend}.`);
    }
  };

  // Jump directly to a chosen target number (e.g. choose 50 instead of 40)
  const jumpToTarget = (targetVal) => {
    const target = Number(targetVal);
    if (isNaN(target)) {
      setSandboxMessage('Please enter a valid target number!');
      return;
    }

    if (target <= currentNumber) {
      sounds.playWrong();
      setSandboxMessage(
        `${target} is behind or at Ghostie's current position (${currentNumber})! We are counting forward to reach ${activeLevel.minuend}, so pick a number greater than ${currentNumber}.`
      );
      return;
    }

    if (target > activeLevel.minuend) {
      sounds.playWrong();
      setSandboxMessage(
        `${target} is past the destination (${activeLevel.minuend})! Choose a target between ${currentNumber + 1} and ${activeLevel.minuend}.`
      );
      return;
    }

    const increment = target - currentNumber;
    executeJump(increment, `to reach target ${target}`);
  };

  // Quick jump benchmark targets
  const nextTen = Math.ceil((currentNumber + 1) / 10) * 10;
  const jumpToTen = nextTen <= activeLevel.minuend && nextTen > currentNumber ? nextTen - currentNumber : null;

  const nextFifty = Math.ceil((currentNumber + 1) / 50) * 50;
  const jumpToFifty = nextFifty <= activeLevel.minuend && nextFifty > currentNumber && nextFifty !== nextTen ? nextFifty - currentNumber : null;

  const nextHundred = Math.ceil((currentNumber + 1) / 100) * 100;
  const jumpToHundred = nextHundred <= activeLevel.minuend && nextHundred > currentNumber && nextHundred !== nextTen && nextHundred !== nextFifty ? nextHundred - currentNumber : null;

  return (
    <div className="w-full flex flex-col gap-3 max-w-6xl mx-auto px-2 sm:px-4 py-2">
      {/* 1. LEVEL SELECTOR TABS & CONTROLS */}
      <div className="flex flex-wrap items-center justify-between gap-2 bg-[#081824]/90 p-2 sm:p-2.5 rounded-2xl border border-teal-500/40 backdrop-blur-md">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-xl bg-teal-400 text-black flex items-center justify-center text-base shadow font-black shrink-0">
            🧪
          </span>
          <div className="flex flex-col text-left">
            <span className="text-[10px] uppercase tracking-wider text-teal-300 font-black">
              Lantern Sandbox
            </span>
            <span className="text-xs font-bold text-gray-300">
              Invent your own jumping sequence to find the distance
            </span>
          </div>
        </div>

        {/* Problem selector tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-thin">
          {MATH_O_LANTERN_LEVELS.map((lvl, idx) => {
            const isCurrent = idx === selectedLevelIdx;
            return (
              <button
                key={lvl.id}
                onClick={() => handleSelectLevel(idx)}
                type="button"
                className={`px-3 py-1.5 rounded-xl font-bold text-xs whitespace-nowrap transition-all cursor-pointer flex items-center gap-1 ${
                  isCurrent
                    ? 'bg-amber-400 text-black font-black shadow-md scale-105'
                    : 'bg-teal-950/60 hover:bg-teal-900 text-teal-200 border border-teal-700/50'
                }`}
              >
                <span>{lvl.isTutorial ? '⭐ Tutorial' : `Prob ${lvl.levelNumber}`}</span>
                <span className="font-mono text-[10px] opacity-80">
                  ({lvl.minuend}−{lvl.subtrahend})
                </span>
              </button>
            );
          })}
        </div>

        {/* Story Button */}
        {onOpenStory && (
          <button
            onClick={() => {
              sounds.playPop();
              onOpenStory();
            }}
            type="button"
            className="p-1.5 sm:px-2.5 sm:py-1 rounded-xl bg-purple-900/70 hover:bg-purple-800 text-amber-300 border border-purple-500/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer shadow"
            title="Read Ghostie's Story"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-300" />
            <span className="hidden sm:inline">Ghostie's Story</span>
          </button>
        )}
      </div>

      {/* 2. DYNAMIC LANTERN TRAIL */}
      <LanternTrail
        startNumber={activeLevel.subtrahend}
        targetNumber={activeLevel.minuend}
        currentNumber={currentNumber}
        milestones={milestones}
        completedJumps={completedJumps}
        totalCollected={totalCollected}
        isCompleted={currentNumber === activeLevel.minuend}
      />

      {/* 3. INTERACTIVE JUMP CONTROLS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5 items-start">
        {/* LEFT: Witchy Guidance & Status (5 cols) */}
        <div className="lg:col-span-5 flex flex-col gap-2.5">
          <WitchyCharacter
            speechText={sandboxMessage}
            dialogue={sandboxMessage}
            targetDescription={`Goal: ${activeLevel.minuend}`}
            onSpeak={() => sounds.speak(sandboxMessage)}
          />

          {/* Sandbox Status Card */}
          <div className="bg-[#051724]/85 border border-teal-500/30 rounded-2xl p-3 text-xs text-teal-100 flex flex-col gap-2">
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-1.5">
              <span className="font-bold text-amber-300">Ghostie's Position:</span>
              <span className="font-mono font-black text-white text-sm">
                {currentNumber} / {activeLevel.minuend}
              </span>
            </div>
            <div className="flex items-center justify-between border-b border-teal-500/20 pb-1.5">
              <span className="font-bold text-amber-300">Distance to Target:</span>
              <span className="font-mono font-black text-teal-300 text-sm">
                +{remaining} lanterns
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-bold text-amber-300">Total Collected:</span>
              <span className="font-mono font-black text-amber-400 text-sm">
                {totalCollected} lanterns
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT: Quick Jump Presets, Target Chooser, & Custom Input (7 cols) */}
        <div className="lg:col-span-7 bg-gradient-to-b from-[#0b2434] via-[#071a26] to-[#041018] border-2 border-teal-400/80 rounded-3xl p-3.5 sm:p-5 shadow-xl flex flex-col gap-3">
          <div className="flex items-center justify-between border-b border-teal-500/30 pb-2">
            <div className="flex items-center gap-2">
              <Compass className="w-4 h-4 text-amber-400" />
              <span className="text-sm font-black text-white uppercase tracking-wide">
                Pick Your Next Jump
              </span>
            </div>

            {/* Undo & Reset buttons */}
            <div className="flex items-center gap-1.5">
              <button
                onClick={handleUndo}
                disabled={completedJumps.length === 0}
                type="button"
                className="px-2.5 py-1 rounded-xl bg-teal-900/60 hover:bg-teal-800 disabled:opacity-40 text-teal-200 border border-teal-600/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Undo last jump"
              >
                <Undo2 className="w-3.5 h-3.5" />
                <span>Undo</span>
              </button>

              <button
                onClick={handleReset}
                type="button"
                className="px-2.5 py-1 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/50 text-xs font-bold flex items-center gap-1 transition-all cursor-pointer"
                title="Reset trail"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            </div>
          </div>

          {/* A. SMART BENCHMARK BUTTONS */}
          <div className="flex flex-col gap-1.5">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">
              Jump to Next Friendly Benchmark:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {/* Jump to Next Ten */}
              {jumpToTen && (
                <button
                  onClick={() => executeJump(jumpToTen, `reached friendly ten ${nextTen}`)}
                  type="button"
                  className="py-2.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-100 border border-teal-400/60 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer shadow-sm hover:scale-102 transition-transform"
                >
                  <span className="text-amber-300 font-black text-sm">+{jumpToTen} 🏮</span>
                  <span className="text-[10px] text-gray-300">Reach {nextTen}</span>
                </button>
              )}

              {/* Jump to Next Fifty */}
              {jumpToFifty && (
                <button
                  onClick={() => executeJump(jumpToFifty, `reached benchmark ${nextFifty}`)}
                  type="button"
                  className="py-2.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-100 border border-teal-400/60 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer shadow-sm hover:scale-102 transition-transform"
                >
                  <span className="text-amber-300 font-black text-sm">+{jumpToFifty} 🏮</span>
                  <span className="text-[10px] text-gray-300">Reach {nextFifty}</span>
                </button>
              )}

              {/* Jump to Next Hundred */}
              {jumpToHundred && (
                <button
                  onClick={() => executeJump(jumpToHundred, `reached friendly hundred ${nextHundred}`)}
                  type="button"
                  className="py-2.5 px-3 rounded-xl bg-teal-900/80 hover:bg-teal-800 text-teal-100 border border-teal-400/60 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer shadow-sm hover:scale-102 transition-transform"
                >
                  <span className="text-amber-300 font-black text-sm">+{jumpToHundred} 🏮</span>
                  <span className="text-[10px] text-gray-300">Reach {nextHundred}</span>
                </button>
              )}

              {/* Jump All The Way to Destination */}
              {remaining > 0 && remaining !== jumpToTen && remaining !== jumpToHundred && (
                <button
                  onClick={() => executeJump(remaining, `reached final destination ${activeLevel.minuend}`)}
                  type="button"
                  className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500/40 to-emerald-500/40 hover:from-amber-500/60 hover:to-emerald-500/60 text-white border border-amber-400/80 font-bold text-xs flex flex-col items-center gap-0.5 cursor-pointer shadow-sm hover:scale-102 transition-transform"
                >
                  <span className="text-amber-300 font-black text-sm">+{remaining} 🏮</span>
                  <span className="text-[10px] text-white">Reach Goal ({activeLevel.minuend})</span>
                </button>
              )}
            </div>
          </div>

          {/* B. CHOOSE A SPECIFIC NEXT TARGET NUMBER */}
          <div className="flex flex-col gap-1.5 border-t border-teal-500/30 pt-2">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide flex items-center gap-1">
              <Target className="w-3.5 h-3.5 text-amber-400" />
              <span>Or Choose a Target Number (e.g. 50, 100, 200):</span>
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                jumpToTarget(customTargetInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min={currentNumber + 1}
                max={activeLevel.minuend}
                value={customTargetInput}
                onChange={(e) => setCustomTargetInput(e.target.value)}
                placeholder={`Target number (e.g. 50, 100)...`}
                className="flex-1 bg-black/60 border-2 border-teal-500/60 rounded-xl px-3 py-1.5 text-white font-mono text-sm focus:outline-hidden focus:border-amber-400 shadow-inner"
              />
              <button
                type="submit"
                disabled={!customTargetInput}
                className="py-2 px-3.5 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-40 text-black font-black text-xs sm:text-sm shadow flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <span>Jump to Target</span>
              </button>
            </form>
          </div>

          {/* C. FIXED QUICK JUMP BUTTONS (+1, +5, +10, +25, +50, +100) */}
          <div className="flex flex-col gap-1.5 border-t border-teal-500/30 pt-2">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">
              Quick Increment Hops:
            </span>
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {[1, 5, 10, 25, 50, 100].map((inc) => {
                const canJump = currentNumber + inc <= activeLevel.minuend;
                return (
                  <button
                    key={inc}
                    onClick={() => executeJump(inc)}
                    disabled={!canJump}
                    type="button"
                    className={`py-2 px-1 rounded-xl font-mono font-black text-xs sm:text-sm border-2 transition-all cursor-pointer ${
                      canJump
                        ? 'bg-teal-950 hover:bg-teal-800 border-teal-500 text-teal-200 hover:text-white hover:border-amber-400 shadow-sm hover:scale-105 active:scale-95'
                        : 'bg-slate-900/60 border-slate-800 text-gray-600 opacity-40 cursor-not-allowed'
                    }`}
                  >
                    +{inc}
                  </button>
                );
              })}
            </div>
          </div>

          {/* D. CUSTOM JUMP INCREMENT INPUT */}
          <div className="flex flex-col gap-1.5 border-t border-teal-500/30 pt-2">
            <span className="text-[11px] font-bold text-teal-300 uppercase tracking-wide">
              Or Type Any Lantern Increment (+N):
            </span>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeJump(customJumpInput);
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min="1"
                max={remaining}
                value={customJumpInput}
                onChange={(e) => setCustomJumpInput(e.target.value)}
                placeholder={`Type increment (1 to ${remaining})...`}
                className="flex-1 bg-black/60 border-2 border-teal-500/60 rounded-xl px-3 py-1.5 text-white font-mono text-sm focus:outline-hidden focus:border-amber-400 shadow-inner"
              />
              <button
                type="submit"
                disabled={!customJumpInput || Number(customJumpInput) <= 0}
                className="py-2 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 disabled:opacity-40 text-black font-black text-sm shadow flex items-center gap-1 transition-all cursor-pointer shrink-0"
              >
                <Plus className="w-4 h-4" />
                <span>Jump</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* 4. CELEBRATION MODAL ON DESTINATION REACHED */}
      <MathOLanternCelebration
        isOpen={isCelebrationOpen}
        minuend={activeLevel.minuend}
        subtrahend={activeLevel.subtrahend}
        diff={activeLevel.diff}
        completedJumps={completedJumps}
        levelTitle={`Sandbox: ${activeLevel.title}`}
        onNextLevel={() => handleSelectLevel((selectedLevelIdx + 1) % MATH_O_LANTERN_LEVELS.length)}
        onPlayAgain={handleReset}
        onOpenSandbox={handleReset}
        hasNextLevel={selectedLevelIdx < MATH_O_LANTERN_LEVELS.length - 1}
      />
    </div>
  );
}

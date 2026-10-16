import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, Sparkles, RotateCcw, Trophy, Check, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePoloDashCourse } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';
import PoloAnswerInput from './PoloAnswerInput';
import PoloCounter from './PoloCounter';

/**
 * PoloDash Component
 * Prerequisite educational runner-inspired obstacle course game.
 * 
 * Direct-Answer Typing Upgrade:
 * - Runner tracks 3 lanes (Left: 0, Center: 1, Right: 2) collecting loose Polos.
 * - Approaching an obstacle slows and pauses the runner at a safe checkpoint.
 * - The obstacle challenge is presented with a direct numeric typing field (zero MCQs).
 * - Typing the correct answer unlocks the gate, plays a dash animation through the obstacle,
 *   and awards +10 bonus Polos and +100 score.
 * - Safe input handling: keyboard typing in the answer field does NOT steer the runner.
 */
export default function PoloDash({
  onComplete,
  onReturnToStages,
}) {
  const [course, setCourse] = useState(() => generatePoloDashCourse());
  const [currentObstacleIdx, setCurrentObstacleIdx] = useState(0);
  const [playerLane, setPlayerLane] = useState(1); // 0 = Left, 1 = Center, 2 = Right
  const [score, setScore] = useState(0);
  const [polosCollected, setPolosCollected] = useState(0);
  const [isDashing, setIsDashing] = useState(false);
  const [isObstacleCleared, setIsObstacleCleared] = useState(false);
  const [isCourseFinished, setIsCourseFinished] = useState(false);

  // Track collectible items in lanes for running fun
  const [trackCandies, setTrackCandies] = useState([
    { id: 1, lane: 0, collected: false },
    { id: 2, lane: 1, collected: false },
    { id: 3, lane: 2, collected: false },
  ]);

  const currentObstacle = course[currentObstacleIdx] || course[0];

  // Move player lane helper
  const moveToLane = useCallback((targetLane) => {
    if (targetLane < 0 || targetLane > 2 || isDashing) return;
    sounds.playPop();
    setPlayerLane(targetLane);

    // Collect any candy in that lane
    setTrackCandies((prev) =>
      prev.map((item) => {
        if (item.lane === targetLane && !item.collected) {
          sounds.playPop();
          setPolosCollected((p) => p + 1);
          setScore((s) => s + 10);
          return { ...item, collected: true };
        }
        return item;
      })
    );
  }, [isDashing]);

  // Handle correct typed answer submission from PoloAnswerInput
  const handleAnswerSubmit = ({ isCorrect }) => {
    if (!isCorrect || isDashing || isCourseFinished || isObstacleCleared) return;

    sounds.playSuccess();
    setIsObstacleCleared(true);
    setIsDashing(true);
    setScore((s) => s + 100);
    setPolosCollected((p) => p + 10);

    // Animate runner dashing through the unlocked obstacle
    setTimeout(() => {
      setIsDashing(false);
      setIsObstacleCleared(false);

      if (currentObstacleIdx + 1 < course.length) {
        setCurrentObstacleIdx((idx) => idx + 1);
        setPlayerLane(1);
        // Respawn fresh track candies for the next leg
        setTrackCandies([
          { id: Date.now() + 1, lane: 0, collected: false },
          { id: Date.now() + 2, lane: 1, collected: false },
          { id: Date.now() + 3, lane: 2, collected: false },
        ]);
      } else {
        // Entire course finished!
        sounds.playVictory();
        try {
          confetti({ particleCount: 90, spread: 70, origin: { y: 0.6 } });
        } catch {
          // ignore
        }
        setIsCourseFinished(true);
        if (onComplete) {
          onComplete();
        }
      }
    }, 1500);
  };

  // Keyboard navigation listener (disabled while child is typing into input)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCourseFinished || isDashing) return;
      // If typing in any input element, ignore runner steering keys
      if (e.target && (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA')) {
        return;
      }

      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
        moveToLane(Math.max(0, playerLane - 1));
      } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
        moveToLane(Math.min(2, playerLane + 1));
      } else if (e.key === '1') {
        moveToLane(0);
      } else if (e.key === '2') {
        moveToLane(1);
      } else if (e.key === '3') {
        moveToLane(2);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerLane, isCourseFinished, isDashing, moveToLane]);

  const restartCourse = () => {
    setCourse(generatePoloDashCourse());
    setCurrentObstacleIdx(0);
    setPlayerLane(1);
    setScore(0);
    setPolosCollected(0);
    setIsDashing(false);
    setIsObstacleCleared(false);
    setIsCourseFinished(false);
    setTrackCandies([
      { id: 1, lane: 0, collected: false },
      { id: 2, lane: 1, collected: false },
      { id: 3, lane: 2, collected: false },
    ]);
    sounds.playPop();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 animate-fadeIn select-none">
      {/* Top Header Bar */}
      <div className="flex items-center justify-between gap-2 bg-[#09221b]/90 border border-emerald-500/50 rounded-2xl p-3 shadow-md">
        <button
          onClick={() => {
            sounds.playPop();
            if (onReturnToStages) onReturnToStages();
          }}
          type="button"
          className="px-3 py-1.5 rounded-xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Stage Hub</span>
        </button>

        {/* Checkpoint Progress Tracker */}
        <div className="flex items-center gap-2">
          <span className="text-sm font-black text-emerald-300 uppercase tracking-wider hidden sm:inline">
            Checkpoint {currentObstacleIdx + 1} of {course.length}
          </span>
          <div className="flex items-center gap-1">
            {course.map((_, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-full transition-all ${
                  i < currentObstacleIdx
                    ? 'bg-emerald-400'
                    : i === currentObstacleIdx
                    ? 'bg-amber-400 scale-125 ring-2 ring-amber-300 animate-pulse'
                    : 'bg-emerald-950 border border-emerald-800'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Counters */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black shadow-sm">
            <span>🍬</span>
            <span>{polosCollected} Polos</span>
          </div>
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-xl bg-amber-400/20 border border-amber-400 text-amber-300 text-xs font-black">
            <span>⭐ {score} pts</span>
          </div>
        </div>
      </div>

      {/* Main Course Area */}
      {!isCourseFinished ? (
        <div className="relative bg-[#061d16]/95 border-3 border-emerald-400/80 rounded-[36px] p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-md flex flex-col gap-4 overflow-hidden">
          
          {/* 3-Lane Runner Track with Perspective */}
          <div className="relative h-64 sm:h-72 w-full rounded-3xl bg-gradient-to-b from-[#021811] via-[#052c20] to-[#083829] border-2 border-emerald-500/50 shadow-inner overflow-hidden flex flex-col justify-between p-3">
            {/* Ambient Speed Lines */}
            <div className={`absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(52,211,153,0.3)_20px,rgba(52,211,153,0.3)_22px)] ${
              isDashing ? 'animate-pulse' : ''
            }`} />

            {/* Lane Dividers */}
            <div className="absolute inset-y-0 left-1/3 w-0.5 border-r border-dashed border-emerald-400/30" />
            <div className="absolute inset-y-0 left-2/3 w-0.5 border-r border-dashed border-emerald-400/30" />

            {/* Top: Checkpoint Obstacle Barrier Across All 3 Lanes */}
            <div className="relative z-10 w-full pt-1">
              <div className={`w-full p-2.5 sm:p-3 rounded-2xl border-2 transition-all flex items-center justify-between shadow-lg ${
                isObstacleCleared
                  ? 'bg-emerald-400/30 border-emerald-300 shadow-[0_0_30px_rgba(52,211,153,0.8)] scale-102'
                  : 'bg-gradient-to-r from-emerald-950 via-[#073223] to-emerald-950 border-amber-400/80 shadow-[0_0_20px_rgba(251,191,36,0.4)]'
              }`}>
                <div className="flex items-center gap-2">
                  <span className="text-2xl sm:text-3xl animate-bounce">
                    {currentObstacle.obstacleIcon}
                  </span>
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] font-black uppercase text-amber-300 tracking-wider">
                      Place-Value Obstacle #{currentObstacleIdx + 1}
                    </span>
                    <span className="text-xs sm:text-sm font-black text-white">
                      {isObstacleCleared ? 'Barrier Unlocked! Dashing through!' : 'Gate Locked • Type Answer Below To Clear'}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-black/40 border border-emerald-400/50 text-emerald-300 text-xs font-black">
                  {isObstacleCleared ? (
                    <span className="text-emerald-400 flex items-center gap-1 font-black">
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>CLEARED!</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1 text-amber-300">
                      <Zap className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
                      <span>Locked Gate</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Middle: Floating Collectible Candies on Lanes */}
            <div className="relative z-10 grid grid-cols-3 w-full py-2">
              {trackCandies.map((item, idx) => (
                <div key={item.id} className="flex justify-center items-center">
                  {!item.collected ? (
                    <div
                      onClick={() => moveToLane(idx)}
                      className="cursor-pointer animate-float hover:scale-125 transition-transform"
                      title="Tap or steer here to collect loose Polo!"
                    >
                      <PoloCounter size="sm" numberLabel="+1" />
                    </div>
                  ) : (
                    <span className="text-xs font-black text-emerald-400/40 select-none">
                      ✨
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Bottom: Player Pip Runner in Current Lane */}
            <div className="relative z-10 grid grid-cols-3 w-full pb-1">
              {[0, 1, 2].map((laneIdx) => (
                <div key={laneIdx} className="flex justify-center items-end min-h-[80px]">
                  {playerLane === laneIdx && (
                    <div className={`flex flex-col items-center transition-all transform duration-300 ${
                      isDashing
                        ? 'scale-130 -translate-y-24 animate-bounce'
                        : 'animate-float'
                    }`}>
                      {/* Pip Character Runner Avatar */}
                      <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-white">
                        🐧
                      </div>
                      <span className="mt-1 px-2.5 py-0.5 rounded-full bg-emerald-950/90 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase tracking-wider shadow">
                        Pip Runner
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Steer Lane Buttons (Accessible tap/mouse controls) */}
          <div className="flex items-center justify-center gap-2">
            <span className="text-xs text-emerald-300/80 font-bold hidden sm:inline mr-2">
              Steer Pip:
            </span>
            <button
              onClick={() => moveToLane(0)}
              disabled={isDashing}
              type="button"
              className={`px-3 sm:px-4 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                playerLane === 0
                  ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                  : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
              }`}
            >
              ◀ Left Lane
            </button>
            <button
              onClick={() => moveToLane(1)}
              disabled={isDashing}
              type="button"
              className={`px-3 sm:px-4 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                playerLane === 1
                  ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                  : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
              }`}
            >
              ▲ Center Lane
            </button>
            <button
              onClick={() => moveToLane(2)}
              disabled={isDashing}
              type="button"
              className={`px-3 sm:px-4 py-1.5 rounded-xl border text-xs font-black transition-all cursor-pointer ${
                playerLane === 2
                  ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                  : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
              }`}
            >
              Right Lane ▶
            </button>
          </div>

          {/* Obstacle Question & Direct Answer Typing Panel */}
          <div className="bg-gradient-to-r from-emerald-950/95 via-[#083527]/95 to-emerald-950/95 border-2 border-emerald-400/80 rounded-2xl p-4 sm:p-5 shadow-lg flex flex-col items-center gap-3">
            <div className="flex items-center gap-2 text-xs font-black text-amber-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Checkpoint Question • Type Answer To Clear</span>
            </div>

            <h2 className="text-base sm:text-xl font-black text-white text-center">
              {currentObstacle.question}
            </h2>

            {/* Reusable Direct Typing Answer Input */}
            <PoloAnswerInput
              key={`dash_obs_${currentObstacle.id}_${currentObstacleIdx}`}
              targetValue={currentObstacle.acceptableAnswers || currentObstacle.targetValue}
              prefix={currentObstacle.equationPrompt ? currentObstacle.equationPrompt.replace('___', '') : ''}
              suffix={currentObstacle.unitSuffix}
              placeholder="Type answer..."
              helperTip={currentObstacle.helperTip}
              showKeypad={true}
              disabled={isDashing || isObstacleCleared}
              onSubmit={handleAnswerSubmit}
            />

            <p className="text-[11px] text-emerald-300/80 text-center max-w-md">
              💡 Type your answer and click <strong>Check</strong> or press <strong>Enter</strong> to dash through!
            </p>
          </div>
        </div>
      ) : (
        /* Course Finished Victory Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🏃‍♂️
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <Trophy className="w-4 h-4 text-amber-400" />
              <span>Prerequisite Cleared!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Polo Dash Complete!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              You ran the entire course and answered every place-value question correctly! Level 1 (Single-Digit Subtraction) is now unlocked!
            </p>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 p-3 bg-emerald-950/80 border border-emerald-500/60 rounded-2xl w-full max-w-sm">
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-emerald-300">Total Score</span>
              <span className="text-xl font-black text-amber-300 font-mono">{score} pts</span>
            </div>
            <div className="h-8 w-px bg-emerald-700/60" />
            <div className="flex flex-col items-center">
              <span className="text-xs font-semibold text-emerald-300">Polos Collected</span>
              <span className="text-xl font-black text-white font-mono">{polosCollected} 🍬</span>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-3">
            <button
              onClick={() => {
                sounds.playPop();
                if (onReturnToStages) onReturnToStages();
              }}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Unlock Level 1: Polo Takeaway</span>
              <Sparkles className="w-5 h-5 text-black" />
            </button>

            <button
              onClick={restartCourse}
              type="button"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500/60 text-emerald-200 font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Replay Polo Dash</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

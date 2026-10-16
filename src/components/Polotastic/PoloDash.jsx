import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeft, ArrowRight, Sparkles, RotateCcw, ShieldCheck } from 'lucide-react';
import confetti from 'canvas-confetti';
import { generatePoloDashCourse } from '../../data/polotasticQuestions';
import { sounds } from '../../audio/soundEffects';

/**
 * PoloDash Component
 * Prerequisite educational runner-inspired obstacle course game.
 * 
 * Features:
 * - 3-lane path (Left: 0, Middle: 1, Right: 2).
 * - Keyboard (ArrowLeft/ArrowRight, A/D, 1/2/3) and touch controls.
 * - Dynamic questions covering all four place-value units.
 * - Visual obstacle gates in each lane.
 * - Gentle correction without penalties or shame.
 * - Confetti celebration and unlocking Level 1 upon course completion.
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
  const [feedback, setFeedback] = useState(null); // { isCorrect: boolean, text: string }
  const [isDashing, setIsDashing] = useState(false);
  const [isCourseFinished, setIsCourseFinished] = useState(false);

  const currentObstacle = course[currentObstacleIdx] || course[0];

  // Move player lane helper
  const moveToLane = useCallback((targetLane) => {
    if (targetLane < 0 || targetLane > 2 || isDashing) return;
    sounds.playPop();
    setPlayerLane(targetLane);
  }, [isDashing]);

  // Handle steering into a lane or clicking "Dash Through"
  const handleConfirmLane = useCallback(() => {
    if (feedback !== null || isDashing || isCourseFinished) return;

    // Find the option in the player's current lane
    const chosenOption = currentObstacle.options.find((opt) => opt.lane === playerLane);
    if (!chosenOption) return;

    if (chosenOption.isCorrect) {
      sounds.playSuccess();
      setIsDashing(true);
      setFeedback({
        isCorrect: true,
        text: chosenOption.feedback,
      });
      setScore((s) => s + 100);
      setPolosCollected((p) => p + 10);

      // Dash celebration
      setTimeout(() => {
        setIsDashing(false);
        setFeedback(null);
        if (currentObstacleIdx + 1 < course.length) {
          setCurrentObstacleIdx((idx) => idx + 1);
          setPlayerLane(1); // reset to center lane for next obstacle
        } else {
          // Course finished!
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
      }, 1600);
    } else {
      sounds.playIncorrect();
      setFeedback({
        isCorrect: false,
        text: chosenOption.feedback,
      });
    }
  }, [feedback, isDashing, isCourseFinished, currentObstacle, playerLane, currentObstacleIdx, course.length, onComplete]);

  // Keyboard navigation listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (isCourseFinished) return;
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
      } else if (e.key === 'Enter' || e.key === ' ') {
        handleConfirmLane();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playerLane, isCourseFinished, moveToLane, handleConfirmLane]);

  const restartCourse = () => {
    setCourse(generatePoloDashCourse());
    setCurrentObstacleIdx(0);
    setPlayerLane(1);
    setScore(0);
    setPolosCollected(0);
    setFeedback(null);
    setIsDashing(false);
    setIsCourseFinished(false);
    sounds.playPop();
  };

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-3 animate-fadeIn select-none">
      {/* Top Bar */}
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

        {/* Progress Tracker */}
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

        {/* Counter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black shadow-sm">
            <span>🍬</span>
            <span>{polosCollected} Polos</span>
          </div>
        </div>
      </div>

      {/* Main Course Area */}
      {!isCourseFinished ? (
        <div className="relative bg-[#061d16]/95 border-3 border-emerald-400/80 rounded-[36px] p-4 sm:p-6 shadow-[0_0_50px_rgba(16,185,129,0.3)] backdrop-blur-md flex flex-col gap-4 overflow-hidden">
          {/* Question / Challenge Banner */}
          <div className="bg-gradient-to-r from-emerald-950/95 via-[#083527]/95 to-emerald-950/95 border-2 border-emerald-400/80 rounded-2xl p-3 sm:p-4 text-center shadow-md flex flex-col gap-1">
            <div className="flex items-center justify-center gap-2 text-xs font-black text-amber-300 uppercase tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Obstacle Question Ahead!</span>
            </div>
            <h2 className="text-lg sm:text-2xl font-black text-white">
              {currentObstacle.question}
            </h2>
            <p className="text-xs text-emerald-200/80">
              Steer Pip into the lane with the correct answer and dash through!
            </p>
          </div>

          {/* 3-Lane Runner Track with Perspective */}
          <div className="relative h-72 sm:h-80 w-full rounded-3xl bg-gradient-to-b from-[#021811] via-[#052c20] to-[#083829] border-2 border-emerald-500/50 shadow-inner overflow-hidden flex flex-col justify-between p-3">
            {/* Ambient Speed Lines */}
            <div className="absolute inset-0 pointer-events-none opacity-20 bg-[repeating-linear-gradient(0deg,transparent,transparent_20px,rgba(52,211,153,0.3)_20px,rgba(52,211,153,0.3)_22px)]" />

            {/* Lane Dividers */}
            <div className="absolute inset-y-0 left-1/3 w-0.5 border-r border-dashed border-emerald-400/30" />
            <div className="absolute inset-y-0 left-2/3 w-0.5 border-r border-dashed border-emerald-400/30" />

            {/* Top: 3 Obstacle Gates */}
            <div className="relative z-10 grid grid-cols-3 gap-2 w-full pt-1">
              {currentObstacle.options.map((opt) => {
                const isPlayerHere = playerLane === opt.lane;
                return (
                  <div
                    key={opt.id}
                    onClick={() => moveToLane(opt.lane)}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all cursor-pointer ${
                      isPlayerHere
                        ? 'bg-emerald-400/25 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.6)] scale-102'
                        : 'bg-emerald-950/70 border-emerald-600/40 hover:border-emerald-400 hover:bg-emerald-900/60'
                    }`}
                  >
                    <span className="text-2xl sm:text-3xl mb-1">{opt.icon}</span>
                    <span className="text-xs sm:text-sm font-black text-white text-center leading-tight">
                      {opt.text}
                    </span>
                    <span className="text-[10px] text-emerald-300 font-semibold mt-0.5">
                      Lane {opt.lane === 0 ? 'Left' : opt.lane === 1 ? 'Center' : 'Right'}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Bottom: Player Pip Runner in Current Lane */}
            <div className="relative z-10 grid grid-cols-3 w-full pb-2">
              {[0, 1, 2].map((laneIdx) => (
                <div key={laneIdx} className="flex justify-center items-end min-h-[90px]">
                  {playerLane === laneIdx && (
                    <div className={`flex flex-col items-center transition-all transform duration-300 ${
                      isDashing ? 'scale-125 -translate-y-16 animate-bounce' : 'animate-float'
                    }`}>
                      {/* Pip Character Avatar */}
                      <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-tr from-emerald-500 to-teal-300 flex items-center justify-center text-3xl sm:text-4xl shadow-[0_0_25px_rgba(16,185,129,0.8)] border-2 border-white">
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

          {/* Feedback Display / Gentle Tip */}
          {feedback && (
            <div className={`p-3.5 rounded-2xl text-xs sm:text-sm font-bold text-center flex flex-col items-center gap-1.5 animate-fadeIn ${
              feedback.isCorrect
                ? 'bg-emerald-500/20 border-2 border-emerald-400 text-emerald-200'
                : 'bg-amber-500/20 border-2 border-amber-400 text-amber-200'
            }`}>
              <div className="flex items-center gap-1.5 font-black text-white">
                {feedback.isCorrect ? (
                  <>
                    <Sparkles className="w-4 h-4 text-emerald-400" />
                    <span>Obstacle Cleared! Awesome job!</span>
                  </>
                ) : (
                  <>
                    <span>💡 Almost! Let's check:</span>
                  </>
                )}
              </div>
              <p>{feedback.text}</p>
              {!feedback.isCorrect && (
                <button
                  onClick={() => setFeedback(null)}
                  type="button"
                  className="mt-1 px-4 py-1 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs cursor-pointer shadow"
                >
                  Try Another Lane
                </button>
              )}
            </div>
          )}

          {/* Touch / Click Lane Controls & Dash Button */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-emerald-800/50">
            {/* Steering Buttons */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <button
                onClick={() => moveToLane(0)}
                type="button"
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  playerLane === 0
                    ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                    : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
                }`}
              >
                ◀ Left
              </button>

              <button
                onClick={() => moveToLane(1)}
                type="button"
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  playerLane === 1
                    ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                    : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
                }`}
              >
                ▲ Center
              </button>

              <button
                onClick={() => moveToLane(2)}
                type="button"
                className={`flex-1 sm:flex-initial px-4 py-3 rounded-xl border font-black text-xs transition-all cursor-pointer flex items-center justify-center gap-1 ${
                  playerLane === 2
                    ? 'bg-emerald-400 text-black border-emerald-300 shadow'
                    : 'bg-emerald-950 hover:bg-emerald-900 border-emerald-700 text-emerald-300'
                }`}
              >
                Right ▶
              </button>
            </div>

            {/* Big "Dash Through Obstacle" Button */}
            <button
              onClick={handleConfirmLane}
              disabled={isDashing || feedback !== null}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-sm sm:text-base shadow-[0_0_25px_rgba(255,180,0,0.7)] transition-all transform hover:scale-105 active:scale-95 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Dash Through Obstacle!</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>
          </div>
        </div>
      ) : (
        /* Course Completed Victory Screen */
        <div className="relative bg-gradient-to-b from-[#083022] via-[#052218] to-[#02130e] border-3 border-emerald-400 rounded-[36px] p-6 sm:p-9 text-center text-white shadow-[0_0_60px_rgba(16,185,129,0.5)] backdrop-blur-md flex flex-col items-center gap-4 animate-popIn">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-400 to-emerald-400 flex items-center justify-center text-4xl shadow-[0_0_30px_rgba(255,180,0,0.8)] border-2 border-white animate-bounce">
            🏆
          </div>

          <div className="flex flex-col gap-1">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-widest flex items-center justify-center gap-1">
              <ShieldCheck className="w-4 h-4 text-amber-400" />
              <span>Prerequisites Fully Satisfied!</span>
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-emerald-300 to-cyan-300 font-['Creepster',cursive] tracking-wide">
              Polo Dash Completed!
            </h2>
            <p className="text-sm text-emerald-100 max-w-md mx-auto mt-1">
              Pip safely cleared all obstacles! You have proven complete understanding of Ones, Rolls (Tens), Packets (Hundreds), and Cartons (Thousands).
            </p>
          </div>

          {/* Stats Badges */}
          <div className="flex flex-wrap items-center justify-center gap-3 my-2">
            <div className="px-4 py-2 rounded-2xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 font-black text-sm">
              🍬 {polosCollected} Polos Collected
            </div>
            <div className="px-4 py-2 rounded-2xl bg-amber-950/80 border border-amber-500/60 text-amber-300 font-black text-sm">
              ⭐ {score} Score Points
            </div>
            <div className="px-4 py-2 rounded-2xl bg-cyan-950/80 border border-cyan-500/60 text-cyan-300 font-black text-sm">
              🔓 Level 1 Unlocked!
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full mt-2">
            <button
              onClick={() => {
                sounds.playPop();
                if (onReturnToStages) onReturnToStages();
              }}
              type="button"
              className="w-full sm:w-auto px-8 py-3.5 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_30px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>Go to Level 1: Polo Takeaway</span>
              <ArrowRight className="w-5 h-5 text-black" />
            </button>

            <button
              onClick={restartCourse}
              type="button"
              className="w-full sm:w-auto px-5 py-3.5 rounded-2xl bg-emerald-950/80 hover:bg-emerald-900 border-2 border-emerald-500/60 text-emerald-200 font-black text-sm transition-all cursor-pointer flex items-center justify-center gap-2"
            >
              <RotateCcw className="w-4 h-4 text-emerald-400" />
              <span>Replay Course</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

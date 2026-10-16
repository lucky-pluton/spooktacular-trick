import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Lock, CheckCircle, Play, RotateCcw, BookOpen, Gamepad2 } from 'lucide-react';
import Guidebook from './Guidebook';
import PoloDash from './PoloDash';
import Level1Takeaway from './Level1Takeaway';
import Level2RollRemove from './Level2RollRemove';
import Level3BreakRoll from './Level3BreakRoll';
import PolotasticBorrowGame from './PolotasticBorrowGame';
import PolotasticNotebook from './PolotasticNotebook';
import PipCharacter from './PipCharacter';
import {
  getPolotasticProgress,
  savePolotasticProgress,
  resetPolotasticProgress,
  getStageStatus,
  POLOTASTIC_STAGES,
} from './polotasticStorage';
import { sounds } from '../../audio/soundEffects';

/**
 * PolotasticModule Component
 * 
 * Main Container for Polotastic:
 * - Two distinct modes:
 *   1. Play Mode: Hands-on Polo manipulatives, bundling animations, and guided column borrowing.
 *   2. Notebook Mode: Real school maths copybook with squared paper, vertical regrouping annotations, and printable worksheets.
 * - Complete 9-level progressive pathway from 1-digit through 4-digit subtraction with multi-step cascades.
 */
export default function PolotasticModule({ onReturnToModules }) {
  const [progress, setProgress] = useState(() => getPolotasticProgress());
  const [activeStageId, setActiveStageId] = useState('hub'); 
  // 'hub' | 'guidebook' | 'polo_dash' | 'level1'..'level9'
  
  const [activeMode, setActiveMode] = useState(() => progress.mode || 'play'); 
  // 'play' | 'notebook'
  
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Compute unlocked level numbers for notebook mode
  const unlockedLevelNumbers = [1, 2, 3, 4, 5, 6, 7, 8, 9].filter((lvl) => {
    return getStageStatus(`level${lvl}`, progress) !== 'locked';
  });

  const handleModeSwitch = (newMode) => {
    sounds.playPop();
    setActiveMode(newMode);
    savePolotasticProgress({ mode: newMode });
    if (newMode === 'notebook') {
      setActiveStageId('notebook');
    } else {
      setActiveStageId('hub');
    }
  };

  // Completion handlers for stages
  const handleStageComplete = (stageId, nextStageId, bonusPolos) => {
    const key = `${stageId}Completed`;
    const updated = savePolotasticProgress({
      [key]: true,
      polosCollected: (progress.polosCollected || 0) + bonusPolos,
    });
    setProgress(updated);
    if (nextStageId) {
      setActiveStageId(nextStageId);
    }
  };

  const handleReset = () => {
    const fresh = resetPolotasticProgress();
    setProgress(fresh);
    setShowResetConfirm(false);
    setActiveStageId('hub');
    setActiveMode('play');
    sounds.playPop();
  };

  return (
    <div className="w-full flex flex-col gap-3 min-h-[85vh] justify-between">
      {/* 1. MODULE SUB-NAVIGATION BAR */}
      <div className="w-full max-w-6xl mx-auto px-2 sm:px-4">
        <div className="bg-[#06241a]/95 border-2 border-emerald-400/80 rounded-3xl p-3 sm:p-4 backdrop-blur-md shadow-[0_0_35px_rgba(16,185,129,0.3)] flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Module Branding */}
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-gradient-to-tr from-emerald-300 via-teal-400 to-cyan-300 text-black flex items-center justify-center text-2xl shadow font-black shrink-0">
              🍬
            </span>
            <div className="flex flex-col text-left">
              <div className="flex items-center gap-2">
                <h2 className="text-lg sm:text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-200 font-['Creepster',cursive] tracking-wide leading-none">
                  Polotastic
                </h2>
                <span className="px-2 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400/60 text-emerald-300 text-[10px] font-black uppercase tracking-wider hidden xs:inline">
                  Four-Digit Subtraction & Place Value
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium line-clamp-1">
                Collect Polos, exchange bundles, and master borrowing through games and school maths copybook!
              </p>
            </div>
          </div>

          {/* Mode Switcher Tabs (Play Mode vs Notebook Mode) */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Play Mode Button */}
            <button
              onClick={() => handleModeSwitch('play')}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'play' && activeStageId !== 'notebook'
                  ? 'bg-emerald-400 text-black shadow-md font-black scale-102'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Gamepad2 className="w-3.5 h-3.5" />
              <span>Play Mode</span>
            </button>

            {/* Notebook Mode Button */}
            <button
              onClick={() => handleModeSwitch('notebook')}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeMode === 'notebook' || activeStageId === 'notebook'
                  ? 'bg-amber-400 text-black shadow-md font-black scale-102'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Notebook Mode</span>
            </button>

            {/* Stages Hub Button if in Play Mode */}
            {activeMode === 'play' && (
              <button
                onClick={() => {
                  sounds.playPop();
                  setActiveStageId('hub');
                }}
                type="button"
                className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                  activeStageId === 'hub'
                    ? 'bg-teal-400 text-black shadow-md font-black'
                    : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Stages Hub</span>
              </button>
            )}

            {/* Polos Collected Counter */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black shadow-sm">
              <span>🍬</span>
              <span>{progress.polosCollected || 0}</span>
            </div>

            {/* Back to Module Select */}
            {onReturnToModules && (
              <button
                onClick={() => {
                  sounds.playPop();
                  onReturnToModules();
                }}
                type="button"
                className="px-2.5 py-1.5 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 text-gray-300 hover:text-white border border-emerald-700/60 font-bold text-xs flex items-center gap-1 transition-all cursor-pointer"
                title="Return to module selection"
              >
                <ArrowLeft className="w-3.5 h-3.5 text-amber-400" />
                <span className="hidden sm:inline">Modules</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. MAIN WORKSPACE AREA */}
      <div className="w-full flex-1 flex flex-col justify-center">
        {/* VIEW 1: DEDICATED NOTEBOOK MODE */}
        {(activeMode === 'notebook' || activeStageId === 'notebook') && (
          <PolotasticNotebook
            initialLevel={unlockedLevelNumbers[unlockedLevelNumbers.length - 1] || 1}
            unlockedLevels={unlockedLevelNumbers}
            onReturnToHub={() => {
              setActiveMode('play');
              setActiveStageId('hub');
            }}
          />
        )}

        {/* VIEW 2: PLAY MODE - STAGES SELECTION HUB */}
        {activeMode === 'play' && activeStageId === 'hub' && (
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-5 animate-fadeIn">
            {/* Mascot Greeting */}
            <PipCharacter
              mood="happy"
              speechText="Welcome to Polotastic! Choose Play Mode to physically manipulate Polo containers and break bundles, or switch to Notebook Mode to write out calculations in your school maths copybook!"
              size="md"
            />

            {/* Mode Spotlight Banner */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                onClick={() => {
                  sounds.playPop();
                  setActiveStageId('guidebook');
                }}
                className="p-5 rounded-3xl bg-gradient-to-br from-emerald-950 via-[#072f23] to-[#031d16] border-2 border-emerald-400 shadow-lg cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                    🎮 Hands-On Learning
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    Play Mode: Polo Manipulatives
                  </h3>
                  <p className="text-xs text-emerald-100/80 mt-1 max-w-sm">
                    Physically unbundle rolls, packets, and cartons to discover place value!
                  </p>
                </div>
                <span className="text-4xl">🍬</span>
              </div>

              <div
                onClick={() => handleModeSwitch('notebook')}
                className="p-5 rounded-3xl bg-gradient-to-br from-amber-950/80 via-[#2f2208] to-[#1d1603] border-2 border-amber-400 shadow-lg cursor-pointer hover:scale-[1.01] transition-all flex items-center justify-between"
              >
                <div className="flex flex-col">
                  <span className="text-xs font-black uppercase text-amber-300 tracking-wider">
                    📝 School Maths Copybook
                  </span>
                  <h3 className="text-lg font-black text-white mt-1">
                    Notebook Mode: Written Regrouping
                  </h3>
                  <p className="text-xs text-amber-100/80 mt-1 max-w-sm">
                    Squared paper workspace, pencil regrouping annotations, and printable worksheets!
                  </p>
                </div>
                <span className="text-4xl">📖</span>
              </div>
            </div>

            {/* 9-Stage Progressive Learning Pathway Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {POLOTASTIC_STAGES.map((stg) => {
                const status = getStageStatus(stg.id, progress);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';

                return (
                  <div
                    key={stg.id}
                    onClick={() => {
                      if (!isLocked) {
                        sounds.playPop();
                        setActiveStageId(stg.id);
                      }
                    }}
                    role="button"
                    tabIndex={isLocked ? -1 : 0}
                    onKeyDown={(e) => {
                      if (!isLocked && (e.key === 'Enter' || e.key === ' ')) {
                        e.preventDefault();
                        sounds.playPop();
                        setActiveStageId(stg.id);
                      }
                    }}
                    className={`relative p-5 rounded-3xl border-2 flex flex-col justify-between gap-3 transition-all ${
                      isLocked
                        ? 'bg-[#071712]/70 border-gray-800 opacity-60 cursor-not-allowed'
                        : isCompleted
                        ? 'bg-gradient-to-br from-emerald-950/90 via-[#062c20]/90 to-[#031d16]/95 border-emerald-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:scale-[1.02] cursor-pointer'
                        : 'bg-gradient-to-br from-[#083022]/90 via-[#06241a]/90 to-[#021811]/95 border-amber-400/90 shadow-[0_0_25px_rgba(255,190,0,0.3)] hover:scale-[1.02] cursor-pointer'
                    }`}
                  >
                    {/* Top Tag & Status */}
                    <div className="flex items-center justify-between">
                      <span className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-400/60 text-2xl flex items-center justify-center">
                        {stg.icon}
                      </span>

                      {isLocked ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-gray-900 border border-gray-700 text-gray-400 text-[10px] font-black uppercase flex items-center gap-1">
                          <Lock className="w-3 h-3" />
                          <span>Locked</span>
                        </span>
                      ) : isCompleted ? (
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
                          <CheckCircle className="w-3 h-3 text-emerald-400" />
                          <span>Mastered</span>
                        </span>
                      ) : (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400 text-amber-300 text-[10px] font-black uppercase flex items-center gap-1">
                          <Sparkles className="w-3 h-3 text-amber-400" />
                          <span>Available</span>
                        </span>
                      )}
                    </div>

                    {/* Stage Info */}
                    <div className="flex flex-col">
                      <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400">
                        {stg.badge}
                      </span>
                      <h3 className="text-base sm:text-lg font-black text-white mt-0.5">
                        {stg.title}
                      </h3>
                      <p className="text-xs text-emerald-200/80 mt-1 leading-snug">
                        {stg.description}
                      </p>
                    </div>

                    {/* Prereq Notice or Play Button */}
                    <div className="pt-2 border-t border-emerald-800/40">
                      {isLocked ? (
                        <div className="text-[11px] font-semibold text-gray-400 flex items-center gap-1">
                          <Lock className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate">{stg.prereqText}</span>
                        </div>
                      ) : (
                        <div className="w-full py-2 px-3 rounded-xl bg-emerald-400 text-black font-black text-xs text-center flex items-center justify-center gap-1.5 shadow">
                          <Play className="w-3.5 h-3.5 fill-black" />
                          <span>{isCompleted ? 'Play Again' : 'Start Stage'}</span>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls: Reset Progress Option */}
            <div className="flex items-center justify-between text-xs text-emerald-300/80 px-2 pt-2 border-t border-emerald-900/60">
              <span>All progress is safely persisted in your browser.</span>
              <button
                onClick={() => setShowResetConfirm(true)}
                type="button"
                className="text-amber-400 hover:text-amber-300 underline cursor-pointer flex items-center gap-1 font-bold"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Polotastic Progress</span>
              </button>
            </div>
          </div>
        )}

        {/* PREREQUISITE 1: THE GUIDEBOOK */}
        {activeMode === 'play' && activeStageId === 'guidebook' && (
          <Guidebook
            isAlreadyCompleted={progress.guidebookCompleted}
            onComplete={() => handleStageComplete('guidebook', 'polo_dash', 20)}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* PREREQUISITE 2: POLO DASH RUNNER */}
        {activeMode === 'play' && activeStageId === 'polo_dash' && (
          <PoloDash
            onComplete={() => handleStageComplete('poloDash', 'level1', 50)}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 1: POLO TAKEAWAY */}
        {activeMode === 'play' && activeStageId === 'level1' && (
          <Level1Takeaway
            onComplete={() => handleStageComplete('level1', 'level2', 40)}
            onNextLevel={() => setActiveStageId('level2')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 2: ROLL & REMOVE */}
        {activeMode === 'play' && activeStageId === 'level2' && (
          <Level2RollRemove
            onComplete={() => handleStageComplete('level2', 'level3', 50)}
            onNextLevel={() => setActiveStageId('level3')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 3: BREAK A ROLL! */}
        {activeMode === 'play' && activeStageId === 'level3' && (
          <Level3BreakRoll
            onComplete={() => handleStageComplete('level3', 'level4', 60)}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 4: TWO-DIGIT TAKEAWAY */}
        {activeMode === 'play' && activeStageId === 'level4' && (
          <PolotasticBorrowGame
            levelNumber={4}
            onComplete={() => handleStageComplete('level4', 'level5', 70)}
            onNextLevel={() => setActiveStageId('level5')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 5: PACKET BREAKER */}
        {activeMode === 'play' && activeStageId === 'level5' && (
          <PolotasticBorrowGame
            levelNumber={5}
            onComplete={() => handleStageComplete('level5', 'level6', 80)}
            onNextLevel={() => setActiveStageId('level6')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 6: THE EMPTY TENS CHALLENGE */}
        {activeMode === 'play' && activeStageId === 'level6' && (
          <PolotasticBorrowGame
            levelNumber={6}
            onComplete={() => handleStageComplete('level6', 'level7', 90)}
            onNextLevel={() => setActiveStageId('level7')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 7: CARTON BREAKER */}
        {activeMode === 'play' && activeStageId === 'level7' && (
          <PolotasticBorrowGame
            levelNumber={7}
            onComplete={() => handleStageComplete('level7', 'level8', 100)}
            onNextLevel={() => setActiveStageId('level8')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 8: THOUSAND-LEVEL MASTERY */}
        {activeMode === 'play' && activeStageId === 'level8' && (
          <PolotasticBorrowGame
            levelNumber={8}
            onComplete={() => handleStageComplete('level8', 'level9', 120)}
            onNextLevel={() => setActiveStageId('level9')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* LEVEL 9: POLOTASTIC GRAND CHALLENGE */}
        {activeMode === 'play' && activeStageId === 'level9' && (
          <PolotasticBorrowGame
            levelNumber={9}
            onComplete={() => handleStageComplete('level9', null, 150)}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}
      </div>

      {/* Reset Confirmation Modal */}
      {showResetConfirm && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
        >
          <div className="bg-[#06241a] border-3 border-amber-400 rounded-3xl p-6 max-w-sm w-full text-center text-white flex flex-col gap-3 shadow-2xl animate-popIn">
            <span className="text-4xl">⚠️</span>
            <h3 className="text-xl font-black text-amber-300">Reset Progress?</h3>
            <p className="text-xs text-gray-300">
              This will lock Levels 1 through 9 and reset your earned Polos count so you can experience the progression from the beginning.
            </p>
            <div className="flex items-center justify-center gap-3 mt-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                type="button"
                className="px-4 py-2 rounded-xl bg-gray-800 text-gray-200 text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleReset}
                type="button"
                className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white text-xs font-black cursor-pointer shadow"
              >
                Yes, Reset
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useState } from 'react';
import { ArrowLeft, Sparkles, Lock, CheckCircle, Play, RotateCcw } from 'lucide-react';
import Guidebook from './Guidebook';
import PoloDash from './PoloDash';
import Level1Takeaway from './Level1Takeaway';
import Level2RollRemove from './Level2RollRemove';
import Level3BreakRoll from './Level3BreakRoll';
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
 * Dedicated container for the Polotastic Place-Value & Subtraction module.
 * 
 * Curriculum Progression:
 * 1. The Guidebook (Prerequisite 1: Learn the 4 place-value units & bundle exchanges)
 * 2. Polo Dash (Prerequisite 2: Runner game obstacle course testing units)
 * 3. Level 1: Polo Takeaway (Single-digit minus single-digit, no borrowing)
 * 4. Level 2: Roll & Remove (Two-digit minus one-digit, no borrowing)
 * 5. Level 3: Break a Roll! (Two-digit minus one-digit with borrowing / regrouping)
 */
export default function PolotasticModule({ onReturnToModules }) {
  const [progress, setProgress] = useState(() => getPolotasticProgress());
  const [activeStageId, setActiveStageId] = useState('hub'); // 'hub' | 'guidebook' | 'polo_dash' | 'level1' | 'level2' | 'level3'
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Stage completion handlers
  const handleCompleteGuidebook = () => {
    const updated = savePolotasticProgress({
      guidebookCompleted: true,
      polosCollected: (progress.polosCollected || 0) + 20,
    });
    setProgress(updated);
    setActiveStageId('polo_dash');
  };

  const handleCompletePoloDash = () => {
    const updated = savePolotasticProgress({
      poloDashCompleted: true,
      polosCollected: (progress.polosCollected || 0) + 50,
    });
    setProgress(updated);
    setActiveStageId('level1');
  };

  const handleCompleteLevel1 = () => {
    const updated = savePolotasticProgress({
      level1Completed: true,
      polosCollected: (progress.polosCollected || 0) + 40,
    });
    setProgress(updated);
    setActiveStageId('level2');
  };

  const handleCompleteLevel2 = () => {
    const updated = savePolotasticProgress({
      level2Completed: true,
      polosCollected: (progress.polosCollected || 0) + 60,
    });
    setProgress(updated);
    setActiveStageId('level3');
  };

  const handleCompleteLevel3 = () => {
    const updated = savePolotasticProgress({
      level3Completed: true,
      polosCollected: (progress.polosCollected || 0) + 100,
    });
    setProgress(updated);
  };

  const handleReset = () => {
    const fresh = resetPolotasticProgress();
    setProgress(fresh);
    setShowResetConfirm(false);
    setActiveStageId('hub');
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
                  Place Value & Subtraction
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium line-clamp-1">
                Collect Polos, build bigger numbers, exchange bundles, and master subtraction!
              </p>
            </div>
          </div>

          {/* Quick Stage Tabs & Hub Button */}
          <div className="flex items-center gap-2 flex-wrap justify-center">
            {/* Stage Hub Tab */}
            <button
              onClick={() => {
                sounds.playPop();
                setActiveStageId('hub');
              }}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                activeStageId === 'hub'
                  ? 'bg-emerald-400 text-black shadow-md font-black scale-102'
                  : 'text-emerald-200 hover:text-white hover:bg-emerald-900/60'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Stages Hub</span>
            </button>

            {/* Quick Level Shortcuts for Unlocked Stages */}
            <div className="hidden md:flex items-center gap-1 bg-black/40 p-1 rounded-2xl border border-emerald-500/30">
              {POLOTASTIC_STAGES.map((stg) => {
                const status = getStageStatus(stg.id, progress);
                const isLocked = status === 'locked';
                const isCompleted = status === 'completed';
                const isActive = activeStageId === stg.id;

                return (
                  <button
                    key={stg.id}
                    onClick={() => {
                      if (!isLocked) {
                        sounds.playPop();
                        setActiveStageId(stg.id);
                      }
                    }}
                    disabled={isLocked}
                    type="button"
                    title={isLocked ? stg.prereqText : stg.title}
                    className={`px-2.5 py-1 rounded-xl text-xs font-bold flex items-center gap-1 transition-all ${
                      isActive
                        ? 'bg-amber-400 text-black font-black'
                        : isLocked
                        ? 'opacity-35 cursor-not-allowed text-gray-400'
                        : isCompleted
                        ? 'text-emerald-300 hover:bg-emerald-900/50 cursor-pointer'
                        : 'text-white hover:bg-emerald-900/50 cursor-pointer'
                    }`}
                  >
                    <span>{stg.icon}</span>
                    <span>{stg.badge}</span>
                    {isCompleted && <span className="text-[10px]">✓</span>}
                  </button>
                );
              })}
            </div>

            {/* Polos Collected Counter */}
            <div className="flex items-center gap-1 px-3 py-1 rounded-xl bg-emerald-950/80 border border-emerald-500/60 text-emerald-300 text-xs font-black shadow-sm">
              <span>🍬</span>
              <span>{progress.polosCollected || 0}</span>
            </div>

            {/* Back to Modules */}
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
        {/* VIEW A: STAGES SELECTION HUB */}
        {activeStageId === 'hub' && (
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-5 animate-fadeIn">
            {/* Mascot Greeting */}
            <PipCharacter
              mood="happy"
              speechText="Welcome to Polotastic! Start with The Guidebook to discover how single Polos bundle into Rolls, Packets, and Cartons. Then race through Polo Dash to unlock Level 1 Subtraction!"
              size="md"
            />

            {/* Stage Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                          <span>{stg.prereqText}</span>
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
              <span>All progress is safely saved on this device.</span>
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

        {/* VIEW B: THE GUIDEBOOK */}
        {activeStageId === 'guidebook' && (
          <Guidebook
            isAlreadyCompleted={progress.guidebookCompleted}
            onComplete={handleCompleteGuidebook}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* VIEW C: POLO DASH RUNNER */}
        {activeStageId === 'polo_dash' && (
          <PoloDash
            isAlreadyCompleted={progress.poloDashCompleted}
            onComplete={handleCompletePoloDash}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* VIEW D: LEVEL 1 POLO TAKEAWAY */}
        {activeStageId === 'level1' && (
          <Level1Takeaway
            isAlreadyCompleted={progress.level1Completed}
            onComplete={handleCompleteLevel1}
            onNextLevel={() => setActiveStageId('level2')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* VIEW E: LEVEL 2 ROLL & REMOVE */}
        {activeStageId === 'level2' && (
          <Level2RollRemove
            isAlreadyCompleted={progress.level2Completed}
            onComplete={handleCompleteLevel2}
            onNextLevel={() => setActiveStageId('level3')}
            onReturnToStages={() => setActiveStageId('hub')}
          />
        )}

        {/* VIEW F: LEVEL 3 BREAK A ROLL! */}
        {activeStageId === 'level3' && (
          <Level3BreakRoll
            isAlreadyCompleted={progress.level3Completed}
            onComplete={handleCompleteLevel3}
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
              This will lock Levels 1, 2, and 3 and reset your Polos count so you can experience the adventure from the beginning.
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

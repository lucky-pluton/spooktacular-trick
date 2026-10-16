import React, { useState } from 'react';
import { ArrowLeft, ArrowRight, RotateCcw, Check, Sparkles } from 'lucide-react';
import confetti from 'canvas-confetti';
import PoloCounter from './PoloCounter';
import PoloRoll from './PoloRoll';
import PoloPacket from './PoloPacket';
import PoloCarton from './PoloCarton';
import PipCharacter from './PipCharacter';
import PoloAnswerInput from './PoloAnswerInput';
import { sounds } from '../../audio/soundEffects';

/**
 * Guidebook Component
 * Interactive place-value primer teaching the four Polo units and exchange equivalence:
 * 1. Ones: 1 Polo = 1 one
 * 2. Tens: 10 Polos = 1 Roll = 1 ten
 * 3. Hundreds: 10 Rolls = 1 Packet = 100 ones
 * 4. Thousands: 10 Packets = 1 Carton = 1,000 ones
 * 5. Direct-Entry Knowledge Check: ALL questions require typing (zero MCQs).
 */
export default function Guidebook({
  onComplete,
  onReturnToStages,
  isAlreadyCompleted = false,
}) {
  const [currentScene, setCurrentScene] = useState(0); // 0: Ones, 1: Tens, 2: Hundreds, 3: Thousands, 4: Knowledge Check
  const [animState, setAnimState] = useState('idle'); // 'idle' | 'bundling' | 'bundled' | 'unbundling'
  const [interactivePoloCount, setInteractivePoloCount] = useState(5);
  
  // Knowledge Check State (Direct typing questions)
  const [quizStep, setQuizStep] = useState(0);
  const [quizScore, setQuizScore] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [isCompleted, setIsCompleted] = useState(isAlreadyCompleted);

  const switchScene = (idx) => {
    sounds.playPop();
    setAnimState('idle');
    setQuizFeedback(null);
    setCurrentScene(idx);
  };

  // Scene metadata
  const scenes = [
    {
      id: 'ones',
      title: 'Chapter 1: The Single Polo',
      badge: 'Unit 1 • The One',
      unitName: '1 Polo = 1 One',
      pipMood: 'waving',
      speech: 'Meet the single Polo! Just like a single digit, one Polo counts as one. Tap the buttons to add or remove Polos, then type your count below!',
      renderContent: () => (
        <div className="flex flex-col items-center gap-5 w-full">
          {/* Main Visual Display */}
          <div className="flex flex-col items-center justify-center p-6 bg-[#031d16]/70 border-2 border-emerald-500/50 rounded-3xl w-full max-w-md shadow-inner">
            <div className="text-xs font-black uppercase text-emerald-300 tracking-wider mb-2">
              Single Polo Counter
            </div>
            
            {/* Dynamic Polo Cluster */}
            <div className="flex flex-wrap items-center justify-center gap-3 min-h-[90px] p-3">
              {interactivePoloCount === 0 ? (
                <span className="text-sm text-emerald-400/60 italic font-medium">
                  Zero Polos! Tap + to add one.
                </span>
              ) : (
                Array.from({ length: interactivePoloCount }).map((_, idx) => (
                  <PoloCounter
                    key={idx}
                    size="md"
                    label={`Polo #${idx + 1}`}
                    numberLabel={idx + 1}
                  />
                ))
              )}
            </div>

            {/* Prompt Readout without giving answer */}
            <div className="mt-3 text-sm font-black text-emerald-300 font-mono">
              Plate Status: <span className="text-white">Count each loose Polo</span>
            </div>
          </div>

          {/* Child Interaction Controls */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => {
                if (interactivePoloCount > 0) {
                  sounds.playPop();
                  setInteractivePoloCount((c) => c - 1);
                }
              }}
              disabled={interactivePoloCount <= 0}
              type="button"
              className="px-4 py-2 rounded-2xl bg-emerald-950 hover:bg-emerald-900 border border-emerald-500 text-emerald-300 font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              − Remove 1 Polo
            </button>

            <button
              onClick={() => {
                if (interactivePoloCount < 9) {
                  sounds.playPop();
                  setInteractivePoloCount((c) => c + 1);
                }
              }}
              disabled={interactivePoloCount >= 9}
              type="button"
              className="px-5 py-2 rounded-2xl bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-300 hover:to-teal-300 text-black font-black text-sm disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow cursor-pointer"
            >
              + Add 1 Polo
            </button>
          </div>

          {/* Direct typing exercise for Chapter 1 */}
          <div className="w-full max-w-sm mt-1 p-3 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider text-center">
              Type the number of Polos currently on the plate:
            </span>
            <PoloAnswerInput
              key={`c1_${interactivePoloCount}`}
              targetValue={interactivePoloCount}
              prefix="Polos = "
              suffix="ones"
              placeholder="?"
              helperTip="Count each single Polo on the plate from left to right."
              showKeypad={false}
            />
          </div>

          <p className="text-xs text-emerald-200/80 text-center max-w-sm">
            💡 Notice: Between 1 and 9 Polos, they remain loose individual units!
          </p>
        </div>
      ),
    },
    {
      id: 'tens',
      title: 'Chapter 2: The Ten Roll',
      badge: 'Unit 2 • The Ten',
      unitName: '10 Polos = 1 Roll = 1 Ten',
      pipMood: 'guiding',
      speech: 'When you collect enough individual Polos, they group together to form 1 Roll! How many loose Polos make 1 roll? Type your answer below to bundle!',
      renderContent: () => (
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 p-6 bg-[#031d16]/70 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl shadow-inner min-h-[200px]">
            {/* Left: 10 loose Polos */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
              animState === 'bundled' ? 'opacity-30 scale-90' : 'opacity-100'
            }`}>
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                10 Individual Polos
              </span>
              <div className="grid grid-cols-5 gap-2 max-w-[200px] justify-items-center">
                {Array.from({ length: 10 }).map((_, idx) => (
                  <PoloCounter key={idx} size="sm" numberLabel={idx + 1} />
                ))}
              </div>
              <span className="text-xs font-bold text-white bg-emerald-900/80 px-2.5 py-0.5 rounded-full">
                Value = 10
              </span>
            </div>

            {/* Center: Equal Sign and Animation Trigger */}
            <div className="flex flex-col items-center gap-2 text-center">
              <span className="text-3xl font-black text-amber-300">==</span>
              <button
                onClick={() => {
                  sounds.playPop();
                  if (animState === 'bundled') {
                    setAnimState('unbundling');
                    setTimeout(() => setAnimState('idle'), 600);
                  } else {
                    setAnimState('bundling');
                    setTimeout(() => setAnimState('bundled'), 600);
                  }
                }}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-black font-black text-xs shadow-md transition-all cursor-pointer flex items-center gap-1"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>{animState === 'bundled' ? 'Break Roll' : 'Bundle Roll'}</span>
              </button>
            </div>

            {/* Right: 1 Ten Roll */}
            <div className={`flex flex-col items-center gap-2 transition-all duration-500 ${
              animState === 'idle' ? 'opacity-30 scale-90' : 'opacity-100 scale-105'
            }`}>
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                1 Whole Roll
              </span>
              <PoloRoll size="md" showBadge={false} />
              <span className="text-xs font-bold text-white bg-emerald-900/80 px-2.5 py-0.5 rounded-full">
                Value = 10
              </span>
            </div>
          </div>

          {/* Direct typing equation for Chapter 2 */}
          <div className="w-full max-w-md p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider text-center">
              How many loose Polos make 1 roll? Type the number to bundle:
            </span>
            <PoloAnswerInput
              targetValue={10}
              prefix="1 roll = "
              suffix="individual Polos"
              placeholder="___"
              helperTip="Count the individual Polos shown on the left to see how many make a full roll."
              showKeypad={false}
              onSubmit={({ isCorrect }) => {
                if (isCorrect) {
                  setAnimState('bundling');
                  setTimeout(() => setAnimState('bundled'), 600);
                }
              }}
            />
          </div>

          <div className="p-3 bg-emerald-950/90 border border-emerald-400/60 rounded-2xl max-w-lg text-center text-xs text-emerald-200">
            <strong className="text-white">The Golden Place-Value Rule:</strong> Exchanging 10 loose Polos for 1 roll does NOT change the total number of candies! You still have 10 Polos.
          </div>
        </div>
      ),
    },
    {
      id: 'hundreds',
      title: 'Chapter 3: The Hundred Packet',
      badge: 'Unit 3 • The Hundred',
      unitName: '10 Rolls = 1 Packet = 100 Ones',
      pipMood: 'happy',
      speech: 'What if you collect 10 rolls? Ten rolls of 10 Polos make 100 Polos! We pack them into 1 Packet. Type the missing values below!',
      renderContent: () => (
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-[#031d16]/70 border-2 border-emerald-500/50 rounded-3xl w-full max-w-2xl shadow-inner">
            {/* Left: 10 Rolls Display */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-black uppercase text-emerald-300 tracking-wider">
                10 Rolls (10 × 10)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-emerald-900/60 border border-emerald-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold text-emerald-200"
                  >
                    <span>🥖</span>
                    <span>Roll #{i + 1}</span>
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-white bg-emerald-900/80 px-2.5 py-0.5 rounded-full mt-1">
                Value = 100
              </span>
            </div>

            {/* Equals */}
            <div className="text-3xl font-black text-amber-300">==</div>

            {/* Right: 1 Packet */}
            <div className="flex flex-col items-center gap-1.5">
              <PoloPacket showContents={true} />
            </div>
          </div>

          {/* Direct typing equation for Chapter 3 */}
          <div className="w-full max-w-md p-3.5 bg-emerald-950/80 border border-emerald-500/50 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-black text-emerald-300 uppercase tracking-wider text-center">
              Complete the equation for 1 Packet:
            </span>
            <PoloAnswerInput
              targetValue={100}
              prefix="1 packet = "
              suffix="individual Polos"
              placeholder="___"
              helperTip="Count by tens across the 10 rolls to find how many Polos fit into 1 packet."
              showKeypad={false}
            />
          </div>

          <div className="p-3 bg-emerald-950/90 border border-emerald-400/60 rounded-2xl max-w-lg text-center text-xs text-emerald-200">
            <strong className="text-white">Did You Know?</strong> 1 Packet contains exactly 10 tens or 100 individual Polos. That's why it represents the <strong className="text-emerald-300">Hundreds</strong> column!
          </div>
        </div>
      ),
    },
    {
      id: 'thousands',
      title: 'Chapter 4: The Thousand Carton',
      badge: 'Unit 4 • The Thousand',
      unitName: '10 Packets = 1 Carton = 1,000 Ones',
      pipMood: 'cheering',
      speech: 'Now for our biggest delivery! Pack 10 Packets of 100 into 1 delivery Carton. 10 hundreds = 1,000 Polos! You now know all four place-value units!',
      renderContent: () => (
        <div className="flex flex-col items-center gap-5 w-full">
          <div className="flex flex-col md:flex-row items-center justify-center gap-6 p-6 bg-[#041b24]/70 border-2 border-cyan-500/50 rounded-3xl w-full max-w-2xl shadow-inner">
            {/* Left: 10 Packets List */}
            <div className="flex flex-col items-center gap-1.5">
              <span className="text-xs font-black uppercase text-cyan-300 tracking-wider">
                10 Packets (10 × 100)
              </span>
              <div className="grid grid-cols-2 gap-1.5">
                {Array.from({ length: 10 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1 bg-cyan-950/60 border border-cyan-500/40 px-2 py-0.5 rounded-lg text-[10px] font-bold text-cyan-200"
                  >
                    <span>📦</span>
                    <span>100 Polos</span>
                  </div>
                ))}
              </div>
              <span className="text-xs font-bold text-white bg-cyan-900/80 px-2.5 py-0.5 rounded-full mt-1">
                Value = 1,000
              </span>
            </div>

            {/* Equals */}
            <div className="text-3xl font-black text-amber-300">==</div>

            {/* Right: 1 Carton */}
            <div className="flex flex-col items-center gap-1.5">
              <PoloCarton showContents={true} />
            </div>
          </div>

          {/* Direct typing equation for Chapter 4 */}
          <div className="w-full max-w-md p-3.5 bg-[#031d24]/90 border border-cyan-500/50 rounded-2xl flex flex-col items-center gap-2">
            <span className="text-xs font-black text-cyan-300 uppercase tracking-wider text-center">
              Complete the equation for 1 Carton:
            </span>
            <PoloAnswerInput
              targetValue={[1000, '1000', '1,000']}
              prefix="1 carton = "
              suffix="individual Polos"
              placeholder="___"
              helperTip="Count by hundreds across the 10 packets to find how many Polos fit into a delivery carton."
              showKeypad={false}
            />
          </div>

          {/* Place Value Master Table */}
          <div className="w-full max-w-lg bg-emerald-950/90 border border-emerald-500/60 rounded-2xl p-3 text-center text-xs">
            <span className="font-black text-amber-300 uppercase tracking-wider block mb-1.5">
              The 4 Polo Place-Value Units
            </span>
            <div className="grid grid-cols-4 gap-1 text-[11px] font-semibold text-emerald-200">
              <div className="p-1 rounded bg-emerald-900/50">1 Polo = 1</div>
              <div className="p-1 rounded bg-emerald-900/50">1 Roll = 10</div>
              <div className="p-1 rounded bg-emerald-900/50">1 Packet = 100</div>
              <div className="p-1 rounded bg-emerald-900/50">1 Carton = 1,000</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'quiz',
      title: 'Chapter 5: Mini Knowledge Check',
      badge: 'Completion Exercise',
      unitName: 'Prove Your Place-Value Mastery',
      pipMood: 'thinking',
      speech: 'Time to put your place-value skills to the test! Type the correct numbers to complete the Guidebook and unlock Polo Dash!',
      renderContent: () => {
        // Direct-typing questions (ZERO multiple-choice options)
        const quizQuestions = [
          {
            q: 'How many individual Polos make exactly 1 roll?',
            prefix: '1 roll = ',
            suffix: 'individual Polos',
            targetValue: 10,
            tip: 'Think about how many single units group together to make 1 ten.',
            successText: '10 individual Polos = 1 Roll!',
          },
          {
            q: 'How many individual Polos are in 1 packet (10 rolls)?',
            prefix: '1 packet = ',
            suffix: 'loose Polos',
            targetValue: 100,
            tip: 'Count by tens across 10 rolls to find how many Polos are in 1 packet.',
            successText: '10 rolls of 10 = 100 Polos = 1 Packet!',
          },
          {
            q: 'How many loose Polos are in 1 delivery carton (10 packets)?',
            prefix: '1 carton = ',
            suffix: 'loose Polos',
            targetValue: [1000, '1000', '1,000'],
            tip: 'Count by hundreds across 10 packets to find how many Polos are in 1 carton.',
            successText: '10 packets of 100 = 1,000 Polos = 1 Carton!',
          },
        ];

        const curQ = quizQuestions[quizStep];

        return (
          <div className="flex flex-col items-center gap-5 w-full max-w-lg mx-auto">
            {quizStep < quizQuestions.length ? (
              <div className="w-full bg-[#031d16]/80 border-2 border-emerald-500/60 rounded-3xl p-5 sm:p-6 shadow-inner flex flex-col gap-4">
                <div className="flex items-center justify-between text-xs font-black text-emerald-400 uppercase">
                  <span>Question {quizStep + 1} of 3</span>
                  <span>Mastery Score: {quizScore}</span>
                </div>

                <h3 className="text-base sm:text-lg font-black text-white text-center leading-snug">
                  {curQ.q}
                </h3>

                {/* Direct Typing Input Box (Replaces all MCQs) */}
                <div className="py-2">
                  <PoloAnswerInput
                    key={`guide_quiz_${quizStep}`}
                    targetValue={curQ.targetValue}
                    prefix={curQ.prefix}
                    suffix={curQ.suffix}
                    placeholder="___"
                    helperTip={curQ.tip}
                    showKeypad={true}
                    onSubmit={({ isCorrect }) => {
                      if (isCorrect) {
                        setQuizScore((s) => s + 1);
                        setQuizFeedback({ correct: true, text: curQ.successText });
                      } else {
                        setQuizFeedback({ correct: false, text: curQ.tip });
                      }
                    }}
                  />
                </div>

                {/* Feedback & Advance Button */}
                {quizFeedback && quizFeedback.correct && (
                  <div className="p-3.5 rounded-2xl text-xs font-semibold flex flex-col gap-2 animate-fadeIn bg-emerald-500/20 border border-emerald-400 text-emerald-200">
                    <p className="font-bold text-white">🎉 {quizFeedback.text}</p>
                    <button
                      onClick={() => {
                        sounds.playPop();
                        setQuizFeedback(null);
                        setQuizStep((s) => s + 1);
                      }}
                      type="button"
                      className="self-end px-5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-black text-xs transition-colors cursor-pointer shadow flex items-center gap-1"
                    >
                      <span>Next Exercise →</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* Quiz Completed State */
              <div className="w-full bg-gradient-to-br from-emerald-950 to-[#04281e] border-3 border-emerald-400 rounded-3xl p-6 text-center text-white shadow-[0_0_40px_rgba(16,185,129,0.4)] flex flex-col items-center gap-3.5 animate-popIn">
                <div className="w-16 h-16 rounded-2xl bg-emerald-400 text-black flex items-center justify-center text-3xl font-black shadow-lg">
                  🏆
                </div>
                <h3 className="text-2xl font-black text-amber-300 font-['Creepster',cursive]">
                  Guidebook Completed!
                </h3>
                <p className="text-sm text-emerald-100 max-w-sm">
                  Fantastic job! You've typed and verified all four Polo place-value units. Polo Dash is now unlocked!
                </p>

                <button
                  onClick={() => {
                    sounds.playVictory();
                    try {
                      confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
                    } catch {
                      // ignore
                    }
                    setIsCompleted(true);
                    if (onComplete) onComplete();
                  }}
                  type="button"
                  className="mt-2 px-8 py-3 rounded-2xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 text-black font-black text-base shadow-[0_0_25px_rgba(16,185,129,0.8)] transition-all transform hover:scale-105 active:scale-95 cursor-pointer flex items-center gap-2"
                >
                  <Sparkles className="w-5 h-5 text-black" />
                  <span>Enter Polo Dash Runner!</span>
                  <ArrowRight className="w-5 h-5 text-black" />
                </button>
              </div>
            )}
          </div>
        );
      },
    },
  ];

  const current = scenes[currentScene];

  return (
    <div className="w-full max-w-4xl mx-auto px-3 sm:px-4 py-3 flex flex-col gap-4 animate-fadeIn select-none">
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

        <div className="flex items-center gap-2">
          <span className="text-lg">📖</span>
          <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wider">
            The Guidebook • {current.badge}
          </span>
        </div>

        {isCompleted && (
          <span className="px-2.5 py-1 rounded-full bg-emerald-400/20 border border-emerald-400 text-emerald-300 text-[10px] font-black uppercase flex items-center gap-1">
            <Check className="w-3 h-3 text-emerald-400" />
            <span>Completed</span>
          </span>
        )}
      </div>

      {/* Main Guidebook Card */}
      <div className="relative bg-[#061e17]/95 border-3 border-emerald-400/80 rounded-[36px] p-5 sm:p-7 shadow-[0_0_50px_rgba(16,185,129,0.25)] backdrop-blur-md flex flex-col gap-5">
        {/* Scene Title & Subtitle */}
        <div className="text-center flex flex-col gap-1">
          <span className="text-xs font-black text-amber-300 uppercase tracking-widest">
            {current.unitName}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-300 via-teal-200 to-cyan-300 font-['Creepster',cursive] tracking-wide">
            {current.title}
          </h2>
        </div>

        {/* Mascot Character Guidance with Voice Narration */}
        <PipCharacter
          mood={current.pipMood}
          speechText={current.speech}
          size="md"
        />

        {/* Dynamic Scene Content */}
        <div className="py-2">
          {current.renderContent()}
        </div>

        {/* Bottom Pagination & Navigation */}
        <div className="flex items-center justify-between pt-3 border-t border-emerald-800/60 mt-1">
          <button
            onClick={() => {
              if (currentScene > 0) {
                switchScene(currentScene - 1);
              }
            }}
            disabled={currentScene === 0}
            type="button"
            className="px-4 py-2 rounded-xl bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-600/60 text-emerald-300 text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer flex items-center gap-1.5"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Previous</span>
          </button>

          {/* Page Indicators */}
          <div className="flex items-center gap-1.5">
            {scenes.map((s, idx) => (
              <button
                key={idx}
                onClick={() => switchScene(idx)}
                type="button"
                className={`w-7 h-7 rounded-full text-xs font-black transition-all cursor-pointer ${
                  currentScene === idx
                    ? 'bg-emerald-400 text-black scale-110 shadow-[0_0_12px_rgba(16,185,129,0.8)]'
                    : 'bg-emerald-950/70 border border-emerald-700/60 text-emerald-400 hover:bg-emerald-900'
                }`}
              >
                {idx + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => {
              if (currentScene < scenes.length - 1) {
                switchScene(currentScene + 1);
              }
            }}
            disabled={currentScene === scenes.length - 1}
            type="button"
            className="px-4 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-xs font-black disabled:opacity-30 disabled:cursor-not-allowed transition-all shadow cursor-pointer flex items-center gap-1.5"
          >
            <span>Next</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

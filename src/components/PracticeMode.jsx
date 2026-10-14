import React, { useState } from 'react';
import { Sparkles, ArrowRight, CheckCircle2, RotateCcw } from 'lucide-react';
import { PRACTICE_PROBLEMS } from '../data/gameScenes';
import { sounds } from '../audio/soundEffects';

/**
 * PracticeMode Component
 * Interactive sandbox allowing children to apply the spooky borrowing trick
 * to other numbers across zeros (e.g. 400 - 65, 300 - 28).
 */
export default function PracticeMode({ onBackToStory }) {
  const [selectedProblemIndex, setSelectedProblemIndex] = useState(0);
  const problem = PRACTICE_PROBLEMS[selectedProblemIndex];

  // User input answers
  const [ansOnes, setAnsOnes] = useState('');
  const [ansTens, setAnsTens] = useState('');
  const [ansHundreds, setAnsHundreds] = useState('');
  const [checked, setChecked] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const correctOnes = (10 - (problem.subtrahend % 10)) % 10;
  const correctTens = 9 - Math.floor((problem.subtrahend % 100) / 10);
  const correctHundreds = Math.floor(problem.minuend / 100) - 1;

  const handleCheck = (e) => {
    e.preventDefault();
    const userTotal = parseInt(`${ansHundreds || 0}${ansTens || 0}${ansOnes || 0}`, 10);
    const right = userTotal === problem.diff;
    setChecked(true);
    setIsSuccess(right);

    if (right) {
      sounds.playSuccess();
    } else {
      sounds.playIncorrect();
    }
  };

  const handleReset = () => {
    setAnsOnes('');
    setAnsTens('');
    setAnsHundreds('');
    setChecked(false);
    setIsSuccess(false);
  };

  const handleSelectProblem = (idx) => {
    sounds.playPop();
    setSelectedProblemIndex(idx);
    handleReset();
  };

  return (
    <div className="w-full max-w-2xl mx-auto px-3 py-4 flex flex-col items-center">
      <div className="w-full bg-[#1b0d33] border-3 border-teal-400/80 rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-md">
        {/* Title Bar */}
        <div className="flex items-center justify-between pb-3 border-b border-teal-500/30 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-xl">🧪</span>
            <span className="font-extrabold text-sm sm:text-base text-teal-300 uppercase tracking-wider">
              Haunted Math Sandbox: Try Other Numbers!
            </span>
          </div>
          <button
            onClick={onBackToStory}
            type="button"
            className="text-xs text-gray-300 hover:text-white font-semibold underline"
          >
            Back to 500 − 53
          </button>
        </div>

        {/* Problem Selector Pills */}
        <div className="flex flex-wrap gap-2 mb-4 justify-center">
          {PRACTICE_PROBLEMS.map((prob, i) => (
            <button
              key={i}
              onClick={() => handleSelectProblem(i)}
              type="button"
              className={`px-3 py-1.5 rounded-xl font-bold text-xs sm:text-sm border transition-all ${
                i === selectedProblemIndex
                  ? 'bg-teal-500 text-black border-white shadow-md scale-105'
                  : 'bg-purple-900/60 text-purple-200 border-purple-700 hover:bg-purple-800'
              }`}
            >
              {prob.minuend} − {prob.subtrahend}
            </button>
          ))}
        </div>

        {/* Math Working Card */}
        <div className="bg-[#100620] border-2 border-purple-600/60 rounded-2xl p-4 sm:p-5 max-w-sm mx-auto shadow-inner text-center">
          <div className="text-xs text-amber-300 font-extrabold uppercase mb-2">
            Apply the Same Spooky Trick!
          </div>

          {/* Regrouped display */}
          <div className="grid grid-cols-3 gap-2 font-black text-sm text-amber-300 mb-1 border-b border-purple-800/60 pb-1">
            <div>[{Math.floor(problem.minuend / 100) - 1}]</div>
            <div>[9]</div>
            <div>[10]</div>
          </div>

          {/* Vertical numbers */}
          <div className="font-mono text-2xl sm:text-3xl font-extrabold text-right tracking-widest px-4 py-1 text-white">
            <div>&nbsp;{problem.minuend}</div>
            <div className="text-orange-400">− &nbsp;{problem.subtrahend < 100 ? ` ${problem.subtrahend}` : problem.subtrahend}</div>
          </div>

          <div className="border-b-3 border-amber-400 my-2" />

          {/* Inputs Row */}
          <form onSubmit={handleCheck} className="flex flex-col items-center gap-3">
            <div className="flex justify-center gap-2">
              <input
                type="number"
                min="0"
                max="9"
                placeholder="H"
                value={ansHundreds}
                onChange={(e) => setAnsHundreds(e.target.value.slice(-1))}
                className="w-12 h-12 text-center text-xl font-black bg-purple-950 border-2 border-purple-400 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="number"
                min="0"
                max="9"
                placeholder="T"
                value={ansTens}
                onChange={(e) => setAnsTens(e.target.value.slice(-1))}
                className="w-12 h-12 text-center text-xl font-black bg-teal-950 border-2 border-teal-400 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
              <input
                type="number"
                min="0"
                max="9"
                placeholder="O"
                value={ansOnes}
                onChange={(e) => setAnsOnes(e.target.value.slice(-1))}
                className="w-12 h-12 text-center text-xl font-black bg-amber-950 border-2 border-amber-400 rounded-xl text-white focus:outline-none focus:border-amber-400"
              />
            </div>

            <div className="flex gap-2">
              <button
                type="submit"
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-teal-400 to-emerald-400 hover:from-teal-300 hover:to-emerald-300 text-black font-extrabold text-sm shadow-md transition-transform hover:scale-105 active:scale-95"
              >
                Check Answer! ✨
              </button>
              <button
                type="button"
                onClick={handleReset}
                className="p-2 rounded-xl bg-gray-800 hover:bg-gray-700 text-gray-300 border border-gray-600"
                title="Clear"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Feedback */}
          {checked && (
            <div
              className={`mt-4 p-3 rounded-xl text-xs sm:text-sm font-bold border ${
                isSuccess
                  ? 'bg-emerald-950 border-emerald-400 text-emerald-200'
                  : 'bg-red-950 border-red-400 text-red-200'
              }`}
            >
              {isSuccess ? (
                <div>
                  🎉 Fantastic! {problem.minuend} − {problem.subtrahend} = <span className="text-white font-extrabold">{problem.diff}</span>!
                </div>
              ) : (
                <div>
                  Not quite! The regrouped numbers are {correctHundreds} hundreds, 9 tens, and 10 ones.
                  Try subtracting: 10−{problem.subtrahend % 10}, 9−{Math.floor((problem.subtrahend % 100) / 10)}, {correctHundreds}−0!
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

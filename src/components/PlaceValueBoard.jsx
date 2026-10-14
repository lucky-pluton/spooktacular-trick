import React from 'react';
import { HelpCircle, RotateCcw, RefreshCw } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * PlaceValueBoard Component
 * Displays the classroom notebook vertical subtraction algorithm:
 * 
 *        H      T      O
 *      [ 4 ]  [ 9 ]  [ 10 ]   <-- Regrouped digits (written above)
 *        5      0      0      <-- Original minuend (crossed out with red slashes)
 *     -  0      5      3      <-- Subtrahend
 *     ---------------------
 *        4      4      7      <-- Difference (evolves column by column: _ _ 7 -> _ 4 7 -> 4 4 7)
 * 
 * Accompanied by classroom notebook controls: [Hint] [Replay Step] [Restart Level]
 */
export default function PlaceValueBoard({
  boardState,
  highlightCol = null,
  showResult = false,
  answers = { H: null, T: null, O: null },
  minuend = 500,
  subtrahend = 53,
  diff = 447,
  onShowHint,
  onReplayStep,
  onRestartLevel,
}) {
  const { H, T, O } = boardState;
  const expectedH = Math.floor(diff / 100);
  const expectedT = Math.floor((diff % 100) / 10);
  const expectedO = diff % 10;

  const isSolved =
    showResult ||
    (answers.H !== null &&
      answers.T !== null &&
      answers.O !== null &&
      answers.H * 100 + answers.T * 10 + answers.O === diff);

  const isHActive = highlightCol === 'H' || highlightCol === 'HT';
  const isTActive = highlightCol === 'T' || highlightCol === 'HT' || highlightCol === 'TO';
  const isOActive = highlightCol === 'O' || highlightCol === 'TO';

  return (
    <div className="w-full max-w-md mx-auto bg-[#100722] border-3 border-purple-500/60 rounded-3xl p-3 sm:p-5 shadow-2xl backdrop-blur-md relative overflow-hidden flex flex-col justify-between">
      {/* Notebook Paper Top Header */}
      <div className="pb-2 border-b-2 border-purple-700/50 flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-base">📝</span>
          <span className="text-xs sm:text-sm font-black uppercase tracking-wider text-amber-300">
            Written Subtraction Board
          </span>
        </div>
        <span className="text-[10px] font-bold text-purple-300 uppercase px-2 py-0.5 rounded-full bg-purple-900/60 border border-purple-600/50">
          Notebook Working
        </span>
      </div>

      {/* Grid Working Area */}
      <div className="my-2 bg-[#0c041a] border-2 border-purple-800/60 rounded-2xl p-3 shadow-inner font-mono select-none">
        {/* Column Headers (H, T, O) with Place-value colors */}
        <div className="grid grid-cols-4 gap-2 text-center pb-1 border-b border-purple-800/60 text-xs sm:text-sm font-black">
          <div className="text-gray-500 font-sans text-[11px] font-bold flex items-center justify-end pr-1">
            Place:
          </div>
          <div
            className={`py-1 rounded-lg transition-all ${
              isHActive
                ? 'bg-purple-900/80 text-purple-200 ring-2 ring-purple-400 shadow-[0_0_12px_rgba(184,69,255,0.7)]'
                : 'text-purple-400'
            }`}
          >
            H <span className="text-[10px] block font-sans font-normal text-purple-300/80">(100s)</span>
          </div>
          <div
            className={`py-1 rounded-lg transition-all ${
              isTActive
                ? 'bg-teal-900/80 text-teal-200 ring-2 ring-teal-400 shadow-[0_0_12px_rgba(0,255,204,0.7)]'
                : 'text-teal-400'
            }`}
          >
            T <span className="text-[10px] block font-sans font-normal text-teal-300/80">(10s)</span>
          </div>
          <div
            className={`py-1 rounded-lg transition-all ${
              isOActive
                ? 'bg-amber-900/80 text-amber-200 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(255,180,0,0.7)]'
                : 'text-amber-400'
            }`}
          >
            O <span className="text-[10px] block font-sans font-normal text-amber-300/80">(1s)</span>
          </div>
        </div>

        {/* Regrouped Digits Row (Written Above) */}
        <div className="grid grid-cols-4 gap-2 py-1 text-center font-extrabold text-sm sm:text-base items-center">
          <div className="text-[10px] font-sans uppercase font-bold text-gray-500 text-right pr-1">
            Regroup:
          </div>

          {/* Hundreds Top */}
          <div className={`flex items-center justify-center h-8 rounded-lg transition-colors ${isHActive ? 'bg-purple-900/30' : ''}`}>
            {H.top ? (
              <span className="inline-block px-2 py-0.5 bg-purple-900/90 border-2 border-purple-400 text-purple-100 rounded-lg font-black text-xs sm:text-sm animate-popIn shadow">
                {H.top}
              </span>
            ) : (
              <span className="text-gray-700 font-mono text-xs">-</span>
            )}
          </div>

          {/* Tens Top (Shows 10 crossed out to 9 when regrouped to Ones) */}
          <div className={`flex items-center justify-center h-8 gap-1 rounded-lg transition-colors ${isTActive ? 'bg-teal-900/30' : ''}`}>
            {T.mid && (
              <span className="line-through text-red-400 decoration-red-500 decoration-2 text-xs font-bold font-mono">
                {T.mid}
              </span>
            )}
            {T.top ? (
              <span className="inline-block px-2 py-0.5 bg-teal-900/90 border-2 border-teal-400 text-teal-100 rounded-lg font-black text-xs sm:text-sm animate-popIn shadow">
                {T.top}
              </span>
            ) : (
              <span className="text-gray-700 font-mono text-xs">-</span>
            )}
          </div>

          {/* Ones Top */}
          <div className={`flex items-center justify-center h-8 rounded-lg transition-colors ${isOActive ? 'bg-amber-900/30' : ''}`}>
            {O.top ? (
              <span className="inline-block px-2 py-0.5 bg-amber-900/90 border-2 border-amber-400 text-amber-100 rounded-lg font-black text-xs sm:text-sm animate-popIn shadow">
                {O.top}
              </span>
            ) : (
              <span className="text-gray-700 font-mono text-xs">-</span>
            )}
          </div>
        </div>

        {/* Original Minuend Row with Conventional Strike-Throughs */}
        <div className="grid grid-cols-4 gap-2 py-1 text-center font-black text-xl sm:text-2xl text-white items-center">
          <div className="text-[10px] font-sans uppercase font-bold text-gray-500 text-right pr-1">
            Start:
          </div>

          {/* Hundreds Minuend */}
          <div className={`flex items-center justify-center h-8 rounded-lg transition-colors ${isHActive ? 'bg-purple-900/30' : ''}`}>
            <span
              className={`${
                H.crossed
                  ? 'line-through text-gray-500 decoration-red-500 decoration-3'
                  : 'text-purple-100'
              }`}
            >
              {H.orig}
            </span>
          </div>

          {/* Tens Minuend */}
          <div className={`flex items-center justify-center h-8 rounded-lg transition-colors ${isTActive ? 'bg-teal-900/30' : ''}`}>
            <span
              className={`${
                T.crossed
                  ? 'line-through text-gray-500 decoration-red-500 decoration-3'
                  : 'text-teal-100'
              }`}
            >
              {T.orig}
            </span>
          </div>

          {/* Ones Minuend */}
          <div className={`flex items-center justify-center h-8 rounded-lg transition-colors ${isOActive ? 'bg-amber-900/30' : ''}`}>
            <span
              className={`${
                O.crossed
                  ? 'line-through text-gray-500 decoration-red-500 decoration-3'
                  : 'text-amber-100'
              }`}
            >
              {O.orig}
            </span>
          </div>
        </div>

        {/* Subtrahend Row (− sub) */}
        <div className="grid grid-cols-4 gap-2 py-1 text-center font-black text-xl sm:text-2xl text-orange-400 items-center">
          <div className="font-extrabold text-2xl text-red-400 flex items-center justify-center">
            −
          </div>
          <div className={`rounded-lg transition-colors ${isHActive ? 'bg-purple-900/40 text-purple-200' : 'text-purple-300'}`}>
            {H.sub}
          </div>
          <div className={`rounded-lg transition-colors ${isTActive ? 'bg-teal-900/40 text-teal-200' : 'text-teal-300'}`}>
            {T.sub}
          </div>
          <div className={`rounded-lg transition-colors ${isOActive ? 'bg-amber-900/40 text-amber-200' : 'text-amber-300'}`}>
            {O.sub}
          </div>
        </div>

        {/* Classroom Notebook Fraction / Subtraction Line */}
        <div className="border-b-4 border-amber-400/90 my-1 rounded-full shadow" />

        {/* Difference Row (Evolves Step by Step: _ _ 7 -> _ 4 7 -> 4 4 7) */}
        <div className="grid grid-cols-4 gap-2 pt-1.5 text-center font-black text-2xl sm:text-3xl items-center">
          <div className="text-xs uppercase font-extrabold text-emerald-400 flex items-center justify-center">
            =
          </div>

          {/* Hundreds Column Answer */}
          <div className={`flex items-center justify-center h-10 rounded-xl transition-all ${isHActive ? 'bg-purple-900/50 ring-2 ring-purple-400 shadow-[0_0_12px_rgba(184,69,255,0.6)]' : ''}`}>
            {answers.H !== null ? (
              <span className="text-purple-300 animate-bounce">{answers.H}</span>
            ) : showResult || (boardState.step === 'subtracting' && boardState.H.ans !== null) ? (
              <span className="text-purple-300">{boardState.H.ans ?? expectedH}</span>
            ) : (
              <span className="text-gray-600 font-mono text-xl">_</span>
            )}
          </div>

          {/* Tens Column Answer */}
          <div className={`flex items-center justify-center h-10 rounded-xl transition-all ${isTActive ? 'bg-teal-900/50 ring-2 ring-teal-400 shadow-[0_0_12px_rgba(0,255,204,0.6)]' : ''}`}>
            {answers.T !== null ? (
              <span className="text-teal-300 animate-bounce">{answers.T}</span>
            ) : showResult || (boardState.step === 'subtracting' && boardState.T.ans !== null) ? (
              <span className="text-teal-300">{boardState.T.ans ?? expectedT}</span>
            ) : (
              <span className="text-gray-600 font-mono text-xl">_</span>
            )}
          </div>

          {/* Ones Column Answer */}
          <div className={`flex items-center justify-center h-10 rounded-xl transition-all ${isOActive ? 'bg-amber-900/50 ring-2 ring-amber-400 shadow-[0_0_12px_rgba(255,180,0,0.6)]' : ''}`}>
            {answers.O !== null ? (
              <span className="text-amber-300 animate-bounce">{answers.O}</span>
            ) : showResult || (boardState.step === 'subtracting' && boardState.O.ans !== null) ? (
              <span className="text-amber-300">{boardState.O.ans ?? expectedO}</span>
            ) : (
              <span className="text-gray-600 font-mono text-xl">_</span>
            )}
          </div>
        </div>
      </div>

      {/* Equation Status Footer */}
      <div className="text-center py-1 text-xs font-bold">
        {isSolved ? (
          <span className="text-emerald-300 text-sm tracking-wide">
            🎉 Solved: {minuend} − {subtrahend} = <span className="text-white font-extrabold">{diff}</span>
          </span>
        ) : (
          <span className="text-purple-300/80">
            Current Problem: <b className="text-amber-300">{minuend} − {subtrahend}</b>
          </span>
        )}
      </div>

      {/* Classroom Working Notebook Buttons: [Hint] [Replay Step] [Restart Level] */}
      <div className="pt-2 border-t border-purple-800/50 flex items-center justify-center gap-2 flex-wrap">
        {onShowHint && (
          <button
            onClick={() => {
              sounds.playPop();
              onShowHint();
            }}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/50 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow"
            title="Get a place-value clue"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Hint</span>
          </button>
        )}

        {onReplayStep && (
          <button
            onClick={() => {
              sounds.playPop();
              onReplayStep();
            }}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-purple-900/60 hover:bg-purple-800 text-purple-200 border border-purple-600/60 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow"
            title="Replay this calculation step"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Replay Step</span>
          </button>
        )}

        {onRestartLevel && (
          <button
            onClick={() => {
              sounds.playPop();
              onRestartLevel();
            }}
            type="button"
            className="px-3 py-1.5 rounded-xl bg-gray-900/80 hover:bg-gray-800 text-gray-300 border border-gray-700 text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer active:scale-95 shadow"
            title="Restart current problem from beginning"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Restart Level</span>
          </button>
        )}
      </div>
    </div>
  );
}

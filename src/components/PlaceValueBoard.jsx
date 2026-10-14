import React from 'react';

/**
 * PlaceValueBoard Component
 * Displays the formal mathematical vertical subtraction algorithm
 * with live animated cross-outs, regrouped top digits, and column highlights:
 * 
 *        H      T      O
 *      [ 4 ]  [ 9 ]  [ 10 ]   <-- Regrouped digits
 *        5      0      0      <-- Original minuend
 *     -  0      5      3      <-- Subtrahend
 *     ---------------------
 *        4      4      7      <-- Difference
 */
export default function PlaceValueBoard({
  boardState,
  highlightCol = null,
  showResult = false,
  answers = { H: null, T: null, O: null },
}) {
  const { H, T, O } = boardState;

  return (
    <div className="bg-[#120824] border-3 border-purple-500/50 rounded-2xl p-4 sm:p-5 shadow-2xl max-w-xs sm:max-w-sm w-full mx-auto relative overflow-hidden">
      {/* Decorative spiderweb in corner */}
      <div className="absolute top-1 right-2 text-xs text-purple-400/40 select-none">🕸️</div>

      {/* Board Title */}
      <div className="text-center pb-2.5 border-b border-purple-800/60 flex items-center justify-center gap-2">
        <span className="text-xs uppercase font-extrabold tracking-widest text-purple-300">
          Place-Value Math Board
        </span>
      </div>

      {/* Column Headers (H, T, O) */}
      <div className="grid grid-cols-4 gap-2 pt-3 pb-1 text-center font-extrabold text-sm sm:text-base border-b-2 border-purple-700/40">
        <div className="text-gray-500 font-mono text-xs flex items-center justify-center">Place:</div>
        <div className={`transition-colors py-0.5 rounded ${highlightCol === 'H' ? 'bg-purple-800/60 text-purple-300 ring-2 ring-purple-400' : 'text-purple-400'}`}>
          H <span className="text-[10px] block font-normal text-purple-300/80">(100s)</span>
        </div>
        <div className={`transition-colors py-0.5 rounded ${highlightCol === 'T' ? 'bg-teal-800/60 text-teal-300 ring-2 ring-teal-400' : 'text-teal-400'}`}>
          T <span className="text-[10px] block font-normal text-teal-300/80">(10s)</span>
        </div>
        <div className={`transition-colors py-0.5 rounded ${highlightCol === 'O' ? 'bg-amber-800/60 text-amber-300 ring-2 ring-amber-400' : 'text-amber-400'}`}>
          O <span className="text-[10px] block font-normal text-amber-300/80">(1s)</span>
        </div>
      </div>

      {/* Regrouped Digits Row (Top Row) */}
      <div className="grid grid-cols-4 gap-2 py-1.5 text-center font-extrabold text-sm sm:text-base">
        <div className="text-[10px] uppercase font-bold text-gray-500 flex items-center justify-end pr-1">
          Regroup:
        </div>

        {/* Hundreds Top */}
        <div className="flex items-center justify-center h-7">
          {H.top ? (
            <span className="inline-block px-1.5 py-0.5 bg-purple-900/90 border border-purple-400 text-purple-200 rounded font-black text-sm animate-pulse shadow">
              {H.top}
            </span>
          ) : (
            <span className="text-gray-700 font-mono">-</span>
          )}
        </div>

        {/* Tens Top (Could have intermediate 10 then 9) */}
        <div className="flex items-center justify-center h-7 gap-1">
          {T.mid && (
            <span className="line-through text-gray-500 text-xs font-bold">
              {T.mid}
            </span>
          )}
          {T.top ? (
            <span className="inline-block px-1.5 py-0.5 bg-teal-900/90 border border-teal-400 text-teal-200 rounded font-black text-sm animate-pulse shadow">
              {T.top}
            </span>
          ) : (
            <span className="text-gray-700 font-mono">-</span>
          )}
        </div>

        {/* Ones Top */}
        <div className="flex items-center justify-center h-7">
          {O.top ? (
            <span className="inline-block px-1.5 py-0.5 bg-amber-900/90 border border-amber-400 text-amber-200 rounded font-black text-sm animate-pulse shadow">
              {O.top}
            </span>
          ) : (
            <span className="text-gray-700 font-mono">-</span>
          )}
        </div>
      </div>

      {/* Original Minuend Row (5 0 0) with Strike-throughs */}
      <div className="grid grid-cols-4 gap-2 py-1 text-center font-black text-xl sm:text-2xl text-white">
        <div className="text-gray-600 font-mono text-sm flex items-center justify-center">Start:</div>

        {/* Hundreds (5) */}
        <div className="relative flex items-center justify-center">
          <span className={`${H.crossed ? 'line-through text-gray-500 decoration-red-500 decoration-3' : 'text-purple-100'}`}>
            {H.orig}
          </span>
        </div>

        {/* Tens (0) */}
        <div className="relative flex items-center justify-center">
          <span className={`${T.crossed ? 'line-through text-gray-500 decoration-red-500 decoration-3' : 'text-teal-100'}`}>
            {T.orig}
          </span>
        </div>

        {/* Ones (0) */}
        <div className="relative flex items-center justify-center">
          <span className={`${O.crossed ? 'line-through text-gray-500 decoration-red-500 decoration-3' : 'text-amber-100'}`}>
            {O.orig}
          </span>
        </div>
      </div>

      {/* Subtrahend Row (- 0 5 3) */}
      <div className="grid grid-cols-4 gap-2 py-1 text-center font-black text-xl sm:text-2xl text-orange-400">
        <div className="font-extrabold text-2xl text-red-400 flex items-center justify-center">−</div>
        <div className="text-purple-300">{H.sub}</div>
        <div className="text-teal-300">{T.sub}</div>
        <div className="text-amber-300">{O.sub}</div>
      </div>

      {/* Chalkboard Divider Line */}
      <div className="border-b-4 border-amber-400/80 my-1 rounded" />

      {/* Difference / Answers Row */}
      <div className="grid grid-cols-4 gap-2 pt-2 text-center font-black text-2xl sm:text-3xl text-emerald-400">
        <div className="text-xs uppercase font-extrabold text-emerald-400 flex items-center justify-center">
          =
        </div>

        {/* Hundreds Answer (4) */}
        <div className="flex items-center justify-center h-10">
          {answers.H !== null ? (
            <span className="text-purple-300 animate-bounce">{answers.H}</span>
          ) : showResult ? (
            <span className="text-purple-300">4</span>
          ) : (
            <span className="text-gray-700 font-mono text-lg">?</span>
          )}
        </div>

        {/* Tens Answer (4) */}
        <div className="flex items-center justify-center h-10">
          {answers.T !== null ? (
            <span className="text-teal-300 animate-bounce">{answers.T}</span>
          ) : showResult ? (
            <span className="text-teal-300">4</span>
          ) : (
            <span className="text-gray-700 font-mono text-lg">?</span>
          )}
        </div>

        {/* Ones Answer (7) */}
        <div className="flex items-center justify-center h-10">
          {answers.O !== null ? (
            <span className="text-amber-300 animate-bounce">{answers.O}</span>
          ) : showResult ? (
            <span className="text-amber-300">7</span>
          ) : (
            <span className="text-gray-700 font-mono text-lg">?</span>
          )}
        </div>
      </div>

      {/* Total Candy Equation Footer */}
      <div className="mt-3 pt-2 border-t border-purple-800/40 text-center text-xs font-semibold text-purple-300">
        {showResult || (answers.H === 4 && answers.T === 4 && answers.O === 7) ? (
          <span className="text-emerald-300 font-bold text-sm tracking-wide">
            🎉 500 − 53 = <span className="text-white font-extrabold text-base">447</span>
          </span>
        ) : (
          <span>Total Candies Remain: <b className="text-amber-400">500</b> (No candies lost!)</span>
        )}
      </div>
    </div>
  );
}

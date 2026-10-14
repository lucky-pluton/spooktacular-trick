import React from 'react';

/**
 * PrintableWorksheet Component
 * Clean, printer-friendly A4 maths worksheet.
 * Rendered with `hidden print:block` so it only appears when printing from Notebook Mode.
 * 
 * Includes:
 * 1. Name & Date fields.
 * 2. Visual Base-10 Borrowing Rule diagram ($1 \text{ Hundred} = 10 \text{ Tens}$, $1 \text{ Ten} = 10 \text{ Ones}$).
 * 3. All 5 subtraction problems with ruled classroom notebook grid boxes:
 *    - 500 − 53
 *    - 400 − 65
 *    - 300 − 28
 *    - 600 − 84
 *    - 700 − 49
 * 4. High-contrast, black-and-white formatting optimized for standard A4 paper.
 */
export default function PrintableWorksheet() {
  const problems = [
    { num: 1, minuend: 500, subtrahend: 53, diff: 447, targetH: '0', targetT: '5', targetO: '3' },
    { num: 2, minuend: 400, subtrahend: 65, diff: 335, targetH: '0', targetT: '6', targetO: '5' },
    { num: 3, minuend: 300, subtrahend: 28, diff: 272, targetH: '0', targetT: '2', targetO: '8' },
    { num: 4, minuend: 600, subtrahend: 84, diff: 516, targetH: '0', targetT: '8', targetO: '4' },
    { num: 5, minuend: 700, subtrahend: 49, diff: 651, targetH: '0', targetT: '4', targetO: '9' },
  ];

  return (
    <section className="hidden print:block text-black bg-white p-8 max-w-4xl mx-auto font-sans">
      {/* Worksheet Header */}
      <div className="border-b-2 border-black pb-4 mb-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-black uppercase tracking-wide">
            Spooktacular Trick: Subtraction with Regrouping 🎃
          </h1>
          <p className="text-xs text-gray-700 mt-0.5">
            Classroom Maths Notebook • Base-10 Candy Regrouping Practice
          </p>
        </div>

        <div className="flex flex-col gap-2 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span>Name:</span>
            <span className="w-36 border-b border-black inline-block" />
          </div>
          <div className="flex items-center gap-2">
            <span>Date:</span>
            <span className="w-36 border-b border-black inline-block" />
          </div>
        </div>
      </div>

      {/* The Spooky Borrowing Rule Guide */}
      <div className="border-2 border-black rounded-lg p-3 mb-5 bg-gray-50 text-xs">
        <h2 className="font-bold text-sm mb-1 uppercase">
          🧠 The Spooky Borrowing Rule Across Zeros:
        </h2>
        <p className="leading-relaxed">
          When the <b>Ones house</b> has 0 candies, knock on the <b>Tens house</b> next door.
          If the Tens house also has 0 candies, knock on the <b>Hundreds house</b>!
        </p>
        <div className="flex items-center justify-around mt-2 font-mono font-bold text-xs border-t border-gray-300 pt-1">
          <span>1 Hundred = 10 Tens (100 candies)</span>
          <span>•</span>
          <span>1 Ten = 10 Ones (10 candies)</span>
          <span>•</span>
          <span>Regroup: [Start − 1] [9] [10]</span>
        </div>
      </div>

      {/* Grid of 5 Subtraction Problems */}
      <div className="grid grid-cols-2 gap-6 my-4">
        {problems.map((prob) => {
          const hDigit = Math.floor(prob.minuend / 100);
          const regroupH = hDigit - 1;

          return (
            <div
              key={prob.num}
              className="border-2 border-black rounded-lg p-4 flex flex-col justify-between"
            >
              <div className="flex items-center justify-between border-b border-gray-400 pb-1 mb-2">
                <span className="font-bold text-sm">
                  Problem {prob.num}: {prob.minuend} − {prob.subtrahend}
                </span>
                <span className="text-[10px] font-mono text-gray-600">
                  Candy Goal: {prob.subtrahend}
                </span>
              </div>

              {/* Classroom Vertical Subtraction Grid */}
              <div className="font-mono text-sm self-center my-1">
                <table className="border-collapse text-center">
                  <thead>
                    <tr className="text-xs text-gray-600 border-b border-gray-300">
                      <th className="px-3 py-0.5"></th>
                      <th className="px-3 py-0.5">H</th>
                      <th className="px-3 py-0.5">T</th>
                      <th className="px-3 py-0.5">O</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* Regrouped row */}
                    <tr className="text-xs text-gray-700 italic">
                      <td className="px-2">Regroup:</td>
                      <td className="px-2 border border-dashed border-gray-400">[{regroupH}]</td>
                      <td className="px-2 border border-dashed border-gray-400">[9]</td>
                      <td className="px-2 border border-dashed border-gray-400">[10]</td>
                    </tr>
                    {/* Minuend */}
                    <tr className="font-bold text-base">
                      <td className="px-2"></td>
                      <td className="px-2">{hDigit}</td>
                      <td className="px-2">0</td>
                      <td className="px-2">0</td>
                    </tr>
                    {/* Subtrahend */}
                    <tr className="font-bold text-base border-b-2 border-black">
                      <td className="px-2 text-right">−</td>
                      <td className="px-2">{prob.targetH}</td>
                      <td className="px-2">{prob.targetT}</td>
                      <td className="px-2">{prob.targetO}</td>
                    </tr>
                    {/* Answer working boxes */}
                    <tr className="font-bold text-base">
                      <td className="px-2">=</td>
                      <td className="px-2 border border-black h-8 w-8"></td>
                      <td className="px-2 border border-black h-8 w-8"></td>
                      <td className="px-2 border border-black h-8 w-8"></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Working space for steps */}
              <div className="mt-2 pt-2 border-t border-gray-300 text-[10px] text-gray-600 flex justify-between">
                <span>Step 1: 10 − {prob.targetO} = [ &nbsp; ]</span>
                <span>Step 2: 9 − {prob.targetT} = [ &nbsp; ]</span>
                <span>Step 3: {regroupH} − {prob.targetH} = [ &nbsp; ]</span>
              </div>
            </div>
          );
        })}

        {/* Bonus Challenge Question Box */}
        <div className="border-2 border-black rounded-lg p-4 flex flex-col justify-between bg-gray-50">
          <div>
            <div className="font-bold text-sm border-b border-gray-400 pb-1 mb-2">
              ⭐ Halloween Math Challenge
            </div>
            <p className="text-xs leading-relaxed">
              Why must the <b>Tens house</b> borrow from the <b>Hundreds house</b> before it can share candies with the <b>Ones house</b>?
            </p>
            <div className="border-b border-dotted border-gray-500 mt-6" />
            <div className="border-b border-dotted border-gray-500 mt-6" />
            <div className="border-b border-dotted border-gray-500 mt-6" />
          </div>
          <div className="text-[10px] font-bold text-gray-700 mt-2">
            Spooktacular Trick Subtraction Mastery
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-black pt-2 mt-4 text-center text-[10px] text-gray-600">
        Spooktacular Trick • Interactive Subtraction with Borrowing • https://lucky-pluton.github.io/spooktacular-trick/
      </div>
    </section>
  );
}

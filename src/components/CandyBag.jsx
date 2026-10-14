import React from 'react';

/**
 * CandyBag Component
 * Visualizes the flying animated candy bags during borrowing/regrouping:
 * - 100 Candies (1 Hundred = 10 Tens)
 * - 10 Candies (1 Ten = 10 Ones)
 */
export default function CandyBag({
  type = '100', // '100' or '10'
  from = 'hundreds',
  to = 'tens',
  label = '',
  onComplete,
}) {
  const isHundred = type === '100';

  return (
    <div
      className="absolute top-1/2 z-30 pointer-events-none transform -translate-y-1/2 transition-all duration-1000 ease-in-out"
      style={{
        left: from === 'hundreds' ? '25%' : '50%',
        animation: from === 'hundreds' ? 'flyHundredsToTens 2s forwards ease-in-out' : 'flyTensToOnes 2s forwards ease-in-out',
      }}
    >
      <div className="relative flex flex-col items-center bg-gradient-to-br from-amber-300 via-orange-400 to-amber-500 text-black px-4 py-2.5 rounded-2xl shadow-[0_0_25px_rgba(255,180,0,0.8)] border-3 border-white scale-110">
        {/* Ribbon on Top */}
        <div className="absolute -top-3 w-6 h-3 bg-red-600 rounded-full border border-white" />

        {/* Bag Icon & Quantity */}
        <div className="flex items-center gap-2">
          <span className="text-2xl">🎒</span>
          <div className="flex flex-col text-left">
            <span className="font-black text-sm tracking-tight text-purple-950 uppercase leading-none">
              {isHundred ? '1 HUNDRED BAG' : '1 TEN BAG'}
            </span>
            <span className="font-extrabold text-xs text-red-900 leading-tight">
              {isHundred ? '100 Candies (= 10 Tens)' : '10 Candies (= 10 Ones)'}
            </span>
          </div>
        </div>

        {/* Magic Golden Sparkles */}
        <div className="absolute -inset-1 bg-amber-400/20 rounded-2xl filter blur-sm -z-10 animate-pulse" />
      </div>

      <style>{`
        @keyframes flyHundredsToTens {
          0% {
            left: 20%;
            transform: translateY(-20px) scale(0.8) rotate(-10deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
            transform: translateY(-60px) scale(1.15) rotate(5deg);
          }
          70% {
            opacity: 1;
            transform: translateY(-40px) scale(1.1) rotate(-5deg);
          }
          100% {
            left: 48%;
            transform: translateY(0px) scale(1) rotate(0deg);
            opacity: 0.95;
          }
        }

        @keyframes flyTensToOnes {
          0% {
            left: 48%;
            transform: translateY(-20px) scale(0.8) rotate(-10deg);
            opacity: 0;
          }
          30% {
            opacity: 1;
            transform: translateY(-60px) scale(1.15) rotate(5deg);
          }
          70% {
            opacity: 1;
            transform: translateY(-40px) scale(1.1) rotate(-5deg);
          }
          100% {
            left: 76%;
            transform: translateY(0px) scale(1) rotate(0deg);
            opacity: 0.95;
          }
        }
      `}</style>
    </div>
  );
}

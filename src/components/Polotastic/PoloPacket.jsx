import React from 'react';

/**
 * PoloPacket Component
 * Represents 1 Packet = 10 Rolls = 100 Polos = 1 Hundred.
 */
export default function PoloPacket({
  showContents = true,
  onClick,
  label = '1 Packet = 10 Rolls = 100 Polos',
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative inline-flex flex-col items-center gap-2 p-3.5 sm:p-4 rounded-3xl bg-gradient-to-br from-emerald-950/85 via-[#083328]/90 to-[#041d17]/95 border-2 border-emerald-400/80 shadow-[0_0_25px_rgba(16,185,129,0.25)] select-none transition-all ${
        onClick ? 'cursor-pointer hover:scale-102 active:scale-98' : ''
      } ${className}`}
      title={label}
    >
      {/* Packet Top Seal & Header */}
      <div className="flex items-center justify-between w-full px-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xl">📦</span>
          <span className="text-xs sm:text-sm font-black text-emerald-300 uppercase tracking-wide">
            1 Packet
          </span>
        </div>
        <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400 text-emerald-200 text-[10px] font-black uppercase">
          100 Ones • 10 Tens
        </span>
      </div>

      {/* Visual representation of 10 rolls neatly bundled */}
      {showContents ? (
        <div className="w-full bg-[#031b14]/70 border border-emerald-500/40 rounded-2xl p-2.5 flex flex-col gap-1.5 shadow-inner">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="flex items-center justify-between bg-emerald-900/40 border border-emerald-500/30 px-2 py-1 rounded-xl text-[10px] font-bold text-emerald-200"
              >
                <div className="flex items-center gap-1">
                  <span className="text-xs">🥖</span>
                  <span>Roll #{num}</span>
                </div>
                <span className="text-emerald-400 font-mono">10</span>
              </div>
            ))}
          </div>
          <div className="text-center text-[10px] text-emerald-300/80 font-semibold pt-1 border-t border-emerald-800/40">
            10 rolls × 10 Polos = 100 Polos total
          </div>
        </div>
      ) : (
        <div className="w-36 h-28 rounded-2xl bg-gradient-to-br from-emerald-800/60 to-emerald-950/80 border border-emerald-400/50 flex flex-col items-center justify-center gap-1">
          <span className="text-4xl">📦</span>
          <span className="text-xs font-black text-emerald-300">100 Polos</span>
        </div>
      )}

      {/* Bottom Math Pill */}
      <div className="px-3 py-1 rounded-full bg-emerald-900/80 border border-emerald-400/60 text-emerald-300 text-xs font-black shadow-sm">
        1 Packet = 100 Polos
      </div>
    </div>
  );
}

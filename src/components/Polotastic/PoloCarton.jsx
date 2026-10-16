import React from 'react';

/**
 * PoloCarton Component
 * Represents 1 Carton = 10 Packets = 100 Rolls = 1,000 Polos = 1 Thousand.
 */
export default function PoloCarton({
  showContents = true,
  onClick,
  label = '1 Carton = 10 Packets = 1,000 Polos',
  className = '',
}) {
  return (
    <div
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      className={`relative inline-flex flex-col items-center gap-2.5 p-4 sm:p-5 rounded-3xl bg-gradient-to-br from-[#0c2a38]/90 via-[#071c26]/95 to-[#030e14]/98 border-2 border-cyan-400/80 shadow-[0_0_30px_rgba(34,211,238,0.25)] select-none transition-all ${
        onClick ? 'cursor-pointer hover:scale-102 active:scale-98' : ''
      } ${className}`}
      title={label}
    >
      {/* Carton Header & Shipping Stamp */}
      <div className="flex items-center justify-between w-full px-1">
        <div className="flex items-center gap-2">
          <span className="text-2xl">🚚</span>
          <span className="text-sm sm:text-base font-black text-cyan-300 uppercase tracking-wide">
            1 Carton
          </span>
        </div>
        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-[10px] font-black uppercase">
          1,000 Ones • 1 Thousand
        </span>
      </div>

      {/* Carton Contents Grid */}
      {showContents ? (
        <div className="w-full bg-[#04151e]/80 border border-cyan-500/40 rounded-2xl p-3 flex flex-col gap-2 shadow-inner">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
              <div
                key={num}
                className="flex flex-col items-center justify-center p-1.5 rounded-xl bg-cyan-950/60 border border-cyan-600/30 text-center text-cyan-200"
              >
                <span className="text-sm">📦</span>
                <span className="text-[9px] font-bold">Packet #{num}</span>
                <span className="text-[10px] text-cyan-400 font-mono font-bold">100</span>
              </div>
            ))}
          </div>
          <div className="text-center text-[11px] text-cyan-200/90 font-semibold pt-1 border-t border-cyan-900/50">
            10 packets × 100 Polos = 1,000 Polos total
          </div>
        </div>
      ) : (
        <div className="w-40 h-32 rounded-2xl bg-gradient-to-br from-cyan-900/60 to-cyan-950/80 border border-cyan-400/50 flex flex-col items-center justify-center gap-1.5">
          <span className="text-5xl">🚚</span>
          <span className="text-sm font-black text-cyan-300">1,000 Polos</span>
        </div>
      )}

      {/* Bottom Math Pill */}
      <div className="px-3.5 py-1 rounded-full bg-cyan-900/80 border border-cyan-400/60 text-cyan-300 text-xs font-black shadow-sm">
        1 Carton = 1,000 Polos
      </div>
    </div>
  );
}

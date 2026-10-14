import React from 'react';

/**
 * TrickOrTreater Component
 * Renders the two cute costumed children (Ghostie and Little Witch)
 * carrying their candy buckets and tracking their needed candies (53).
 */
export default function TrickOrTreater({
  collectedCandies = 0,
  targetCandies = 53,
  isCollecting = false,
  isCelebrated = false,
}) {
  const tensNeeded = Math.floor(targetCandies / 10);
  const onesNeeded = targetCandies % 10;

  return (
    <div className="flex flex-col items-center bg-purple-950/70 border-2 border-orange-500/60 rounded-2xl p-3 shadow-xl backdrop-blur-sm max-w-sm w-full mx-auto">
      {/* Header Tag */}
      <div className="flex items-center gap-2 mb-2 text-xs font-bold uppercase tracking-wider text-orange-300">
        <span>🎃</span>
        <span>The Trick-or-Treaters</span>
        <span>🍭</span>
      </div>

      {/* Characters Graphic Row */}
      <div className="flex items-end justify-center gap-4 sm:gap-6 py-1">
        {/* Little Ghostie */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 70 80" className="w-16 h-20 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            {/* Ghost Sheet Body */}
            <path
              d="M35 10 C18 10 12 25 12 45 C12 65 14 74 18 72 C22 70 26 74 30 72 C34 70 38 74 42 72 C46 70 50 74 54 72 C58 74 58 65 58 45 C58 25 52 10 35 10 Z"
              fill="#f8f9fa"
              stroke="#cbd5e1"
              strokeWidth="2"
            />
            {/* Rosy Cheeks */}
            <circle cx="24" cy="38" r="3" fill="#ff70a6" opacity="0.8" />
            <circle cx="46" cy="38" r="3" fill="#ff70a6" opacity="0.8" />
            {/* Friendly Black Eyes */}
            <ellipse cx="27" cy="32" rx="3.5" ry="5" fill="#110726" />
            <circle cx="28" cy="30" r="1.2" fill="#ffffff" />
            <ellipse cx="43" cy="32" rx="3.5" ry="5" fill="#110726" />
            <circle cx="44" cy="30" r="1.2" fill="#ffffff" />
            {/* Cheerful Mouth */}
            <path d="M31 40 Q35 46 39 40" fill="none" stroke="#110726" strokeWidth="2.2" strokeLinecap="round" />
            {/* Orange Little Bowtie */}
            <polygon points="35,52 30,48 30,56" fill="#ff7700" />
            <polygon points="35,52 40,48 40,56" fill="#ff7700" />
            <circle cx="35" cy="52" r="2" fill="#ffaa00" />
          </svg>
          <span className="text-[11px] font-bold text-gray-300 mt-1">Ghostie (Needs {onesNeeded} Ones)</span>
        </div>

        {/* Little Witch */}
        <div className="flex flex-col items-center">
          <svg viewBox="0 0 70 85" className="w-16 h-20 filter drop-shadow-[0_4px_8px_rgba(0,0,0,0.4)]">
            {/* Witch Hat */}
            <polygon points="35,4 20,40 50,40" fill="#4a154b" stroke="#7b2cbf" strokeWidth="1.5" />
            <ellipse cx="35" cy="40" rx="22" ry="5" fill="#240046" stroke="#7b2cbf" strokeWidth="1.5" />
            <rect x="23" y="36" width="24" height="4" fill="#ffaa00" />
            {/* Face */}
            <circle cx="35" cy="50" r="12" fill="#ffdfba" />
            {/* Hair */}
            <path d="M22 46 Q24 62 25 66 M48 46 Q46 62 45 66" fill="none" stroke="#ff7700" strokeWidth="3.5" strokeLinecap="round" />
            {/* Eyes */}
            <circle cx="31" cy="49" r="2" fill="#110726" />
            <circle cx="39" cy="49" r="2" fill="#110726" />
            <path d="M33 55 Q35 58 37 55" fill="none" stroke="#110726" strokeWidth="1.8" strokeLinecap="round" />
            {/* Purple Robe */}
            <path d="M24 62 L46 62 L50 82 L20 82 Z" fill="#3c096c" />
          </svg>
          <span className="text-[11px] font-bold text-gray-300 mt-1">Witchy (Needs {tensNeeded} Tens)</span>
        </div>
      </div>

      {/* Candy Buckets Tracker */}
      <div className="w-full mt-2 bg-black/40 border border-orange-500/40 rounded-xl p-2.5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {/* Jack-o'-Lantern Bucket */}
          <div className={`relative flex items-center justify-center text-2xl ${isCollecting ? 'animate-bounce' : ''}`}>
            🎃
            {collectedCandies > 0 && (
              <span className="absolute -top-1 -right-1 text-xs">✨</span>
            )}
          </div>
          <div>
            <div className="text-[11px] text-orange-200 uppercase tracking-wider font-semibold">
              Candies Needed:
            </div>
            <div className="text-xs text-amber-300 font-bold">
              {tensNeeded} Tens ({tensNeeded * 10}) + {onesNeeded} Ones ({onesNeeded}) = <span className="text-sm font-extrabold text-white">{targetCandies}</span>
            </div>
          </div>
        </div>

        {/* Collected Badge */}
        <div className="text-right">
          <div className="text-[10px] text-gray-400 font-medium">Collected:</div>
          <div className="text-base font-extrabold text-emerald-400">
            {collectedCandies} / {targetCandies}
          </div>
        </div>
      </div>

      {isCelebrated && (
        <div className="mt-2 text-xs font-extrabold text-emerald-300 bg-emerald-950/80 border border-emerald-500 px-3 py-1 rounded-full animate-pulse text-center">
          🎉 Buckets Full! {targetCandies} Candies Collected! 🎉
        </div>
      )}
    </div>
  );
}

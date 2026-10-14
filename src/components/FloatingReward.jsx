import React from 'react';

/**
 * FloatingReward Component
 * Displays a celebratory floating reward (+100, +50, +200, +500)
 * that floats upward and fades out smoothly when points are earned.
 */
export default function FloatingReward({
  points = 100,
  label = 'Points! 🍬',
  onAnimationEnd,
}) {
  return (
    <div
      onAnimationEnd={onAnimationEnd}
      className="pointer-events-none absolute -top-8 right-4 z-40 flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-300 text-black font-black text-xs sm:text-sm shadow-[0_0_20px_rgba(255,180,0,0.9)] border-2 border-white animate-floatUp"
    >
      <span className="text-base sm:text-lg">+{points}</span>
      <span className="text-[11px] sm:text-xs font-bold tracking-tight">{label}</span>
    </div>
  );
}

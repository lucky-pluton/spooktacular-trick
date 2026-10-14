import React, { useState } from 'react';
import { X, ArrowRight, ArrowLeft, Volume2, Sparkles } from 'lucide-react';
import GhostieCharacter from './GhostieCharacter';
import WitchyCharacter from './WitchyCharacter';
import { sounds } from '../../audio/soundEffects';

/**
 * MathOLanternStoryModal Component
 * An illustrated storybook introducing Ghostie, Witchy, and the magical Lantern Trail.
 * 
 * Teaches subtraction as finding distance by counting forward to friendly benchmark numbers.
 */
export default function MathOLanternStoryModal({ isOpen = false, onClose, onStartJourney }) {
  const [currentSlide, setCurrentSlide] = useState(0);

  if (!isOpen) return null;

  const slides = [
    {
      id: 1,
      tag: "Character Intro",
      title: "Meet Ghostie & Witchy 👻🧙‍♀️",
      subtitle: "A curious ghost and a wise witch on Halloween night",
      content:
        "Ghostie is a friendly, curious little ghost floating over the cobblestones. Right now, Ghostie has 36 glowing jack-o'-lanterns. But Ghostie dreams of having a grand collection of 500 lanterns to light up the haunted sky!",
      quote:
        "\"500 is so big!\" sighs Ghostie. \"Do I have to count them one by one?\"",
      witchTip:
        "Witchy smiles warmly: \"No need to count one by one, Ghostie! We can jump in friendly groups!\"",
      visual: "intro",
    },
    {
      id: 2,
      tag: "The Method",
      title: "The Magical Lantern Trail 🏮",
      subtitle: "Counting forward instead of borrowing",
      content:
        "\"Ghostie has 36 lanterns but dreams of having 500. Witchy explains that instead of counting every lantern one by one, Ghostie can travel to friendly numbers and collect lanterns in groups. Can you help Ghostie reach 500?\"",
      quote:
        "\"We start at 36 and travel forward to 500. Every friendly jump gives us more lanterns!\"",
      witchTip:
        "Look for the friendly benchmarks: jump to 40 (+4), jump to 100 (+60), and jump to 500 (+400)!",
      visual: "trail",
    },
    {
      id: 3,
      tag: "The Big Discovery",
      title: "The Distance is the Difference! ✨",
      subtitle: "Adding our jumps gives the exact subtraction answer",
      content:
        "When Ghostie reaches 500, Witchy counts all the lanterns collected along the way: 4 + 60 + 400 = 464 lanterns! Ghostie discovered that 500 − 36 = 464 without any messy borrowing!",
      quote:
        "\"The distance between where you start and where you want to go IS the subtraction answer!\"",
      witchTip:
        "Jump to friendly tens, jump to hundreds, and sum your lanterns! Ready to guide Ghostie?",
      visual: "math",
    },
  ];

  const slide = slides[currentSlide];

  const handleNext = () => {
    sounds.playPop();
    if (currentSlide < slides.length - 1) {
      setCurrentSlide((s) => s + 1);
    } else {
      if (onStartJourney) onStartJourney();
      onClose();
    }
  };

  const handlePrev = () => {
    sounds.playPop();
    if (currentSlide > 0) {
      setCurrentSlide((s) => s - 1);
    }
  };

  const handleSpeak = () => {
    sounds.speak(`${slide.title}. ${slide.content} ${slide.quote} ${slide.witchTip}`);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="math-story-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-2xl bg-gradient-to-b from-[#0b2434] via-[#071a26] to-[#041018] border-3 border-teal-400 rounded-[36px] p-5 sm:p-8 text-white shadow-[0_0_60px_rgba(0,255,200,0.4)] flex flex-col gap-4 animate-popIn">
        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 z-20 p-2 rounded-full bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors cursor-pointer"
          title="Close story"
          aria-label="Close story"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Top Tag & Read Aloud */}
        <div className="flex items-center justify-between border-b border-teal-500/30 pb-2.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-900/80 border border-teal-400/50 text-amber-300 font-black text-xs uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Story • {slide.tag}</span>
          </div>

          <button
            onClick={handleSpeak}
            type="button"
            className="p-1.5 rounded-lg bg-teal-900/60 hover:bg-teal-800 text-amber-300 transition-colors cursor-pointer flex items-center gap-1 text-xs font-bold"
            title="Read slide aloud"
          >
            <Volume2 className="w-4 h-4" />
            <span className="hidden sm:inline">Listen</span>
          </button>
        </div>

        {/* Slide Title */}
        <div className="text-left flex flex-col gap-0.5">
          <h2
            id="math-story-title"
            className="text-xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-teal-300 to-emerald-300 font-['Creepster',cursive] tracking-wide"
          >
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-teal-200 font-semibold italic">
            {slide.subtitle}
          </p>
        </div>

        {/* Visual Scene Area */}
        <div className="w-full bg-[#03131e]/90 border-2 border-teal-500/40 rounded-2xl p-4 flex items-center justify-around gap-4 min-h-[140px] shadow-inner">
          {slide.visual === 'intro' && (
            <>
              <GhostieCharacter mood="curious" lanternCount={36} size="lg" />
              <div className="flex flex-col items-center gap-1 text-center font-mono">
                <span className="text-2xl sm:text-3xl">🏮 36</span>
                <span className="text-xs text-amber-300 font-black">Ghostie's Lanterns</span>
                <span className="text-[10px] text-gray-400">Wants 500!</span>
              </div>
              <WitchyCharacter dialogue="Friendly numbers make big math easy!" />
            </>
          )}

          {slide.visual === 'trail' && (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="flex items-center justify-between w-full text-xs font-black text-amber-300 px-2">
                <span>Start: 36</span>
                <span className="text-teal-300">➡️ +4 ➡️ 40</span>
                <span className="text-emerald-300">➡️ +60 ➡️ 100</span>
                <span>Goal: 500</span>
              </div>
              <div className="w-full h-3 bg-gradient-to-r from-amber-400 via-teal-400 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(0,255,200,0.8)]" />
              <div className="flex items-center gap-2 text-xs text-white font-bold">
                <span>Ghostie hops along the glowing lanterns!</span>
                <span className="text-lg">👻🏮</span>
              </div>
            </div>
          )}

          {slide.visual === 'math' && (
            <div className="w-full flex flex-col items-center gap-2">
              <div className="text-base sm:text-xl font-mono font-black text-amber-300 bg-black/60 px-4 py-2 rounded-xl border border-amber-400/60 shadow">
                4 + 60 + 400 = 464 🏮
              </div>
              <div className="text-sm sm:text-base font-mono font-black text-emerald-300">
                500 − 36 = 464
              </div>
              <span className="text-xs text-teal-200 font-medium">
                Ghostie reached the destination and collected all 464 lanterns!
              </span>
            </div>
          )}
        </div>

        {/* Narrative Paragraph */}
        <p className="text-xs sm:text-sm text-gray-200 font-medium leading-relaxed text-left">
          {slide.content}
        </p>

        {/* Witchy Advice Quote Box */}
        <div className="bg-purple-950/70 border border-purple-500/50 rounded-xl p-3 text-xs sm:text-sm text-purple-200 font-medium italic text-left flex items-start gap-2">
          <span className="text-lg">🧙‍♀️</span>
          <span className="leading-snug">{slide.witchTip}</span>
        </div>

        {/* Navigation Dots and Slide Controls */}
        <div className="flex items-center justify-between pt-2 border-t border-teal-500/30">
          <div className="flex items-center gap-2">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  sounds.playPop();
                  setCurrentSlide(idx);
                }}
                type="button"
                className={`w-3 h-3 rounded-full transition-all cursor-pointer ${
                  idx === currentSlide
                    ? 'bg-amber-400 scale-125 shadow-[0_0_8px_rgba(255,180,0,1)]'
                    : 'bg-teal-900 border border-teal-600'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>

          <div className="flex items-center gap-2">
            {currentSlide > 0 && (
              <button
                onClick={handlePrev}
                type="button"
                className="px-3 py-1.5 rounded-xl bg-teal-950 hover:bg-teal-900 text-teal-200 border border-teal-600 text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>Back</span>
              </button>
            )}

            <button
              onClick={handleNext}
              type="button"
              className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-400 to-teal-400 hover:from-amber-300 hover:to-teal-300 text-black font-black text-xs sm:text-sm flex items-center gap-1.5 shadow-[0_0_15px_rgba(0,255,200,0.6)] cursor-pointer transition-all hover:scale-102 active:scale-98"
            >
              <span>{currentSlide === slides.length - 1 ? "Let's Play!" : "Next Page"}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

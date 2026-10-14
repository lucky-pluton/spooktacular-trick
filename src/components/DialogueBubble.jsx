import React from 'react';
import { Volume2 } from 'lucide-react';
import { sounds } from '../audio/soundEffects';

/**
 * DialogueBubble Component
 * Shows short comic-style story dialogue with speaker avatar and speech narration.
 */
export default function DialogueBubble({
  speaker = 'narrator', // 'narrator' | 'ones' | 'tens' | 'hundreds' | 'trick_or_treaters'
  dialogue = '',
  speechText = '',
  badge = '',
}) {
  const speakerMeta = {
    narrator: {
      name: 'Storyteller Owl 🦉',
      border: 'border-purple-400',
      bg: 'bg-purple-950/80',
      titleColor: 'text-purple-300',
    },
    ones: {
      name: 'Ones House 🎃',
      border: 'border-amber-400',
      bg: 'bg-amber-950/80',
      titleColor: 'text-amber-300',
    },
    tens: {
      name: 'Tens House 🗼',
      border: 'border-teal-400',
      bg: 'bg-teal-950/80',
      titleColor: 'text-teal-300',
    },
    hundreds: {
      name: 'Hundreds House 🏰',
      border: 'border-purple-400',
      bg: 'bg-purple-950/80',
      titleColor: 'text-purple-300',
    },
    trick_or_treaters: {
      name: 'Trick-or-Treaters 👻🧙',
      border: 'border-orange-400',
      bg: 'bg-orange-950/80',
      titleColor: 'text-orange-300',
    },
  }[speaker] || {
    name: 'Spooky Guide 🦇',
    border: 'border-purple-400',
    bg: 'bg-purple-950/80',
    titleColor: 'text-purple-300',
  };

  const handleSpeak = () => {
    sounds.speak(speechText || dialogue);
  };

  return (
    <div className={`relative w-full max-w-2xl mx-auto rounded-2xl border-2 ${speakerMeta.border} ${speakerMeta.bg} p-3.5 sm:p-4 shadow-xl backdrop-blur-md`}>
      {/* Header with speaker badge & audio narrator trigger */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-white/10">
        <div className="flex items-center gap-2">
          <span className={`text-xs sm:text-sm font-extrabold uppercase tracking-wider ${speakerMeta.titleColor}`}>
            {speakerMeta.name}
          </span>
          {badge && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-white/10 text-gray-300 font-semibold">
              {badge}
            </span>
          )}
        </div>

        {/* Read Aloud Button */}
        <button
          onClick={handleSpeak}
          type="button"
          aria-label="Read dialogue aloud"
          className="p-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-yellow-300 transition-colors flex items-center gap-1 text-xs font-semibold"
          title="Listen to story"
        >
          <Volume2 className="w-4 h-4" />
          <span className="hidden sm:inline">Listen</span>
        </button>
      </div>

      {/* Spoken Dialogue Text */}
      <p className="text-sm sm:text-base text-gray-100 font-medium leading-relaxed font-sans">
        {dialogue}
      </p>
    </div>
  );
}

import React from 'react';
import { X } from 'lucide-react';
import ComicStory from './ComicStory';

/**
 * ComicStoryModal Component
 * Accessible modal allowing children to view the illustrated storybook
 * from both Game Mode and Notebook Mode without navigating away or losing their problem state.
 */
export default function ComicStoryModal({ isOpen = false, onClose }) {
  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="comic-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/80 backdrop-blur-md animate-fadeIn"
    >
      <div className="relative w-full max-w-4xl max-h-[95vh] overflow-y-auto bg-[#16072e] border-3 border-amber-400/80 rounded-[36px] p-3 sm:p-6 shadow-2xl animate-popIn">
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

        {/* Comic Viewer */}
        <ComicStory onStartGame={onClose} />
      </div>
    </div>
  );
}

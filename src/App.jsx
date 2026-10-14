import React, { useState } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ModeSelectModal from './components/ModeSelectModal';
import ComicStoryModal from './components/ComicStoryModal';
import GamePage from './components/GamePage';
import NotebookMode from './components/NotebookMode';
import ConnectedNeighbourhood from './components/ConnectedNeighbourhood';
import PrintableWorksheet from './components/PrintableWorksheet';
import { LEVELS } from './data/gameScenes';
import { Heart } from 'lucide-react';

/**
 * App Root Component
 * Orchestrates the Spooktacular Trick learning experience:
 * 
 * 1. Initial State: 'welcome'
 *    Shows the idle connected neighbourhood and friendly welcome banner without starting the game.
 * 2. Mode Selection Modal:
 *    Prompts child to pick between 'game' (5 levels, rewards) and 'notebook' (sandbox, print worksheet).
 * 3. Comic Storybook Modal:
 *    Accessible from both modes without losing progress or problem state.
 * 4. Printable Worksheet:
 *    Only available in Notebook Mode per requirement 12.
 */
export default function App() {
  const [currentMode, setCurrentMode] = useState('welcome'); // 'welcome' | 'game' | 'notebook'
  const [isModeSelectOpen, setIsModeSelectOpen] = useState(false);
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Idle houses state for the welcome screen exploration
  const idleHouses = LEVELS[0]?.steps?.[0]?.houses || {
    hundreds: { value: 5, candies: 500, mood: 'idle', label: 'Hundreds House' },
    tens: { value: 0, candies: 0, mood: 'idle', label: 'Tens House' },
    ones: { value: 0, candies: 0, mood: 'idle', label: 'Ones House' },
  };

  const handleStartFromWelcome = () => {
    setIsModeSelectOpen(true);
  };

  const handleSelectMode = (mode) => {
    setCurrentMode(mode);
    setIsModeSelectOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#0e051d] text-white flex flex-col font-['Fredoka',sans-serif] selection:bg-orange-500 selection:text-black">
      {/* Halloween Starry Night Background Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.35),rgba(255,255,255,0))] -z-10" />

      {/* Persistent Navigation Header */}
      <Header
        activeMode={currentMode}
        onSwitchMode={() => setIsModeSelectOpen(true)}
        onOpenStory={() => setIsStoryOpen(true)}
        onGoWelcome={() => setCurrentMode('welcome')}
      />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-center py-2 sm:py-4">
        {/* 1. WELCOME & EXPLORATION SCREEN (INITIAL STATE) */}
        {currentMode === 'welcome' && (
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 flex flex-col gap-3">
            {/* Welcoming Banner with Prominent "Let's Start!" Button */}
            <WelcomeScreen
              onStart={handleStartFromWelcome}
              onOpenStory={() => setIsStoryOpen(true)}
            />

            {/* Complete Connected Neighbourhood in Normal, Idle State */}
            <div className="relative w-full">
              <div className="text-center text-xs text-purple-300 font-bold mb-1">
                🏰 The Haunted-House Community • Candy Lane 🏮
              </div>
              <ConnectedNeighbourhood
                houses={idleHouses}
                activeHouse="ones"
                isQuestionVisible={false}
                isIdleMode={true}
              />
            </div>
          </div>
        )}

        {/* 2. OPTION A: GAME MODE (5 Levels, Points, Celebrations) */}
        {currentMode === 'game' && (
          <GamePage
            onOpenStory={() => setIsStoryOpen(true)}
            onOpenPractice={() => setCurrentMode('notebook')}
            onSwitchMode={() => setIsModeSelectOpen(true)}
          />
        )}

        {/* 3. OPTION B: NOTEBOOK MODE (Maths Sandbox & Printable Worksheet) */}
        {currentMode === 'notebook' && (
          <NotebookMode
            onSwitchToGame={() => setCurrentMode('game')}
            onOpenStory={() => setIsStoryOpen(true)}
          />
        )}
      </main>

      {/* MODE SELECTION MODAL */}
      <ModeSelectModal
        isOpen={isModeSelectOpen}
        onSelectMode={handleSelectMode}
      />

      {/* STORY COMIC MODAL */}
      <ComicStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* PRINTABLE WORKSHEET VIEW (Visible Only When Printing in Notebook Mode) */}
      <PrintableWorksheet />

      {/* Footer */}
      <footer className="w-full bg-[#0a0314] border-t border-purple-900/60 py-3 px-4 text-center text-xs text-gray-400 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for young math learners & Halloween trick-or-treaters</span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-purple-300">
            <span>500 − 53 = 447</span>
            <span>•</span>
            <span>Base-10 Candy Regrouping</span>
            {currentMode === 'notebook' && (
              <>
                <span>•</span>
                <button
                  onClick={() => window.print()}
                  className="hover:text-amber-300 underline cursor-pointer"
                >
                  Print Worksheet 🖨️
                </button>
              </>
            )}
          </div>
        </div>
      </footer>
    </div>
  );
}

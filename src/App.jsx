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
 * Enforces strict UI separation between Game Mode and Notebook Mode:
 * 
 * 1. Screen 1: 'welcome'
 *    - Friendly introduction banner with "Let's Start!" button.
 *    - Complete connected neighbourhood visible in normal, idle state.
 *    - Does NOT start the game, deduct points, or show question popups automatically.
 * 
 * 2. Screen 2: 'mode_select'
 *    - Prompts child: "How would you like to learn today?"
 *    - Option A: Game Mode (5 levels, rewards, celebrations).
 *    - Option B: Notebook Mode (Maths sandbox, 5 problems, printable worksheet).
 * 
 * 3. Screen 3A: 'game' (Dedicated Game Mode Interface)
 *    - Only game-related controls (Level progress, Score & Stars, Subtraction board).
 *    - Small, unobtrusive "← Main Menu" button in header to return when desired.
 *    - ZERO Notebook Mode tabs, sandbox controls, or printing options.
 * 
 * 4. Screen 3B: 'notebook' (Dedicated Notebook Mode Interface)
 *    - Only notebook-related controls (5 problems selector, step stepper, Print Worksheet).
 *    - Small, unobtrusive "← Main Menu" button in header to return when desired.
 *    - ZERO Game Mode tabs, points, scores, stars, or level-unlock restrictions.
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome'); // 'welcome' | 'mode_select' | 'game' | 'notebook'
  const [isStoryOpen, setIsStoryOpen] = useState(false);

  // Idle houses state for the welcome screen exploration
  const idleHouses = LEVELS[0]?.steps?.[0]?.houses || {
    hundreds: { value: 5, candies: 500, mood: 'idle', label: 'Hundreds House' },
    tens: { value: 0, candies: 0, mood: 'idle', label: 'Tens House' },
    ones: { value: 0, candies: 0, mood: 'idle', label: 'Ones House' },
  };

  return (
    <div className="min-h-screen bg-[#0e051d] text-white flex flex-col font-['Fredoka',sans-serif] selection:bg-orange-500 selection:text-black">
      {/* Halloween Starry Night Background Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.35),rgba(255,255,255,0))] -z-10" />

      {/* Mode-Specific Compact Header */}
      <Header
        activeMode={currentScreen}
        onReturnToMenu={() => {
          if (currentScreen === 'mode_select') {
            setCurrentScreen('welcome');
          } else {
            setCurrentScreen('mode_select');
          }
        }}
        onOpenStory={() => setIsStoryOpen(true)}
      />

      {/* Main Content Area: Strictly renders only the selected mode */}
      <main className="flex-1 w-full flex flex-col justify-center py-2 sm:py-4">
        {/* 1. WELCOME & EXPLORATION SCREEN */}
        {currentScreen === 'welcome' && (
          <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 flex flex-col gap-3">
            {/* Welcoming Banner with Prominent "Let's Start!" Button */}
            <WelcomeScreen
              onStart={() => setCurrentScreen('mode_select')}
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

        {/* 2. MODE SELECTION SCREEN */}
        {currentScreen === 'mode_select' && (
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col gap-4">
            <ModeSelectModal
              isOpen={true}
              onSelectMode={(mode) => setCurrentScreen(mode)}
              onBackToWelcome={() => setCurrentScreen('welcome')}
            />

            {/* Ambient Background Houses */}
            <div className="relative w-full opacity-60 pointer-events-none">
              <ConnectedNeighbourhood
                houses={idleHouses}
                activeHouse="ones"
                isQuestionVisible={false}
                isIdleMode={true}
              />
            </div>
          </div>
        )}

        {/* 3. DEDICATED GAME MODE INTERFACE */}
        {currentScreen === 'game' && (
          <GamePage
            onOpenStory={() => setIsStoryOpen(true)}
            onReturnToMenu={() => setCurrentScreen('mode_select')}
          />
        )}

        {/* 4. DEDICATED NOTEBOOK MODE INTERFACE */}
        {currentScreen === 'notebook' && (
          <NotebookMode
            onOpenStory={() => setIsStoryOpen(true)}
          />
        )}
      </main>

      {/* STORY COMIC MODAL (Accessible on request without losing active state) */}
      <ComicStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* PRINTABLE WORKSHEET VIEW (Visible Only When Printing from Notebook Mode) */}
      {currentScreen === 'notebook' && <PrintableWorksheet />}

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
          </div>
        </div>
      </footer>
    </div>
  );
}

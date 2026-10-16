import React, { useState } from 'react';
import Header from './components/Header';
import WelcomeScreen from './components/WelcomeScreen';
import ModuleSelectScreen from './components/ModuleSelectScreen';
import ModeSelectModal from './components/ModeSelectModal';
import ComicStoryModal from './components/ComicStoryModal';
import GamePage from './components/GamePage';
import NotebookMode from './components/NotebookMode';
import MathOLanternModule from './components/MathOLantern/MathOLanternModule';
import MathOLanternStoryModal from './components/MathOLantern/MathOLanternStoryModal';
import PolotasticModule from './components/Polotastic/PolotasticModule';
import ConnectedNeighbourhood from './components/ConnectedNeighbourhood';
import PrintableWorksheet from './components/PrintableWorksheet';
import { LEVELS } from './data/gameScenes';
import { Heart } from 'lucide-react';

/**
 * App Root Component
 * Multi-Module Halloween Subtraction Learning Application
 * 
 * 1. Screen 1: 'welcome'
 *    - Introduces the overall application with a prominent "Let's Start!" button.
 *    - Full connected neighbourhood visible in normal, idle state.
 * 
 * 2. Screen 2: 'module_select'
 *    - Clear module-selection screen:
 *      • Module 1: Trick-or-Think ("Borrow, regroup, and help the houses share their candies!")
 *      • Module 2: Math O' Lantern ("Help Ghostie collect lanterns and discover the distance between numbers!")
 *      • Module 3: Polotastic ("Collect Polos, build bigger numbers, exchange bundles, and master subtraction!")
 * 
 * 3. Module 1: Trick-or-Think
 *    - Screen 'trick_or_think_select': Game Mode vs Notebook Mode choice.
 *    - Screen 'game': Dedicated Game Mode interface (place-value borrowing, scores, levels).
 *    - Screen 'notebook': Dedicated Notebook Mode interface (5 problems, print worksheet).
 * 
 * 4. Module 2: Math O' Lantern
 *    - Screen 'math_o_lantern': Counting up number jumps, Guided Journey & Lantern Sandbox.
 * 
 * 5. Module 3: Polotastic
 *    - Screen 'polotastic': Place value units, Polo Dash runner, Levels 1-3 subtraction without & with borrowing.
 * 
 * Enforces strict separation: No controls or mode tabs from one module leak into the other.
 */
export default function App() {
  const [currentScreen, setCurrentScreen] = useState('welcome');
  // 'welcome' | 'module_select' | 'trick_or_think_select' | 'game' | 'notebook' | 'math_o_lantern' | 'polotastic'

  const [isStoryOpen, setIsStoryOpen] = useState(false); // Trick-or-Think candy borrowing comic
  const [isMathStoryOpen, setIsMathStoryOpen] = useState(false); // Math O' Lantern counting-up story

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
          if (currentScreen === 'game' || currentScreen === 'notebook') {
            setCurrentScreen('trick_or_think_select');
          } else if (
            currentScreen === 'trick_or_think_select' ||
            currentScreen === 'math_o_lantern' ||
            currentScreen === 'polotastic'
          ) {
            setCurrentScreen('module_select');
          } else if (currentScreen === 'module_select') {
            setCurrentScreen('welcome');
          } else {
            setCurrentScreen('welcome');
          }
        }}
        onOpenStory={() => {
          if (currentScreen === 'math_o_lantern') {
            setIsMathStoryOpen(true);
          } else {
            setIsStoryOpen(true);
          }
        }}
      />

      {/* Main Content Area: Strictly renders only the selected module/screen */}
      <main className="flex-1 w-full flex flex-col justify-center py-2 sm:py-4">
        {/* 1. WELCOME SCREEN (Minimal, focused landing page) */}
        {currentScreen === 'welcome' && (
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col justify-center items-center">
            <WelcomeScreen
              onStart={() => setCurrentScreen('module_select')}
            />
          </div>
        )}

        {/* 2. MODULE SELECTION SCREEN */}
        {currentScreen === 'module_select' && (
          <ModuleSelectScreen
            onSelectModule={(mod) => {
              if (mod === 'trick_or_think') {
                setCurrentScreen('trick_or_think_select');
              } else if (mod === 'math_o_lantern') {
                setCurrentScreen('math_o_lantern');
              } else if (mod === 'polotastic') {
                setCurrentScreen('polotastic');
              }
            }}
            onBackToWelcome={() => setCurrentScreen('welcome')}
          />
        )}

        {/* 3. TRICK-OR-THINK: MODE SELECTION (Game Mode vs Notebook Mode) */}
        {currentScreen === 'trick_or_think_select' && (
          <div className="w-full max-w-5xl mx-auto px-3 sm:px-4 flex flex-col gap-4">
            <ModeSelectModal
              isOpen={true}
              onSelectMode={(mode) => setCurrentScreen(mode)}
              onBackToWelcome={() => setCurrentScreen('module_select')}
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

        {/* 4. TRICK-OR-THINK: DEDICATED GAME MODE INTERFACE */}
        {currentScreen === 'game' && (
          <GamePage
            onOpenStory={() => setIsStoryOpen(true)}
            onReturnToMenu={() => setCurrentScreen('trick_or_think_select')}
          />
        )}

        {/* 5. TRICK-OR-THINK: DEDICATED NOTEBOOK MODE INTERFACE */}
        {currentScreen === 'notebook' && (
          <NotebookMode
            onOpenStory={() => setIsStoryOpen(true)}
          />
        )}

        {/* 6. MATH O' LANTERN: DEDICATED COUNTING UP MODULE */}
        {currentScreen === 'math_o_lantern' && (
          <MathOLanternModule
            onReturnToModules={() => setCurrentScreen('module_select')}
          />
        )}

        {/* 7. POLOTASTIC: DEDICATED PLACE-VALUE & REGROUPING MODULE */}
        {currentScreen === 'polotastic' && (
          <PolotasticModule
            onReturnToModules={() => setCurrentScreen('module_select')}
          />
        )}
      </main>

      {/* TRICK-OR-THINK STORY COMIC MODAL */}
      <ComicStoryModal
        isOpen={isStoryOpen}
        onClose={() => setIsStoryOpen(false)}
      />

      {/* MATH O' LANTERN STORY MODAL */}
      <MathOLanternStoryModal
        isOpen={isMathStoryOpen}
        onClose={() => setIsMathStoryOpen(false)}
      />

      {/* PRINTABLE WORKSHEET VIEW (Visible Only When Printing from Notebook Mode) */}
      {currentScreen === 'notebook' && <PrintableWorksheet />}

      {/* Shared Application Footer */}
      <footer className="w-full bg-[#0a0314] border-t border-purple-900/60 py-3 px-4 text-center text-xs text-gray-400 print:hidden">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center justify-center gap-1.5 font-medium mx-auto sm:mx-0">
            <span>Spooktacular Trick</span>
            <span>•</span>
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for young math learners</span>
          </div>

          {currentScreen !== 'welcome' && (
            <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 font-semibold text-purple-300 text-[11px] sm:text-xs">
              <span>Module 1: Trick-or-Think</span>
              <span>•</span>
              <span>Module 2: Math O' Lantern</span>
              <span>•</span>
              <span className="text-emerald-300">Module 3: Polotastic</span>
            </div>
          )}
        </div>
      </footer>
    </div>
  );
}

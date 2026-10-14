import React, { useState } from 'react';
import Header from './components/Header';
import GamePage from './components/GamePage';
import ComicStory from './components/ComicStory';
import PracticeMode from './components/PracticeMode';
import { Heart } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('game'); // 'game' | 'story' | 'practice'

  return (
    <div className="min-h-screen bg-[#0e051d] text-white flex flex-col font-['Fredoka',sans-serif] selection:bg-orange-500 selection:text-black">
      {/* Halloween Starry Night Background Effect */}
      <div className="fixed inset-0 pointer-events-none bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(120,40,200,0.35),rgba(255,255,255,0))] -z-10" />

      {/* Persistent Navigation Header */}
      <Header activeTab={activeTab} onTabChange={setActiveTab} />

      {/* Main Content Area */}
      <main className="flex-1 w-full flex flex-col justify-center py-2 sm:py-4">
        {activeTab === 'game' && (
          <GamePage
            onOpenStory={() => setActiveTab('story')}
            onOpenPractice={() => setActiveTab('practice')}
          />
        )}

        {activeTab === 'story' && (
          <ComicStory onStartGame={() => setActiveTab('game')} />
        )}

        {activeTab === 'practice' && (
          <PracticeMode onBackToStory={() => setActiveTab('game')} />
        )}
      </main>

      {/* Printable Worksheet View (Visible Only When Printing) */}
      <section className="hidden print:block text-black bg-white p-8 max-w-2xl mx-auto">
        <h1 className="text-3xl font-black text-center mb-1">
          Spooktacular Trick: Halloween Subtraction 🎃
        </h1>
        <p className="text-center text-sm font-semibold mb-6">
          Can you solve 500 − 53 by borrowing candy bags?
        </p>

        <div className="border-2 border-black p-4 rounded-xl mb-6">
          <h2 className="font-bold text-lg mb-2">Step 1: The Three Haunted Houses</h2>
          <p className="text-sm">
            Hundreds House has 5 (500 candies). Tens House has 0. Ones House has 0.
            Two trick-or-treaters need 53 candies (5 tens and 3 ones).
          </p>
        </div>

        <div className="border-2 border-black p-4 rounded-xl mb-6">
          <h2 className="font-bold text-lg mb-2">Step 2: The Borrowing Chain</h2>
          <p className="text-sm mb-2">
            • Hundreds House gives 1 hundred (10 tens = 100 candies) to Tens House.
            <br />
            Hundreds becomes <b>4</b>. Tens becomes <b>10</b>.
          </p>
          <p className="text-sm">
            • Tens House gives 1 ten (10 candies) to Ones House.
            <br />
            Tens becomes <b>9</b>. Ones becomes <b>10</b>.
          </p>
        </div>

        <div className="border-2 border-black p-4 rounded-xl mb-6 text-center">
          <h2 className="font-bold text-lg mb-3">Step 3: Solve the Subtraction Problem</h2>
          <pre className="font-mono text-xl inline-block text-left">
{`   H   T   O
   4   9  10
   5   0   0
-  0   5   3
------------
  [ ] [ ] [ ]`}
          </pre>
        </div>

        <div className="text-center text-sm font-bold mt-4">
          Answer: 500 − 53 = 447 candies!
        </div>
      </section>

      {/* Footer */}
      <footer className="w-full bg-[#0a0314] border-t border-purple-900/60 py-4 px-4 text-center text-xs text-gray-400 print:hidden">
        <div className="max-w-4xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium">
            <span>Made with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 fill-red-500" />
            <span>for young math learners & Halloween trick-or-treaters</span>
          </div>

          <div className="flex items-center gap-3 font-semibold text-purple-300">
            <span>500 − 53 = 447</span>
            <span>•</span>
            <button
              onClick={() => window.print()}
              className="hover:text-amber-300 underline cursor-pointer"
            >
              Print Worksheet
            </button>
            <span>•</span>
            <span>Base-10 Regrouping</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

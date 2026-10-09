/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { PetalCanvas } from './components/PetalCanvas';
import { TouchEffects } from './components/TouchEffects';
import { AudioHeader } from './components/AudioHeader';
import { YouTubeBackgroundMusic } from './components/YouTubeBackgroundMusic';
import { ChapterOneDoor } from './components/ChapterOneDoor';
import { ChapterTwoReveal } from './components/ChapterTwoReveal';
import { ChapterThreeDiya } from './components/ChapterThreeDiya';
import { ChapterFourGallery } from './components/ChapterFourGallery';
import { ChapterFiveShare } from './components/ChapterFiveShare';

export default function App() {
  const [currentChapter, setCurrentChapter] = useState(1);
  const [maxUnlockedChapter, setMaxUnlockedChapter] = useState(1);
  const [recipientName, setRecipientName] = useState<string>('');

  // Extract recipient name from URL query params safely
  useEffect(() => {
    try {
      const params = new URLSearchParams(window.location.search);
      const toParam = params.get('to');
      if (toParam) {
        setRecipientName(decodeURIComponent(toParam));
      }
    } catch (e) {
      console.warn('URL parsing notice:', e);
    }
  }, []);

  const goToChapter = (chapterNum: number) => {
    setCurrentChapter(chapterNum);
    if (chapterNum > maxUnlockedChapter) {
      setMaxUnlockedChapter(chapterNum);
    }
    // Scroll to top smoothly
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = (newName?: string) => {
    if (newName) {
      setRecipientName(newName);
    }
    setCurrentChapter(1);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative min-h-screen w-full bg-[#0c0507] text-[#faedd8] overflow-x-hidden selection:bg-[#c28424] selection:text-white font-sans">
      {/* Background Falling Shiuli Petals & Golden Motes */}
      <PetalCanvas />

      {/* Global Interactive Sacred Touch & Ripple Effects */}
      <TouchEffects />

      {/* Persistent Background YouTube Audio Player */}
      <YouTubeBackgroundMusic />

      {/* Persistent Audio Header with Chapter Progress, Recipient Name & Unobtrusive Mute Control */}
      <AudioHeader
        currentChapter={currentChapter}
        maxUnlockedChapter={maxUnlockedChapter}
        onSelectChapter={(num) => setCurrentChapter(num)}
        recipientName={recipientName}
      />

      {/* Main Experience Chapters Container */}
      <main className="relative w-full min-h-screen">
        {currentChapter === 1 && (
          <ChapterOneDoor
            onProceed={() => goToChapter(2)}
            recipientName={recipientName}
          />
        )}

        {currentChapter === 2 && (
          <ChapterTwoReveal
            onProceed={() => goToChapter(3)}
            onBack={() => setCurrentChapter(1)}
            recipientName={recipientName}
          />
        )}

        {currentChapter === 3 && (
          <ChapterThreeDiya
            onProceed={() => goToChapter(4)}
            onBack={() => setCurrentChapter(2)}
          />
        )}

        {currentChapter === 4 && (
          <ChapterFourGallery
            onProceed={() => goToChapter(5)}
            onBack={() => setCurrentChapter(3)}
          />
        )}

        {currentChapter === 5 && (
          <ChapterFiveShare
            onRestart={handleRestart}
            onBack={() => setCurrentChapter(4)}
            initialRecipientName={recipientName}
          />
        )}
      </main>

      {/* Mobile Chapter Progress Bar at Bottom for thumb convenience */}
      <div className="md:hidden fixed bottom-2 inset-x-4 z-40 flex items-center justify-center pointer-events-none">
        <div className="px-3 py-1.5 rounded-full bg-black/60 backdrop-blur-md border border-amber-500/20 flex items-center gap-2 pointer-events-auto shadow-lg">
          {[1, 2, 3, 4, 5].map((num) => {
            const isUnlocked = num <= maxUnlockedChapter;
            const isCurrent = currentChapter === num;
            return (
              <button
                key={num}
                disabled={!isUnlocked}
                onClick={() => setCurrentChapter(num)}
                aria-label={`অধ্যায় ${num}`}
                className={`transition-all duration-300 rounded-full ${
                  isCurrent
                    ? 'w-6 h-2 bg-amber-400 shadow-[0_0_8px_rgba(250,204,21,0.8)]'
                    : isUnlocked
                    ? 'w-2 h-2 bg-amber-700 hover:bg-amber-500'
                    : 'w-1.5 h-1.5 bg-stone-700 opacity-40'
                }`}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

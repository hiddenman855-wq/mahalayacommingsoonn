import React, { useState, useEffect } from 'react';
import { audioController } from '../utils/audio';

interface AudioHeaderProps {
  currentChapter: number;
  maxUnlockedChapter: number;
  onSelectChapter: (chapter: number) => void;
  recipientName?: string;
}

const CHAPTERS = [
  { num: 1, bnNum: '১', title: 'দ্বার উন্মোচন' },
  { num: 2, bnNum: '২', title: 'পুষ্পাঞ্জলি' },
  { num: 3, bnNum: '৩', title: 'মঙ্গল প্রদীপ' },
  { num: 4, bnNum: '৪', title: 'প্রতিমা দর্শন' },
  { num: 5, bnNum: '৫', title: 'শুভেচ্ছা বার্তা' },
];

export const AudioHeader: React.FC<AudioHeaderProps> = ({
  currentChapter,
  maxUnlockedChapter,
  onSelectChapter,
  recipientName,
}) => {
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false });

  useEffect(() => {
    const unsubscribe = audioController.subscribe((state) => {
      setAudioState(state);
    });
    return unsubscribe;
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-40 px-3 py-2 sm:px-6 sm:py-3 flex items-center justify-between gap-4 pointer-events-none">
      {/* Brand & Mahalaya Title with Recipient Name */}
      <div className="flex items-center gap-2 pointer-events-auto">
        <span className="font-serif-bengali text-base sm:text-lg font-bold text-amber-200 tracking-wide drop-shadow">
          শুভ মহালয়া
        </span>
        {recipientName && (
          <span className="text-xs sm:text-sm font-bold text-yellow-300 bg-amber-950/90 px-3 py-1 rounded-full border border-amber-400/60 shadow-[0_0_12px_rgba(245,158,11,0.3)] truncate max-w-[150px] sm:max-w-[240px]">
            {recipientName}
          </span>
        )}
      </div>

      {/* Chapter Progress Indicators (Clean unboxed and clickable for unlocked chapters) */}
      <nav
        aria-label="অধ্যায় ক্রম"
        className="hidden md:flex items-center gap-2 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-amber-500/20 pointer-events-auto"
      >
        {CHAPTERS.map((ch) => {
          const isCurrent = currentChapter === ch.num;
          const isUnlocked = ch.num <= maxUnlockedChapter;

          return (
            <button
              key={ch.num}
              disabled={!isUnlocked}
              onClick={() => onSelectChapter(ch.num)}
              className={`px-2.5 py-1 text-xs font-medium rounded-full transition-all duration-300 flex items-center gap-1.5 ${
                isCurrent
                  ? 'bg-amber-400 text-stone-950 font-bold shadow-[0_0_12px_rgba(250,204,21,0.6)]'
                  : isUnlocked
                  ? 'text-amber-200 hover:text-white hover:bg-amber-950/60 cursor-pointer'
                  : 'text-stone-600 cursor-not-allowed'
              }`}
            >
              <span>{ch.bnNum}.</span>
              <span>{ch.title}</span>
            </button>
          );
        })}
      </nav>

      {/* Unobtrusive Bengali Mute / Unmute Sound Control (Only visible when music has been initiated) */}
      <div className="flex items-center gap-2 pointer-events-auto">
        {audioState.isPlaying && (
          <button
            onClick={() => audioController.toggleMute()}
            aria-label={audioState.isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/50 hover:bg-black/80 backdrop-blur-md border border-amber-500/30 text-amber-200 hover:text-amber-100 text-xs transition-all duration-200 shadow-sm cursor-pointer"
          >
            {audioState.isMuted ? (
              <>
                <svg className="w-3.5 h-3.5 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
                <span>শব্দ চালু</span>
              </>
            ) : (
              <>
                <svg className="w-3.5 h-3.5 text-amber-400 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                </svg>
                <span>শব্দ বন্ধ</span>
              </>
            )}
          </button>
        )}
      </div>
    </header>
  );
};

import React, { useState } from 'react';
import { ASSETS } from '../assets/images';
import { GoldenKey3D } from './GoldenKey3D';
import { audioController } from '../utils/audio';

interface ChapterOneDoorProps {
  onProceed: () => void;
  recipientName?: string;
}

export const ChapterOneDoor: React.FC<ChapterOneDoorProps> = ({ onProceed, recipientName }) => {
  const [isUnlocking, setIsUnlocking] = useState(false);
  const [isDoorOpen, setIsDoorOpen] = useState(false);
  const [isRevealed, setIsRevealed] = useState(false);

  const handleUnlock = () => {
    if (isUnlocking || isDoorOpen) return;
    setIsUnlocking(true);

    // 1. Play realistic mechanical lock sound & initiate audio playback
    audioController.playLockSound();
    audioController.startMusic();

    // 2. Animate key turn & door opening inward
    setTimeout(() => {
      setIsDoorOpen(true);
      // Ensure continuous playback without restarting or seeking
      audioController.resumeMusic();
    }, 1300);

    // 3. Reveal Durga idol fully with volumetric rays
    setTimeout(() => {
      setIsRevealed(true);
      audioController.playTempleBellSound();
    }, 2500);
  };

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col items-center justify-center overflow-hidden bg-[#0c0507]">
      {/* Devotional Morning Mist & Golden Volumetric Light Rays */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-radial from-amber-500/20 via-orange-900/10 to-transparent blur-3xl" />
        <div className="absolute top-0 inset-x-0 h-96 bg-gradient-to-b from-amber-600/15 via-transparent to-transparent pointer-events-none" />
        {/* Subtle rotating divine rays in background */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1200px] h-[1200px] opacity-25 animate-divine-rays pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-amber-300/30 via-transparent to-transparent [mask-image:conic-gradient(from_0deg,transparent_0deg_10deg,black_10deg_20deg,transparent_20deg_30deg,black_30deg_40deg,transparent_40deg_50deg,black_50deg_60deg,transparent_60deg_70deg,black_70deg_80deg,transparent_80deg_90deg,black_90deg_100deg,transparent_100deg_110deg,black_110deg_120deg,transparent_120deg_130deg,black_130deg_140deg,transparent_140deg_150deg,black_150deg_160deg,transparent_160deg_170deg,black_170deg_180deg,transparent_180deg_190deg,black_190deg_200deg,transparent_200deg_210deg,black_210deg_220deg,transparent_220deg_230deg,black_230deg_240deg,transparent_240deg_250deg,black_250deg_260deg,transparent_260deg_270deg,black_270deg_280deg,transparent_280deg_290deg,black_290deg_300deg,transparent_300deg_310deg,black_310deg_320deg,transparent_320deg_330deg,black_330deg_340deg,transparent_340deg_350deg,black_350deg_360deg)]" />
        </div>
      </div>

      {/* Header Bengali Typography & Large Recipient Name */}
      <div className="relative z-20 text-center mb-4 md:mb-6 px-4 max-w-xl transition-all duration-700">
        {recipientName && (
          <div className="mb-3 px-6 py-2.5 rounded-full bg-gradient-to-r from-amber-950 via-amber-900/90 to-amber-950 border-2 border-amber-400/80 shadow-[0_0_30px_rgba(245,158,11,0.5)] inline-block animate-fade-in">
            <span className="text-sm sm:text-base text-amber-300 font-medium">স্নেহের ও শ্রদ্ধার </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-bold font-serif-bengali text-yellow-300 underline decoration-amber-400 decoration-2 underline-offset-4">
              {recipientName}
            </span>
            <span className="text-sm sm:text-base text-amber-300 font-medium">, আপনার জন্য আগমনী বার্তা</span>
          </div>
        )}
        <span className="block text-xs md:text-sm tracking-widest text-amber-400 uppercase font-medium mb-1 drop-shadow-md">
          {recipientName ? 'মায়ের বিশেষ আশীর্বাদ ও বার্তা' : 'মায়ের আগমনী বার্তা'}
        </span>
        <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold font-serif-bengali text-amber-100 tracking-wide drop-shadow-[0_4px_16px_rgba(234,179,8,0.5)]">
          শুভ মহালয়া
        </h1>
        <p className="text-xs sm:text-sm md:text-base text-amber-200/80 mt-1.5 font-light">
          {isDoorOpen ? 'আনন্দময়ীর আগমনে আলোকোজ্জ্বল হোক বসুন্ধরা' : 'চাবিটি ছুঁয়ে খুলে দাও মায়ের মন্দিরের স্বর্ণদ্বার'}
        </p>
      </div>

      {/* 3D Temple Gateway & Door Scene Container */}
      <div className="relative z-10 w-full max-w-md sm:max-w-lg md:max-w-2xl px-4 flex flex-col items-center">
        {/* Outer Temple Arch & Terracotta Frame */}
        <div
          className="relative w-full aspect-[4/5] sm:aspect-[4/5] rounded-t-full p-2.5 sm:p-4 bg-gradient-to-b from-[#3a1a0d] via-[#220d06] to-[#120502] border-2 border-amber-600/50 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_40px_rgba(245,158,11,0.2)] overflow-hidden perspective-1500"
        >
          {/* Ornate Arch Floral Crown Border */}
          <div className="absolute inset-0 pointer-events-none rounded-t-full border border-amber-400/30 z-30" />

          {/* INNER SANCTUM: Revealed Maa Durga Idol */}
          <div className="absolute inset-2.5 sm:inset-4 rounded-t-full overflow-hidden bg-black flex items-center justify-center z-0">
            <img
              src={ASSETS.durgaTraditional}
              alt="Maa Durga Traditional Kumartuli Idol"
              referrerPolicy="no-referrer"
              className={`w-full h-full object-cover transition-all duration-1000 ${
                isDoorOpen ? 'scale-105 opacity-100' : 'scale-95 opacity-0'
              }`}
            />

            {/* Radiant Volumetric Light coming from inside the temple */}
            <div
              className={`absolute inset-0 bg-gradient-to-t from-amber-950/80 via-transparent to-amber-500/25 pointer-events-none transition-opacity duration-1000 ${
                isDoorOpen ? 'opacity-100' : 'opacity-0'
              }`}
            />

            {/* Glowing Golden Ring around Durga */}
            {isDoorOpen && (
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 md:w-80 md:h-80 rounded-full border border-amber-300/40 bg-amber-400/10 blur-md animate-pulse pointer-events-none" />
            )}
          </div>

          {/* 3D DOUBLE DOOR PANELS */}
          <div className="absolute inset-2.5 sm:inset-4 rounded-t-full flex overflow-hidden z-10 transform-style-3d pointer-events-none">
            {/* Left Door Panel */}
            <div
              className="w-1/2 h-full relative origin-left transition-transform duration-[2200ms] ease-in-out transform-style-3d shadow-[4px_0_15px_rgba(0,0,0,0.8)]"
              style={{
                transform: isDoorOpen ? 'rotateY(-105deg)' : 'rotateY(0deg)',
              }}
            >
              <img
                src={ASSETS.templeDoor}
                alt="Bengali Temple Door Left Panel"
                referrerPolicy="no-referrer"
                className="w-[200%] max-w-none h-full object-cover object-left"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/60" />
              {/* Golden Brass Studs & Ornaments on Left Door */}
              <div className="absolute top-1/2 right-2 -translate-y-1/2 w-4 h-16 bg-gradient-to-r from-amber-400 to-amber-700 rounded-l shadow-md border border-amber-300/50" />
            </div>

            {/* Right Door Panel */}
            <div
              className="w-1/2 h-full relative origin-right transition-transform duration-[2200ms] ease-in-out transform-style-3d shadow-[-4px_0_15px_rgba(0,0,0,0.8)]"
              style={{
                transform: isDoorOpen ? 'rotateY(105deg)' : 'rotateY(0deg)',
              }}
            >
              <img
                src={ASSETS.templeDoor}
                alt="Bengali Temple Door Right Panel"
                referrerPolicy="no-referrer"
                className="w-[200%] max-w-none h-full object-cover object-right -translate-x-1/2"
              />
              <div className="absolute inset-0 bg-gradient-to-l from-black/40 via-transparent to-black/60" />
              {/* Golden Brass Studs & Lock Plate on Right Door */}
              <div className="absolute top-1/2 left-2 -translate-y-1/2 w-4 h-16 bg-gradient-to-l from-amber-400 to-amber-700 rounded-r shadow-md border border-amber-300/50" />
            </div>
          </div>

          {/* Central Golden Antique Lock Assembly (Visible when closed) */}
          {!isDoorOpen && (
            <div
              className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 transition-all duration-700 flex flex-col items-center ${
                isUnlocking ? 'scale-110 opacity-90' : 'scale-100 opacity-100'
              }`}
            >
              {/* Brass Lock Plate */}
              <div className="w-16 h-20 sm:w-20 sm:h-24 rounded-2xl bg-gradient-to-b from-amber-300 via-yellow-600 to-amber-900 border-2 border-amber-200/80 shadow-[0_4px_25px_rgba(0,0,0,0.8)] flex flex-col items-center justify-center p-2">
                <div className="w-5 h-5 rounded-full border-2 border-amber-900 bg-amber-400 flex items-center justify-center mb-1">
                  <div className="w-1.5 h-1.5 rounded-full bg-amber-950" />
                </div>
                {/* Keyhole */}
                <div className="w-2.5 h-6 bg-black rounded-t-full shadow-inner border border-amber-900" />
                <span className="text-[9px] font-bold text-amber-950 uppercase tracking-tighter mt-1">
                  দ্বারবন্ধনী
                </span>
              </div>
            </div>
          )}

          {/* 3D Floating Interactive Golden Key */}
          {!isDoorOpen && (
            <div className="absolute inset-0 z-30 flex items-center justify-center pointer-events-auto">
              <GoldenKey3D onUnlock={handleUnlock} isUnlocking={isUnlocking} />
            </div>
          )}
        </div>

        {/* Action Button after door reveals Maa Durga */}
        {isRevealed && (
          <div className="mt-6 flex flex-col items-center gap-3 animate-fade-in z-30">
            <button
              onClick={onProceed}
              className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold text-base md:text-lg shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:shadow-[0_0_35px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 border border-amber-200"
            >
              <span>দেবীবন্দনায় প্রবেশ করো</span>
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </button>
            <span className="text-xs text-amber-300/70">
              পরবর্তী অধ্যায়ে রয়েছে ত্রিমাত্রিক দেবীরূপ ও আশীর্বাদ
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

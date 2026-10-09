import React, { useState, useEffect } from 'react';
import { ASSETS } from '../assets/images';
import { audioController } from '../utils/audio';

interface ChapterFourGalleryProps {
  onProceed: () => void;
  onBack: () => void;
}

interface GalleryItem {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  shloka: string;
}

const GALLERY_ITEMS: GalleryItem[] = [
  {
    id: 'kumartuli',
    image: ASSETS.durgaFront,
    title: 'জগজ্জননী মা দুর্গা',
    subtitle: 'সিংহবাহিনী ত্রিনয়নী দশভুজা প্রতিমা',
    shloka: 'সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে',
    description: 'মহামায়ার প্রসন্ন দিব্য সম্মুখ রূপ ও স্বর্ণালঙ্কারে ঝলমলে চিরাচরিত মাতৃপ্রতিমা।',
  },
  {
    id: 'chokkhudan',
    image: ASSETS.durgaFace,
    title: 'চিন্ময়ী আনন্দময়ী',
    subtitle: 'ভোরের আলোয় পুণ্য চক্ষুদান',
    shloka: 'যা দেবী সর্বভূতেষু চেতনেত্যভিধীয়তে',
    description: 'ত্রিনয়নী মায়ের প্রসন্ন দৃষ্টিতে দূর হয় সংসারের সর্ব অশুভ আঁধার।',
  },
  {
    id: 'daker-saaj',
    image: ASSETS.durgaDakerSaaj,
    title: 'শ্বেতশুভ্র ডাকের সাজ',
    subtitle: 'শোলা ও রূপোর কারুকার্য',
    shloka: 'শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তু তে',
    description: 'বাংলার প্রাচীন আভিজাত্যের অনন্য শৈল্পিক শোলার ডাকের সাজের প্রতিমা।',
  },
  {
    id: 'rajbari',
    image: ASSETS.durgaRajbari,
    title: 'বনেদি রাজবাড়ির প্রতিমা',
    subtitle: 'একচালা সাবেকী দুর্গোৎসব',
    shloka: 'নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ',
    description: 'ঘিয়ের প্রদীপ ও চালচিত্রের মাঝে শতবর্ষের ঐতিহ্যবাহী দেবীবন্দনা।',
  },
  {
    id: 'asurdalani',
    image: ASSETS.durgaArtistic,
    title: 'দশভুজা মহিষাসুরমর্দিনী',
    subtitle: 'সোনার চালচিত্রে মহাশক্তি',
    shloka: 'রূপং দেহি জয়ং দেহি যশো দেহি দ্বিষো জহি',
    description: 'দশ হস্তে ধারণ করা দশ দেব-আয়ুধে অসুর দলনকারী অবিনাশী মাতৃরূপ।',
  },
];

export const ChapterFourGallery: React.FC<ChapterFourGalleryProps> = ({ onProceed, onBack }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const [touchStartY, setTouchStartY] = useState<number | null>(null);

  const total = GALLERY_ITEMS.length;

  const handlePrev = () => {
    setActiveIndex((prev) => (prev === 0 ? total - 1 : prev - 1));
    audioController.playTempleBellSound();
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev === total - 1 ? 0 : prev + 1));
    audioController.playTempleBellSound();
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === 'ArrowRight') handleNext();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Enhanced mobile touch swipe detection
  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStartX(e.targetTouches[0].clientX);
    setTouchStartY(e.targetTouches[0].clientY);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX === null || touchStartY === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;

    const diffX = touchStartX - touchEndX;
    const diffY = touchStartY - touchEndY;

    // Detect horizontal swipe more than vertical scroll
    if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 35) {
      if (diffX > 0) {
        handleNext();
      } else {
        handlePrev();
      }
    }

    setTouchStartX(null);
    setTouchStartY(null);
  };

  const activeItem = GALLERY_ITEMS[activeIndex];

  return (
    <div className="relative w-full min-h-[100dvh] h-full flex flex-col items-center justify-between py-2 sm:py-6 px-2 sm:px-4 overflow-x-hidden overflow-y-auto sm:overflow-hidden bg-gradient-to-b from-[#120508] via-[#090204] to-[#110406]">
      {/* Background Volumetric Radiance */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-gradient-radial from-amber-600/15 via-orange-950/15 to-transparent blur-3xl" />
      </div>

      {/* Chapter 4 Header */}
      <div className="relative z-10 text-center max-w-xl mt-1 sm:mt-2 px-2 shrink-0">
        <span className="text-[10px] sm:text-xs md:text-sm tracking-widest text-amber-400 uppercase font-semibold">
          অধ্যায় ৪ · প্রতিমা দর্শন
        </span>
        <h2 className="text-xl sm:text-3xl md:text-5xl font-bold font-serif-bengali text-amber-100 mt-0.5 drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
          মায়ের রূপে মুগ্ধ হোক মন
        </h2>
        <p className="text-[10px] sm:text-xs md:text-sm text-amber-200/80 mt-0.5 font-light">
          আঙুল দিয়ে ডানে-বাঁয়ে সোয়াইপ করে বিভিন্ন প্রতিমা দর্শন করুন
        </p>
      </div>

      {/* 3D HORIZONTAL CURVED CAROUSEL (Mobile-Calibrated 3D Stage) */}
      <div
        className="relative z-10 w-full max-w-5xl h-[240px] sm:h-[350px] md:h-[430px] my-auto flex items-center justify-center perspective-1000 sm:perspective-1500 select-none overflow-visible touch-pan-y shrink-0"
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
      >
        <div className="relative w-full h-full flex items-center justify-center transform-style-3d">
          {GALLERY_ITEMS.map((item, idx) => {
            let offset = idx - activeIndex;
            if (offset > total / 2) offset -= total;
            if (offset < -total / 2) offset += total;

            const isCenter = offset === 0;
            const isLeft = offset === -1;
            const isRight = offset === 1;

            let transform = '';
            let opacity = 0;
            let zIndex = 0;

            if (isCenter) {
              transform = 'translateX(0%) translateZ(30px) rotateY(0deg) scale(1)';
              opacity = 1;
              zIndex = 30;
            } else if (isLeft) {
              // Mobile-tuned translateX prevents cut-off on phones
              transform = 'translateX(-52%) translateZ(-90px) rotateY(24deg) scale(0.8)';
              opacity = 0.65;
              zIndex = 20;
            } else if (isRight) {
              transform = 'translateX(52%) translateZ(-90px) rotateY(-24deg) scale(0.8)';
              opacity = 0.65;
              zIndex = 20;
            } else if (offset === -2) {
              transform = 'translateX(-90%) translateZ(-190px) rotateY(38deg) scale(0.62)';
              opacity = 0.25;
              zIndex = 10;
            } else if (offset === 2) {
              transform = 'translateX(90%) translateZ(-190px) rotateY(-38deg) scale(0.62)';
              opacity = 0.25;
              zIndex = 10;
            } else {
              transform = 'translateX(0%) translateZ(-350px) scale(0.35)';
              opacity = 0;
              zIndex = 0;
            }

            return (
              <div
                key={item.id}
                onClick={() => {
                  setActiveIndex(idx);
                  audioController.playTempleBellSound();
                }}
                className={`absolute w-[160px] xs:w-[175px] sm:w-[260px] md:w-[320px] aspect-[3/4] rounded-xl sm:rounded-2xl overflow-hidden cursor-pointer transition-all duration-500 ease-out transform-style-3d group shadow-[0_15px_35px_rgba(0,0,0,0.85)] ${
                  isCenter ? 'pointer-events-auto' : 'pointer-events-auto'
                }`}
                style={{
                  transform,
                  opacity,
                  zIndex,
                }}
              >
                {/* Golden Ornate Frame Border */}
                <div
                  className={`absolute inset-0 p-1.5 sm:p-2 rounded-xl sm:rounded-2xl pointer-events-none z-10 transition-all duration-300 ${
                    isCenter
                      ? 'bg-gradient-to-b from-amber-300 via-amber-600 to-amber-900 border-2 border-amber-300 shadow-[0_0_20px_rgba(245,158,11,0.6)]'
                      : 'bg-black/60 border border-amber-950/60'
                  }`}
                />

                {/* Idol Image */}
                <img
                  src={item.image}
                  alt={item.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />

                {/* Scrim on non-active images */}
                {!isCenter && (
                  <div className="absolute inset-0 bg-black/45 transition-colors z-10" />
                )}
              </div>
            );
          })}
        </div>

        {/* Previous & Next Arrow Buttons (Thumb-Friendly on Mobile) */}
        <button
          onClick={handlePrev}
          aria-label="পূর্ববর্তী প্রতিমা"
          className="absolute left-0.5 sm:left-4 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/75 border border-amber-400/50 text-amber-200 hover:text-white hover:bg-amber-600/80 active:scale-95 transition-all flex items-center justify-center backdrop-blur-md cursor-pointer shadow-lg"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        <button
          onClick={handleNext}
          aria-label="পরবর্তী প্রতিমা"
          className="absolute right-0.5 sm:right-4 z-40 w-8 h-8 sm:w-11 sm:h-11 rounded-full bg-black/75 border border-amber-400/50 text-amber-200 hover:text-white hover:bg-amber-600/80 active:scale-95 transition-all flex items-center justify-center backdrop-blur-md cursor-pointer shadow-lg"
        >
          <svg className="w-4 h-4 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      {/* Active Pratima Description Card (Mobile Optimized) */}
      <div className="relative z-10 text-center w-full max-w-sm sm:max-w-md px-3 sm:px-4 bg-gradient-to-r from-stone-950/90 via-black/95 to-stone-950/90 py-1.5 sm:py-2.5 rounded-xl sm:rounded-2xl border border-amber-500/25 backdrop-blur-sm shadow-md my-0.5 sm:my-1 shrink-0">
        <h3 className="text-sm sm:text-xl font-bold font-serif-bengali text-amber-200">
          {activeItem.title}
        </h3>
        <p className="text-[11px] sm:text-sm text-amber-300 font-medium mt-0.5">
          {activeItem.subtitle}
        </p>
        <p className="text-[10px] sm:text-xs text-amber-100/75 mt-0.5 italic line-clamp-2 sm:line-clamp-none">
          {activeItem.description}
        </p>
      </div>

      {/* Thumbnail Bar (Compact on Mobile) */}
      <div className="relative z-10 flex items-center justify-center gap-1 sm:gap-2 my-1 shrink-0">
        {GALLERY_ITEMS.map((item, idx) => (
          <button
            key={item.id}
            onClick={() => {
              setActiveIndex(idx);
              audioController.playTempleBellSound();
            }}
            className={`w-7 h-9 sm:w-11 sm:h-14 rounded-md sm:rounded-lg overflow-hidden border-2 transition-all duration-300 cursor-pointer ${
              activeIndex === idx
                ? 'border-amber-400 scale-105 shadow-[0_0_10px_rgba(245,158,11,0.8)] ring-1 ring-amber-300'
                : 'border-amber-950/70 opacity-60 hover:opacity-100'
            }`}
          >
            <img
              src={item.image}
              alt={item.title}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </button>
        ))}
      </div>

      {/* Navigation Controls: Previous Chapter / Next Chapter */}
      <div className="relative z-10 flex items-center gap-2.5 sm:gap-4 mt-0.5 mb-1 sm:mb-2 shrink-0">
        <button
          onClick={onBack}
          className="px-3.5 py-1.5 sm:px-5 sm:py-2.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-stone-800 transition-all text-xs sm:text-sm font-medium cursor-pointer"
        >
          পূর্বের অধ্যায়
        </button>

        <button
          onClick={onProceed}
          className="px-5 py-2 sm:px-8 sm:py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-base shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-1.5 sm:gap-2"
        >
          <span>শেষ অধ্যায়ে চলো</span>
          <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

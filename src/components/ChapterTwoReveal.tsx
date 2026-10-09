import React, { useState, useEffect, useRef } from 'react';
import { ASSETS } from '../assets/images';
import { audioController } from '../utils/audio';

interface ChapterTwoRevealProps {
  onProceed: () => void;
  onBack: () => void;
  recipientName?: string;
}

interface FlowerParticle {
  id: number;
  x: number;
  y: number;
  type: 'hibiscus' | 'shiuli' | 'lotus' | 'gold';
  rotation: number;
  scale: number;
}

const SACRED_SHLOKAS = [
  'যা দেবী সর্বভূতেষু মাতৃরূপেণ সংস্থিতা, নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ।',
  'সর্বমঙ্গলমঙ্গল্যে শিবে সর্বার্থসাধিকে, শরণ্যে ত্র্যম্বকে গৌরি নারায়ণি নমোঽস্তু তে।',
  'যা দেবী সর্বভূতেষু শক্তিরূপেণ সংস্থিতা, নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ।',
  'রূপং দেহি জয়ং দেহি যশো দেহি দ্বিষো জহি, দেহি সৌভাগ্যমারোগ্যং দেহি মে পরমং সুখম্।',
];

export const ChapterTwoReveal: React.FC<ChapterTwoRevealProps> = ({
  onProceed,
  onBack,
  recipientName,
}) => {
  const [tiltX, setTiltX] = useState(0);
  const [tiltY, setTiltY] = useState(0);
  const [offeringCount, setOfferingCount] = useState(0);
  const [shlokaIdx, setShlokaIdx] = useState(0);
  const [flowerParticles, setFlowerParticles] = useState<FlowerParticle[]>([]);
  const nextParticleId = useRef(0);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const displayName = recipientName?.trim() || 'আপনার ও আপনার পরিবারের';

  // 3D Tilt interaction tracking mouse
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 24;
      const y = (e.clientY / innerHeight - 0.5) * -24;
      setTiltY(x);
      setTiltX(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // Cycle shlokas periodically
  useEffect(() => {
    const timer = setInterval(() => {
      setShlokaIdx((prev) => (prev + 1) % SACRED_SHLOKAS.length);
    }, 6000);
    return () => clearInterval(timer);
  }, []);

  // Handle Interactive 3D Pushpanjali Offering
  const handleOfferFlowers = () => {
    setOfferingCount((prev) => prev + 1);
    audioController.playTempleBellSound();

    // Spawn 14 vibrant sacred flower petals in 3D arc
    const newParticles: FlowerParticle[] = [];
    const types: ('hibiscus' | 'shiuli' | 'lotus' | 'gold')[] = ['hibiscus', 'shiuli', 'lotus', 'gold'];

    for (let i = 0; i < 14; i++) {
      newParticles.push({
        id: nextParticleId.current++,
        x: (Math.random() - 0.5) * 360,
        y: Math.random() * 80 + 120,
        type: types[Math.floor(Math.random() * types.length)],
        rotation: Math.random() * 360,
        scale: Math.random() * 0.5 + 0.8,
      });
    }

    setFlowerParticles((prev) => [...prev, ...newParticles]);

    // Clean up after 2.5s
    setTimeout(() => {
      setFlowerParticles((prev) => prev.slice(newParticles.length));
    }, 2400);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full min-h-screen h-full flex flex-col items-center justify-between py-8 px-4 overflow-hidden bg-gradient-to-b from-[#160608] via-[#0b0204] to-[#130507]"
    >
      {/* Background Volumetric Radiance */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[850px] bg-gradient-radial from-amber-600/25 via-rose-950/20 to-transparent blur-3xl" />
        {/* Radiating Divine Aura Rays */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] opacity-20 animate-divine-rays pointer-events-none">
          <div className="w-full h-full bg-[radial-gradient(circle,_var(--tw-gradient-stops))] from-amber-400 via-transparent to-transparent [mask-image:conic-gradient(from_0deg,transparent_0deg_15deg,black_15deg_30deg,transparent_30deg_45deg,black_45deg_60deg,transparent_60deg_75deg,black_75deg_90deg,transparent_90deg_105deg,black_105deg_120deg,transparent_120deg_135deg,black_135deg_150deg,transparent_150deg_165deg,black_165deg_180deg,transparent_180deg_195deg,black_195deg_210deg,transparent_210deg_225deg,black_225deg_240deg,transparent_240deg_255deg,black_255deg_270deg,transparent_270deg_285deg,black_285deg_300deg,transparent_300deg_315deg,black_315deg_330deg,transparent_330deg_345deg,black_345deg_360deg)]" />
        </div>
      </div>

      {/* Chapter 2 Header & Personalized Blessing */}
      <div className="relative z-10 text-center max-w-2xl mt-4 px-2">
        <span className="text-xs md:text-sm tracking-widest text-amber-400 uppercase font-semibold">
          অধ্যায় ২ · চিন্ময়ী দেবীবন্দনা ও পুষ্পাঞ্জলি
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-bengali text-amber-100 mt-1 drop-shadow-[0_4px_25px_rgba(245,158,11,0.6)]">
          শুভ মহালয়া
        </h2>
        {/* Dynamic Large Recipient Blessing Banner */}
        <div className="mt-3 px-6 py-3 rounded-2xl bg-gradient-to-r from-amber-950/95 via-amber-900/80 to-amber-950/95 border-2 border-amber-400/70 backdrop-blur-md shadow-[0_0_35px_rgba(245,158,11,0.4)] inline-block">
          <p className="text-lg sm:text-2xl md:text-3xl font-serif-bengali font-bold text-amber-100">
            <span className="text-yellow-300 text-xl sm:text-3xl md:text-4xl underline decoration-amber-400 decoration-2 underline-offset-4">
              {displayName}
            </span>
            -এর জন্য রইল মায়ের পুণ্য আশীর্বাদ
          </p>
        </div>
      </div>

      {/* 3D HOLOGRAPHIC TEMPLE ALTAR & GOLDEN CHALCHITRA (Interacts with Mouse Tilt) */}
      <div
        className="relative z-10 w-full max-w-lg md:max-w-xl my-auto py-2 flex flex-col items-center perspective-1500 select-none"
      >
        <div
          className="relative w-72 sm:w-84 md:w-96 aspect-[3/4] rounded-t-full rounded-b-3xl p-3 sm:p-4 bg-gradient-to-b from-amber-300 via-amber-700 to-amber-950 shadow-[0_30px_70px_rgba(0,0,0,0.95),0_0_50px_rgba(245,158,11,0.4)] transform-style-3d transition-transform duration-200 ease-out"
          style={{
            transform: `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`,
          }}
        >
          {/* Ornate Golden Crown Chalchitra Filigree */}
          <div className="absolute inset-0 rounded-t-full rounded-b-3xl border-2 border-amber-200/70 pointer-events-none z-20 shadow-[inset_0_0_20px_rgba(0,0,0,0.6)]" />

          {/* Chalchitra Top Arch Golden Motif */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 w-32 h-12 bg-gradient-to-b from-amber-200 to-yellow-600 rounded-t-full border border-amber-100 flex items-center justify-center shadow-lg z-30">
            <span className="text-stone-950 font-serif-bengali font-bold text-xs uppercase tracking-wider">
              শ্রী শ্রী দুর্গা
            </span>
          </div>

          {/* Inner Idol Photo: Traditional Kumartuli Pratima with Glowing Third Eye */}
          <div className="relative w-full h-full rounded-t-full rounded-b-2xl overflow-hidden bg-black flex items-center justify-center">
            <img
              src={ASSETS.durgaTraditional}
              alt="Maa Durga Holy Idol"
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />

            {/* Glowing Tejorashi Overlay & Divine Halo */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-amber-500/20 pointer-events-none" />

            {/* Divine Light Shimmer at the Crown */}
            <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 rounded-full bg-amber-400/25 blur-xl pointer-events-none animate-pulse" />

            {/* Dynamic Shloka Overlay at bottom of idol */}
            <div className="absolute inset-x-2 bottom-3 p-3 rounded-xl bg-black/75 backdrop-blur-md border border-amber-500/30 text-center">
              <p className="text-xs sm:text-sm font-serif-bengali text-amber-200 italic leading-relaxed">
                “{SACRED_SHLOKAS[shlokaIdx]}”
              </p>
            </div>
          </div>

          {/* 3D Flying Flower Particles (Pushpanjali Offering) */}
          {flowerParticles.map((p) => {
            return (
              <div
                key={p.id}
                className="absolute left-1/2 bottom-4 pointer-events-none z-30 transition-all duration-[2200ms] ease-out"
                style={{
                  transform: `translate3d(${p.x}px, -${p.y * 2.2}px, 60px) rotate(${p.rotation}deg) scale(${p.scale})`,
                  opacity: 0.95,
                }}
              >
                {p.type === 'hibiscus' ? (
                  // Red Hibiscus (জবা ফুল)
                  <svg className="w-8 h-8 filter drop-shadow-md" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="12" fill="#dc2626" />
                    <circle cx="16" cy="16" r="7" fill="#b91c1c" />
                    <circle cx="16" cy="16" r="2.5" fill="#facc15" />
                  </svg>
                ) : p.type === 'shiuli' ? (
                  // White Shiuli Flower (শিউলি ফুল)
                  <svg className="w-7 h-7 filter drop-shadow-md" viewBox="0 0 32 32">
                    <circle cx="16" cy="16" r="10" fill="#ffffff" />
                    <circle cx="16" cy="16" r="3.5" fill="#ea580c" />
                  </svg>
                ) : p.type === 'lotus' ? (
                  // Pink Lotus Petal (পদ্ম পাপড়ি)
                  <svg className="w-9 h-9 filter drop-shadow-md" viewBox="0 0 32 32">
                    <ellipse cx="16" cy="16" rx="13" ry="8" fill="#f472b6" />
                    <ellipse cx="16" cy="16" rx="8" ry="4" fill="#ec4899" />
                  </svg>
                ) : (
                  // Golden Spark
                  <div className="w-3.5 h-3.5 rounded-full bg-amber-300 shadow-[0_0_12px_#fde047]" />
                )}
              </div>
            );
          })}
        </div>

        {/* Pushpanjali Interactive Action Button */}
        <div className="mt-5 flex flex-col items-center gap-1.5">
          <button
            onClick={handleOfferFlowers}
            className="px-7 py-3 rounded-full bg-gradient-to-r from-rose-700 via-amber-600 to-amber-500 text-amber-100 font-bold text-sm sm:text-base shadow-[0_0_20px_rgba(244,63,94,0.5)] hover:shadow-[0_0_30px_rgba(245,158,11,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 border border-amber-300/60"
          >
            <span>পুষ্পাঞ্জলি অর্পণ করো</span>
            <svg className="w-5 h-5 text-yellow-300 animate-bounce" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
            </svg>
          </button>
          <span className="text-xs text-amber-300/80 font-medium">
            {offeringCount > 0
              ? `মায়ের চরণে ${offeringCount} বার পুষ্পাঞ্জলি নিবেদিত হয়েছে`
              : 'ক্লিক করে মায়ের শ্রীচরণে জবা ও শিউলি ফুল অর্পণ করুন'}
          </span>
        </div>
      </div>

      {/* Navigation Controls */}
      <div className="relative z-10 flex items-center gap-4 mt-2 mb-4">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-stone-800 transition-all text-sm font-medium cursor-pointer"
        >
          পূর্বের অধ্যায়
        </button>

        <button
          onClick={onProceed}
          className="px-8 py-3 rounded-full bg-gradient-to-r from-amber-500 via-yellow-500 to-amber-600 text-stone-950 font-bold text-base shadow-[0_0_20px_rgba(245,158,11,0.5)] hover:shadow-[0_0_30px_rgba(250,204,21,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2"
        >
          <span>পরের অধ্যায়: আলোকময় প্রদীপ</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

import React, { useState, useEffect, useRef } from 'react';

interface GoldenKey3DProps {
  onUnlock: () => void;
  isUnlocking: boolean;
}

export const GoldenKey3D: React.FC<GoldenKey3DProps> = ({ onUnlock, isUnlocking }) => {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isUnlocking) return;
      const { innerWidth, innerHeight } = window;
      const x = (e.clientX / innerWidth - 0.5) * 36;
      const y = (e.clientY / innerHeight - 0.5) * -36;
      setRotateY(x);
      setRotateX(y);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isUnlocking]);

  const handleClick = () => {
    if (isUnlocking) return;
    onUnlock();
  };

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label="স্বর্ণের চাবি ছুঁয়ে মায়ের দ্বার উন্মোচন করো"
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleClick();
        }
      }}
      className={`relative cursor-pointer select-none transition-all duration-700 outline-none group ${
        isUnlocking ? 'pointer-events-none' : ''
      }`}
      style={{
        perspective: '1200px',
      }}
    >
      {/* Golden Aura & Glow */}
      <div
        className={`absolute inset-0 rounded-full blur-2xl transition-opacity duration-500 pointer-events-none ${
          isHovered || isUnlocking
            ? 'opacity-90 bg-amber-400/40 scale-125'
            : 'opacity-40 bg-amber-500/20 scale-100'
        }`}
      />

      {/* 3D Key Container */}
      <div
        className={`w-40 h-72 md:w-48 md:h-80 flex items-center justify-center transform-style-3d transition-transform duration-300 ease-out ${
          isUnlocking ? '' : 'animate-float-key'
        }`}
        style={{
          transform: isUnlocking
            ? 'translateY(-140px) scale(0.7) rotate(90deg) translateZ(80px)'
            : `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(${isHovered ? 1.08 : 1})`,
          transition: isUnlocking
            ? 'transform 1.4s cubic-bezier(0.2, 0.8, 0.2, 1), opacity 1.4s ease'
            : 'transform 0.15s ease-out',
        }}
      >
        {/* Detailed Ornate 3D Golden Key Graphic (SVG with rich brass/gold lighting) */}
        <svg
          viewBox="0 0 160 300"
          className="w-full h-full drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)] filter transition-all duration-300"
          style={{
            filter: isHovered
              ? 'drop-shadow(0 0 25px rgba(245, 158, 11, 0.85)) brightness(1.15)'
              : 'drop-shadow(0 0 14px rgba(217, 119, 6, 0.5))',
          }}
        >
          <defs>
            {/* Metallic Gold Gradients */}
            <linearGradient id="goldKeyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#fff3b0" />
              <stop offset="25%" stopColor="#ffd700" />
              <stop offset="50%" stopColor="#d4af37" />
              <stop offset="75%" stopColor="#aa7c11" />
              <stop offset="100%" stopColor="#5c3d03" />
            </linearGradient>

            <linearGradient id="goldShine" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#ffd700" />
              <stop offset="40%" stopColor="#fff8db" />
              <stop offset="60%" stopColor="#ffd700" />
              <stop offset="100%" stopColor="#b38728" />
            </linearGradient>

            <radialGradient id="jewelGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#ff4d4d" />
              <stop offset="70%" stopColor="#b91c1c" />
              <stop offset="100%" stopColor="#450a0a" />
            </radialGradient>

            <filter id="goldRelief" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="2" dy="4" stdDeviation="3" floodColor="#221202" floodOpacity="0.7" />
            </filter>
          </defs>

          {/* Key Bow / Handle (Intricate Antique Bengali Temple Finial / Trisula & Lotus Motif) */}
          <g filter="url(#goldRelief)">
            {/* Outer Decorative Ring */}
            <circle
              cx="80"
              cy="70"
              r="48"
              fill="url(#goldKeyGradient)"
              stroke="#ffe885"
              strokeWidth="3.5"
            />
            {/* Inner Ring Cutout */}
            <circle
              cx="80"
              cy="70"
              r="30"
              fill="#180b06"
              stroke="#8a5a08"
              strokeWidth="2.5"
            />

            {/* Inner Sacred Trisula / Crown Finial Motif inside bow */}
            <path
              d="M 80 44 L 80 96 M 68 55 Q 80 62 80 75 Q 80 62 92 55 M 72 82 Q 80 88 88 82"
              fill="none"
              stroke="url(#goldShine)"
              strokeWidth="4"
              strokeLinecap="round"
            />

            {/* Top Crown Crest */}
            <path
              d="M 64 26 Q 80 10 96 26 Q 88 28 80 20 Q 72 28 64 26 Z"
              fill="url(#goldKeyGradient)"
              stroke="#ffeaa7"
              strokeWidth="2"
            />

            {/* Center Ruby Gem in Bow */}
            <circle cx="80" cy="70" r="7" fill="url(#jewelGlow)" stroke="#ffd700" strokeWidth="1.5" />

            {/* Collar / Key Neck */}
            <rect
              x="71"
              y="118"
              width="18"
              height="16"
              rx="4"
              fill="url(#goldKeyGradient)"
              stroke="#ffe885"
              strokeWidth="2"
            />
            <rect
              x="67"
              y="128"
              width="26"
              height="8"
              rx="3"
              fill="url(#goldShine)"
              stroke="#8a5a08"
              strokeWidth="1.5"
            />

            {/* Key Stem / Shaft */}
            <rect
              x="73"
              y="136"
              width="14"
              height="115"
              rx="4"
              fill="url(#goldKeyGradient)"
              stroke="#ffe885"
              strokeWidth="1.5"
            />
            {/* Shaft Highlight Line */}
            <line
              x1="77"
              y1="140"
              x2="77"
              y2="245"
              stroke="#fffbe0"
              strokeWidth="2"
              strokeLinecap="round"
              opacity="0.8"
            />

            {/* Key Bit / Notches (Carved Bengali Lock Tumblers) */}
            <path
              d="M 87 200 L 115 200 L 115 212 L 102 212 L 102 222 L 120 222 L 120 236 L 98 236 L 98 248 L 116 248 L 116 256 L 87 256 Z"
              fill="url(#goldKeyGradient)"
              stroke="#ffe885"
              strokeWidth="2"
            />
            {/* Bit Decorative Notches */}
            <circle cx="107" cy="206" r="2.5" fill="#180b06" />
            <circle cx="109" cy="242" r="2.5" fill="#180b06" />

            {/* Key Tip / Finial */}
            <path
              d="M 73 251 L 80 262 L 87 251 Z"
              fill="url(#goldShine)"
              stroke="#ffe885"
              strokeWidth="1.5"
            />
          </g>
        </svg>
      </div>

      {/* Touch / Click Invitation Label below key */}
      {!isUnlocking && (
        <div className="mt-4 flex flex-col items-center pointer-events-none text-center">
          <span className="text-xs uppercase tracking-widest text-amber-300/80 mb-1">
            মায়ের আগমনী বার্তা
          </span>
          <span className="text-sm md:text-base font-semibold text-amber-100 bg-black/50 backdrop-blur-md px-4 py-1.5 rounded-full border border-amber-400/30 shadow-[0_0_15px_rgba(245,158,11,0.25)] transition-transform duration-300 group-hover:scale-105 group-hover:border-amber-400/60">
            চাবিটি ছুঁয়ে দাও
          </span>
        </div>
      )}
    </div>
  );
};

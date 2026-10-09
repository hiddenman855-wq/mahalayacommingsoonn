import React, { useState } from 'react';
import { PradipCanvas3D, FlameColorOption } from './PradipCanvas3D';
import { audioController } from '../utils/audio';

interface ChapterThreeDiyaProps {
  onProceed: () => void;
  onBack: () => void;
}

const FLAME_COLORS: FlameColorOption[] = [
  {
    id: 'gold',
    name: 'সোনালি',
    hex: '#f59e0b',
    innerHex: '#ffffff',
    auraHex: '#fbbf24',
  },
  {
    id: 'orange',
    name: 'কমলা',
    hex: '#ea580c',
    innerHex: '#fff7ed',
    auraHex: '#f97316',
  },
  {
    id: 'red',
    name: 'লাল',
    hex: '#dc2626',
    innerHex: '#fef2f2',
    auraHex: '#ef4444',
  },
  {
    id: 'blue',
    name: 'নীল',
    hex: '#0284c7',
    innerHex: '#f0f9ff',
    auraHex: '#38bdf8',
  },
  {
    id: 'purple',
    name: 'বেগুনি',
    hex: '#7e22ce',
    innerHex: '#faf5ff',
    auraHex: '#a855f7',
  },
  {
    id: 'pink',
    name: 'গোলাপি',
    hex: '#db2777',
    innerHex: '#fdf2f8',
    auraHex: '#f472b6',
  },
  {
    id: 'green',
    name: 'সবুজ',
    hex: '#16a34a',
    innerHex: '#f0fdf4',
    auraHex: '#4ade80',
  },
  {
    id: 'white',
    name: 'সাদা',
    hex: '#ffffff',
    innerHex: '#ffffff',
    auraHex: '#cbd5e1',
  },
];

// Helper to calculate light inner core & aura from any user-picked hex
function computeFlameColorFromHex(hex: string): FlameColorOption {
  // Convert hex to rgb
  const r = parseInt(hex.slice(1, 3), 16) || 245;
  const g = parseInt(hex.slice(3, 5), 16) || 158;
  const b = parseInt(hex.slice(5, 7), 16) || 11;

  // Lighter inner core
  const innerR = Math.min(255, Math.round(r * 0.4 + 255 * 0.6));
  const innerG = Math.min(255, Math.round(g * 0.4 + 255 * 0.6));
  const innerB = Math.min(255, Math.round(b * 0.4 + 255 * 0.6));
  const innerHex = `#${innerR.toString(16).padStart(2, '0')}${innerG
    .toString(16)
    .padStart(2, '0')}${innerB.toString(16).padStart(2, '0')}`;

  // Aura bright
  const auraR = Math.min(255, Math.round(r * 0.7 + 255 * 0.3));
  const auraG = Math.min(255, Math.round(g * 0.7 + 255 * 0.3));
  const auraB = Math.min(255, Math.round(b * 0.7 + 255 * 0.3));
  const auraHex = `#${auraR.toString(16).padStart(2, '0')}${auraG
    .toString(16)
    .padStart(2, '0')}${auraB.toString(16).padStart(2, '0')}`;

  return {
    id: 'custom',
    name: 'কাস্টম',
    hex,
    innerHex,
    auraHex,
  };
}

export const ChapterThreeDiya: React.FC<ChapterThreeDiyaProps> = ({ onProceed, onBack }) => {
  const [isLit, setIsLit] = useState(false);
  const [selectedColor, setSelectedColor] = useState<FlameColorOption>(FLAME_COLORS[0]);
  const [customColorHex, setCustomColorHex] = useState('#f59e0b');
  const [flameSize, setFlameSize] = useState(0);

  const handleLightDiya = () => {
    if (isLit) return;
    setIsLit(true);
    audioController.playTempleBellSound();

    // Gradually grow 3D flame from wick
    let currentScale = 0.1;
    const interval = setInterval(() => {
      currentScale += 0.15;
      if (currentScale >= 1) {
        setFlameSize(1);
        clearInterval(interval);
      } else {
        setFlameSize(currentScale);
      }
    }, 50);
  };

  const handleCustomColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hex = e.target.value;
    setCustomColorHex(hex);
    setSelectedColor(computeFlameColorFromHex(hex));
  };

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col items-center justify-between py-10 px-4 overflow-hidden bg-gradient-to-b from-[#130708] via-[#0b0304] to-[#120507]">
      {/* Dynamic 3D Room Ambient Light Spill reacting to flame status and color */}
      <div
        className="absolute inset-0 pointer-events-none transition-all duration-1000 z-0"
        style={{
          background: isLit
            ? `radial-gradient(circle at 50% 60%, ${selectedColor.hex}33 0%, rgba(12, 5, 7, 0.7) 50%, #0c0507 85%)`
            : 'radial-gradient(circle at 50% 55%, rgba(30, 15, 8, 0.4) 0%, #0c0507 70%)',
        }}
      />

      {/* Chapter 3 Header */}
      <div className="relative z-10 text-center max-w-xl mt-2 px-2">
        <span className="text-xs md:text-sm tracking-widest text-amber-400 uppercase font-medium">
          অধ্যায় ৩ · ত্রিমাত্রিক মঙ্গল প্রদীপ
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-bengali text-amber-100 mt-1 drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
          আলোর প্রার্থনা
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-amber-200/80 mt-1 font-light">
          {isLit
            ? 'প্রদীপটি ঘুরিয়ে দেখুন (360°) এবং কালার পিকার দিয়ে নিজের ইচ্ছেমতো শিখার রং বদলে নিন'
            : 'ভক্তিশ্রদ্ধায় ত্রিমাত্রিক প্রদীপ প্রজ্বালন করে মায়ের আগমনকে বরণ করুন'}
        </p>
      </div>

      {/* Center TRUE 3D PRADIP (Three.js WebGL) */}
      <div className="relative z-10 w-full max-w-xl flex flex-col items-center justify-center my-auto">
        <div className="relative w-full h-[360px] sm:h-[420px] md:h-[460px] rounded-3xl overflow-hidden border border-amber-500/20 bg-black/30 backdrop-blur-sm shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
          {/* Subtle drag hint in corner */}
          <div className="absolute top-3 left-4 z-20 pointer-events-none flex items-center gap-1.5 text-[11px] text-amber-300/70 bg-black/50 px-2.5 py-1 rounded-full border border-amber-500/20">
            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <span>মাউস বা স্পর্শে ৩৬০° ঘোরানো যায়</span>
          </div>

          {/* Three.js Interactive 3D Canvas */}
          <PradipCanvas3D
            isLit={isLit}
            color={selectedColor}
            flameSize={flameSize}
          />
        </div>

        {/* Action: Ignite Button if not yet lit */}
        {!isLit ? (
          <div className="mt-5 flex flex-col items-center">
            <button
              onClick={handleLightDiya}
              className="px-8 py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-stone-950 font-bold text-base md:text-lg shadow-[0_0_25px_rgba(245,158,11,0.6)] hover:shadow-[0_0_40px_rgba(249,115,22,0.8)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer flex items-center gap-2 border border-amber-300"
            >
              <span>প্রদীপ জ্বালাও</span>
              <svg className="w-5 h-5 text-stone-950" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.527.82-1.17 2.073-1.6 3.285a18.28 18.28 0 00-1.11 4.5c-.07.6-.112 1.195-.113 1.767a5.5 5.5 0 0010.5 2.4c.046-.2.083-.404.11-.611.16-.957.17-1.93.03-2.905-.28-1.95-1.14-3.76-2.12-5.46-.57-.99-1.2-1.95-1.78-2.82a1 1 0 00-.655-.456l-.1-.01zM10 16a3.5 3.5 0 01-3.5-3.5c0-.437.033-.873.084-1.306.33-2.78 1.94-5.32 3.416-7.194 1.476 1.874 3.086 4.414 3.416 7.194.051.433.084.869.084 1.306A3.5 3.5 0 0110 16z" clipRule="evenodd" />
              </svg>
            </button>
            <span className="text-xs text-amber-300/70 mt-2">
              স্পর্শ করলেই জ্বলবে ত্রিমাত্রিক শিখা
            </span>
          </div>
        ) : (
          /* Realistic 3D Flame Color Customization Palette + Custom Color Picker */
          <div className="mt-4 w-full flex flex-col items-center animate-fade-in">
            {/* Header with Color Picker Input */}
            <div className="flex items-center gap-3 mb-2.5">
              <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold">
                শিখার রং বদলাও:
              </span>

              {/* Interactive Color Picker Component */}
              <label className="relative flex items-center gap-1.5 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500/20 via-purple-500/20 to-rose-500/20 border border-amber-400/50 cursor-pointer hover:border-amber-300 hover:scale-105 transition-all shadow-md">
                <input
                  type="color"
                  value={customColorHex}
                  onChange={handleCustomColorChange}
                  className="absolute inset-0 opacity-0 w-full h-full cursor-pointer"
                  title="যেকোনো কাস্টম রঙ বেছে নিন"
                />
                <span
                  className="w-4 h-4 rounded-full border border-white/60 shadow-sm"
                  style={{ backgroundColor: selectedColor.hex }}
                />
                <span className="text-xs font-bold text-amber-200">
                  কালার পিকার 🎨
                </span>
              </label>
            </div>

            {/* Quick Presets */}
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg px-2">
              {FLAME_COLORS.map((col) => {
                const isSelected = selectedColor.id === col.id;
                return (
                  <button
                    key={col.id}
                    onClick={() => {
                      setSelectedColor(col);
                      setCustomColorHex(col.hex);
                    }}
                    className={`px-2.5 py-1.5 rounded-full text-xs font-semibold flex items-center gap-1.5 transition-all duration-200 cursor-pointer border ${
                      isSelected
                        ? 'bg-amber-100 text-stone-950 scale-105 shadow-md'
                        : 'bg-black/60 text-amber-200 hover:bg-black/80'
                    }`}
                    style={{
                      borderColor: col.hex,
                      boxShadow: isSelected ? `0 0 14px ${col.hex}` : 'none',
                    }}
                  >
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-white/40"
                      style={{ backgroundColor: col.hex }}
                    />
                    <span>{col.name}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
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
          <span>পরের অধ্যায়</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </button>
      </div>
    </div>
  );
};

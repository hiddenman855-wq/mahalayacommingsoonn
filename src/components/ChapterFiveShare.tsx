import React, { useState, useRef } from 'react';
import confetti from 'canvas-confetti';
import { ASSETS } from '../assets/images';

interface ChapterFiveShareProps {
  onRestart: (newName?: string) => void;
  onBack: () => void;
  initialRecipientName?: string;
}

export const ChapterFiveShare: React.FC<ChapterFiveShareProps> = ({
  onRestart,
  onBack,
  initialRecipientName,
}) => {
  const [recipientName, setRecipientName] = useState('');
  const [senderName, setSenderName] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');
  const [generatedName, setGeneratedName] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [copyStatus, setCopyStatus] = useState<string | null>(null);
  const [cardDataUrl, setCardDataUrl] = useState<string | null>(null);
  const [isGeneratingCard, setIsGeneratingCard] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const createDownloadCard = (name: string, sender: string) => {
    setIsGeneratingCard(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1080;
    canvas.height = 1350;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      setIsGeneratingCard(false);
      return;
    }

    // Load background image or rich gradient
    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = ASSETS.durgaFace;

    const drawCard = () => {
      // 1. Deep royal maroon background
      const grad = ctx.createLinearGradient(0, 0, 1080, 1350);
      grad.addColorStop(0, '#1c0508');
      grad.addColorStop(0.4, '#2d090d');
      grad.addColorStop(0.7, '#180407');
      grad.addColorStop(1, '#0c0204');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1080, 1350);

      // 2. Subtle translucent Durga background watermark
      try {
        ctx.save();
        ctx.globalAlpha = 0.22;
        ctx.drawImage(bgImg, 140, 150, 800, 520);
        ctx.restore();
      } catch (e) {
        // Fallback gradient if image not ready
      }

      // 3. Golden Ornate Borders & Filigree
      ctx.save();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 14;
      ctx.strokeRect(40, 40, 1000, 1270);

      ctx.strokeStyle = '#fbbf24';
      ctx.lineWidth = 4;
      ctx.strokeRect(60, 60, 960, 1230);

      // Corner Lotus Flourishes
      const drawCorner = (x: number, y: number) => {
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(x, y, 24, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#fde047';
        ctx.lineWidth = 3;
        ctx.stroke();
      };
      drawCorner(60, 60);
      drawCorner(1020, 60);
      drawCorner(60, 1290);
      drawCorner(1020, 1290);
      ctx.restore();

      // 4. Sacred Symbol & Title
      ctx.textAlign = 'center';
      ctx.fillStyle = '#fef08a';
      ctx.font = 'bold 36px "Noto Serif Bengali", serif';
      ctx.fillText('॥ শ্রী শ্রী দুর্গায়ৈ নমঃ ॥', 540, 140);

      // Main "শুভ মহালয়া" Title with glow
      ctx.shadowColor = 'rgba(250, 204, 21, 0.7)';
      ctx.shadowBlur = 25;
      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 84px "Noto Serif Bengali", serif';
      ctx.fillText('শুভ মহালয়া', 540, 250);
      ctx.shadowBlur = 0;

      ctx.fillStyle = '#fbbf24';
      ctx.font = '600 38px "Hind Siliguri", sans-serif';
      ctx.fillText('মায়ের আগমনী বার্তা ও আশীর্বাদ', 540, 315);

      // Divider Line
      ctx.strokeStyle = '#d97706';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(300, 360);
      ctx.lineTo(780, 360);
      ctx.stroke();

      // 5. Recipient Name Box
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.roundRect(140, 420, 800, 160, 24);
      ctx.fill();
      ctx.strokeStyle = '#f59e0b';
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.fillStyle = '#fde047';
      ctx.font = '500 34px "Hind Siliguri", sans-serif';
      ctx.fillText('স্নেহের ও শ্রদ্ধার প্রিয়', 540, 475);

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 64px "Noto Serif Bengali", serif';
      ctx.fillText(name, 540, 545);

      // 6. Devotional Shloka
      ctx.fillStyle = '#fef3c7';
      ctx.font = 'italic 34px "Noto Serif Bengali", serif';
      ctx.fillText('“যা দেবী সর্বভূতেষু মাতৃরূপেণ সংস্থিতা।', 540, 680);
      ctx.fillText('নমস্তস্যৈ নমস্তস্যৈ নমস্তস্যৈ নমো নমঃ॥”', 540, 735);

      // 7. Personalized Warm Blessing Message
      ctx.fillStyle = '#faedd8';
      ctx.font = '500 36px "Hind Siliguri", sans-serif';
      ctx.fillText('মা দুর্গার পুণ্য আশীর্বাদে তোমার জীবন', 540, 840);
      ctx.fillText('আনন্দ, সুস্বাস্থ্য, শান্তি ও সমৃদ্ধিতে ভরে উঠুক।', 540, 895);
      ctx.fillText('আগামী দুর্গোৎসব কাটুক সকলের সাথে অপরিসীম খুশিতে।', 540, 950);

      // 8. Sender Sign-off
      if (sender.trim()) {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 36px "Noto Serif Bengali", serif';
        ctx.fillText(`— শুভেচ্ছান্তে: ${sender.trim()}`, 540, 1080);
      } else {
        ctx.fillStyle = '#fbbf24';
        ctx.font = 'bold 34px "Noto Serif Bengali", serif';
        ctx.fillText('— শুভ মহালয়ার আন্তরিক প্রীতি ও শুভেচ্ছা', 540, 1080);
      }

      // 9. Bottom Footer Tagline
      ctx.fillStyle = '#a8a29e';
      ctx.font = '400 24px "Hind Siliguri", sans-serif';
      ctx.fillText('মহালয়ার বিশেষ ত্রিমাত্রিক শুভেচ্ছা স্মারক', 540, 1200);

      const url = canvas.toDataURL('image/png');
      setCardDataUrl(url);
      setIsGeneratingCard(false);
    };

    if (bgImg.complete) {
      drawCard();
    } else {
      bgImg.onload = drawCard;
      bgImg.onerror = drawCard;
    }
  };

  const handleGenerateLink = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanName = recipientName.trim();
    if (!cleanName) {
      setErrorMessage('দয়া করে প্রিয়জনের নাম লিখুন');
      return;
    }
    setErrorMessage('');

    // Generate URL-safe shareable link
    const url = new URL(window.location.href);
    url.searchParams.set('to', cleanName);
    if (senderName.trim()) {
      url.searchParams.set('from', senderName.trim());
    } else {
      url.searchParams.delete('from');
    }

    const shareUrl = url.toString();
    setGeneratedLink(shareUrl);
    setGeneratedName(cleanName);

    // Generate downloadable greeting card image
    createDownloadCard(cleanName, senderName);

    // Festive confetti burst
    try {
      confetti({
        particleCount: 55,
        spread: 65,
        origin: { y: 0.6 },
        colors: ['#f59e0b', '#fbbf24', '#ffffff', '#ea580c'],
      });
    } catch {
      // Ignored if canvas not ready
    }
  };

  const handleCopyLink = async () => {
    if (!generatedLink) return;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(generatedLink);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = generatedLink;
        textarea.style.position = 'fixed';
        textarea.style.opacity = '0';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      setCopyStatus('লিংক কপি হয়েছে! প্রিয়জনকে পাঠিয়ে দিন।');
      setTimeout(() => setCopyStatus(null), 3500);
    } catch {
      setCopyStatus('লিংক কপি করতে সমস্যা হয়েছে, দয়া করে ম্যানুয়ালি কপি করুন।');
      setTimeout(() => setCopyStatus(null), 4000);
    }
  };

  const handleShare = async () => {
    if (!generatedLink) return;
    const shareData = {
      title: 'শুভ মহালয়ার শুভেচ্ছা',
      text: `প্রিয় ${generatedName}, তোমাকে জানাই শুভ মহালয়ার আন্তরিক শুভেচ্ছা। মা দুর্গার আশীর্বাদ গ্রহণ করো:`,
      url: generatedLink,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleCopyLink();
        }
      }
    } else {
      handleCopyLink();
    }
  };

  const handleResetForAnother = () => {
    setRecipientName('');
    setSenderName('');
    setGeneratedLink('');
    setGeneratedName('');
    setErrorMessage('');
    setCopyStatus(null);
    setCardDataUrl(null);
  };

  return (
    <div className="relative w-full min-h-screen h-full flex flex-col items-center justify-between py-8 px-4 overflow-hidden bg-gradient-to-b from-[#130608] via-[#090204] to-[#120507]">
      {/* Background Volumetric Glow */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[750px] bg-gradient-radial from-amber-600/15 via-rose-950/15 to-transparent blur-3xl" />
      </div>

      {/* Chapter 5 Header */}
      <div className="relative z-10 text-center max-w-xl mt-1 px-2">
        <span className="text-xs md:text-sm tracking-widest text-amber-400 uppercase font-medium">
          অধ্যায় ৫ · শুভেচ্ছা বার্তা ও কার্ড ডাউনলোড
        </span>
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold font-serif-bengali text-amber-100 mt-1 drop-shadow-[0_4px_20px_rgba(245,158,11,0.5)]">
          আপনার প্রিয়জনকে পাঠান মায়ের আশীর্বাদ
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-amber-200/80 mt-1.5 font-light">
          তাঁর নামে তৈরি করুন ব্যক্তিগত ত্রিমাত্রিক মহালয়ার লিংক ও ডাউনলোড করুন ফটো কার্ড
        </p>
      </div>

      {/* Main Interactive Form & Card Container */}
      <div className="relative z-10 w-full max-w-xl my-auto py-3">
        {!generatedLink ? (
          /* Personalization Form */
          <div className="bg-gradient-to-b from-stone-900/90 via-black/90 to-stone-950/90 p-5 sm:p-7 rounded-3xl border border-amber-500/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] backdrop-blur-md">
            <form onSubmit={handleGenerateLink} className="space-y-4">
              <div>
                <label
                  htmlFor="recipient-input"
                  className="block text-sm sm:text-base font-semibold text-amber-200 mb-2 font-serif-bengali"
                >
                  যাঁকে পাঠাবেন, তাঁর নাম *
                </label>
                <input
                  id="recipient-input"
                  type="text"
                  value={recipientName}
                  onChange={(e) => {
                    setRecipientName(e.target.value);
                    if (errorMessage) setErrorMessage('');
                  }}
                  placeholder="যেমন: অনির্বাণ, শ্রেয়া, মা, বাবা..."
                  className="w-full px-4 py-3 rounded-xl bg-black/60 border border-amber-600/50 text-amber-100 placeholder-stone-500 focus:outline-none focus:border-amber-400 focus:ring-2 focus:ring-amber-400/30 text-base transition-all"
                  autoFocus
                />
                {errorMessage && (
                  <p className="text-rose-400 text-xs sm:text-sm mt-1.5 font-medium">
                    {errorMessage}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="sender-input"
                  className="block text-xs sm:text-sm font-medium text-amber-300/80 mb-1.5"
                >
                  আপনার নাম (ঐচ্ছিক)
                </label>
                <input
                  id="sender-input"
                  type="text"
                  value={senderName}
                  onChange={(e) => setSenderName(e.target.value)}
                  placeholder="যেমন: রাহুল"
                  className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-amber-900/60 text-amber-200 placeholder-stone-600 focus:outline-none focus:border-amber-500 text-sm"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-stone-950 font-bold text-base sm:text-lg shadow-[0_0_25px_rgba(245,158,11,0.5)] hover:shadow-[0_0_35px_rgba(250,204,21,0.8)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 cursor-pointer flex items-center justify-center gap-2 border border-amber-200 mt-4"
              >
                <span>শুভেচ্ছার লিংক তৈরি করো ও কার্ড পাও</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </button>
            </form>
          </div>
        ) : (
          /* Generated Link, Greeting Card Preview & Download */
          <div className="bg-gradient-to-b from-stone-900/95 via-black/95 to-stone-950/95 p-5 sm:p-7 rounded-3xl border-2 border-amber-400/60 shadow-[0_20px_50px_rgba(0,0,0,0.9),0_0_30px_rgba(245,158,11,0.3)] backdrop-blur-md animate-fade-in space-y-4">
            {/* Bengali Greeting Card Preview */}
            <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-amber-950/40 via-amber-900/20 to-amber-950/40 border border-amber-500/30 text-center">
              <span className="text-xs uppercase tracking-widest text-amber-400 font-semibold">
                শুভেচ্ছা বার্তার নমুনা
              </span>
              <p className="text-base sm:text-lg font-serif-bengali text-amber-100 mt-2 leading-relaxed">
                “প্রিয় <span className="text-yellow-400 font-bold">{generatedName}</span>, তোমাকে জানাই শুভ মহালয়ার আন্তরিক শুভেচ্ছা। মা দুর্গা তোমার জীবন আনন্দ, শান্তি ও আশীর্বাদে ভরিয়ে দিন।”
              </p>
              {senderName.trim() && (
                <p className="text-xs sm:text-sm text-amber-300/80 mt-1.5 italic">
                  — শুভেচ্ছান্তে: {senderName.trim()}
                </p>
              )}
            </div>

            {/* Generated Shareable Link Field */}
            <div>
              <label className="block text-xs uppercase tracking-wider text-amber-400 font-bold mb-1">
                আপনার তৈরি করা শুভেচ্ছা লিংক:
              </label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={generatedLink}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-black/70 border border-amber-700/60 text-xs sm:text-sm text-amber-200 select-all font-mono truncate"
                />
              </div>
            </div>

            {/* Success / Copy Toast Feedback */}
            {copyStatus && (
              <div className="p-2 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs sm:text-sm text-center font-medium animate-fade-in">
                {copyStatus}
              </div>
            )}

            {/* Action Buttons: Copy, Share, Download Card */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <button
                onClick={handleCopyLink}
                className="py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-500 to-yellow-500 text-stone-950 font-bold text-xs sm:text-sm hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                </svg>
                <span>লিংক কপি করো</span>
              </button>

              <button
                onClick={handleShare}
                className="py-2.5 px-3 rounded-xl bg-stone-800 border border-amber-500/40 text-amber-200 hover:text-white hover:bg-stone-700 hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer flex items-center justify-center gap-2 font-bold text-xs sm:text-sm shadow-md"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                </svg>
                <span>শেয়ার করো</span>
              </button>
            </div>

            {/* DOWNLOAD GREETING CARD SECTION */}
            {cardDataUrl && (
              <div className="pt-2 border-t border-amber-800/40 flex flex-col items-center">
                <a
                  href={cardDataUrl}
                  download={`subho_mahalaya_${generatedName || 'greeting'}.png`}
                  className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-rose-700 via-amber-600 to-amber-500 text-white font-bold text-sm sm:text-base flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(244,63,94,0.4)] hover:shadow-[0_0_30px_rgba(245,158,11,0.6)] hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer border border-amber-300"
                >
                  <svg className="w-5 h-5 text-yellow-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  <span>{generatedName}-এর নামে মহালয়ার ফটো কার্ড ডাউনলোড করো 📥</span>
                </a>
                <span className="text-[11px] text-amber-300/80 mt-1">
                  এইচডি কোয়ালিটির শুভ মহালয়া গ্রিটিংস ইমেজ
                </span>
              </div>
            )}

            {/* Restart Experience with this name or Create Another Link */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 border-t border-amber-900/40 text-xs">
              <button
                onClick={handleResetForAnother}
                className="text-amber-400 hover:text-amber-200 underline underline-offset-4 cursor-pointer"
              >
                + অন্য কারও জন্য লিংক ও কার্ড তৈরি করো
              </button>

              <button
                onClick={() => onRestart(generatedName)}
                className="text-amber-300 hover:text-white bg-amber-950/60 hover:bg-amber-900/60 px-3 py-1.5 rounded-lg border border-amber-600/30 transition-colors cursor-pointer"
              >
                এই নামে শুরু থেকে দেখুন →
              </button>
            </div>
          </div>
        )}

        {/* PROMOTIONAL & COMING SOON BUTTONS (Requested by user) */}
        <div className="mt-5 w-full flex flex-col sm:flex-row items-center justify-center gap-3">
          {/* 1. Durga Puja Website Coming Soon Button */}
          <a
            href="https://jhingalalahuhuhuhu.vercel.app"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full sm:w-auto px-5 py-2.5 rounded-full bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-[0_0_18px_rgba(245,158,11,0.4)] hover:shadow-[0_0_28px_rgba(250,204,21,0.7)] hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-200"
          >
            <span className="text-base">🪔</span>
            <span>দুর্গাপূজা ওয়েবসাইট শীঘ্রই আসছে (Coming Soon)</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
            </svg>
          </a>

          {/* 2. Compact WhatsApp Buy Special Website Mini Button */}
          <a
            href="https://wa.me/918250560656?text=%E0%A6%A8%E0%A6%AE%E0%A6%B8%E0%A7%8D%E0%A6%95%E0%A6%BE%E0%A6%B0%2C%20%E0%A6%86%E0%A6%AE%E0%A6%BF%20%E0%A6%8F%E0%A6%95%E0%A6%9F%E0%A6%BF%20%E0%A6%B8%E0%A7%8D%E0%A6%AA%E0%A7%87%E0%A6%B6%E0%A6%BE%E0%A6%B2%20%E0%A6%A6%E0%A7%81%E0%A6%B0%E0%A7%8D%E0%A6%97%E0%A6%BE%E0%A6%AA%E0%A7%82%E0%A6%9C%E0%A6%BE%20%2F%20%E0%A6%AE%E0%A6%B9%E0%A6%BE%E0%A6%B2%E0%A6%AF%E0%A6%BC%E0%A6%BE%20%E0%A6%93%E0%A6%AF%E0%A6%BC%E0%A7%87%E0%A6%AC%E0%A6%B8%E0%A6%BE%E0%A6%87%E0%A6%9F%20%E0%A6%A4%E0%A7%88%E0%A6%B0%E0%A6%BF%20%E0%A6%95%E0%A6%B0%E0%A6%BE%E0%A6%A4%E0%A7%87%20%E0%A6%9A%E0%A6%BE%E0%A6%87%E0%A7%84"
            target="_blank"
            rel="noopener noreferrer"
            title="স্পেশাল ওয়েবসাইট অর্ডার করতে হোয়াটসঅ্যাপে যোগাযোগ করুন"
            className="w-full sm:w-auto px-3.5 py-1.5 rounded-full bg-emerald-950/80 hover:bg-emerald-900 border border-emerald-500/50 text-emerald-200 hover:text-white text-[11px] sm:text-xs font-semibold flex items-center justify-center gap-1.5 shadow transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            {/* WhatsApp Icon */}
            <svg className="w-3.5 h-3.5 fill-emerald-400" viewBox="0 0 24 24">
              <path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.582 2.128 2.182-.573c.978.58 1.911.928 3.145.929 3.178 0 5.767-2.587 5.768-5.766.001-3.187-2.575-5.771-5.764-5.771zm3.392 8.244c-.144.405-.837.774-1.17.824-.299.045-.677.063-1.092-.069-.252-.08-.575-.187-.988-.365-1.739-.751-2.874-2.502-2.961-2.617-.087-.116-.708-.94-.708-1.793s.448-1.273.607-1.446c.159-.173.346-.217.462-.217l.332.006c.106.005.249-.04.39.298.144.347.491 1.2.534 1.287.043.087.072.188.014.304-.058.116-.087.188-.173.289l-.26.304c-.087.086-.177.18-.076.354.101.174.449.741.964 1.201.662.591 1.221.774 1.394.86.173.086.275.072.376-.044.101-.116.433-.506.549-.68.116-.173.231-.145.39-.087s1.011.477 1.184.564.289.13.332.202c.043.073.043.419-.101.824z" />
            </svg>
            <span>Buy Special Website (WhatsApp: 8250560656)</span>
          </a>
        </div>
      </div>

      {/* Navigation Controls: Back to Gallery or Home */}
      <div className="relative z-10 flex items-center gap-4 mt-2 mb-3">
        <button
          onClick={onBack}
          className="px-5 py-2.5 rounded-full bg-stone-900/80 border border-amber-500/30 text-amber-200 hover:text-white hover:bg-stone-800 transition-all text-sm font-medium cursor-pointer"
        >
          পূর্বের অধ্যায়
        </button>

        <button
          onClick={() => onRestart()}
          className="px-6 py-2.5 rounded-full bg-amber-950/70 border border-amber-500/40 text-amber-200 hover:text-white hover:bg-amber-900/80 transition-all text-sm font-medium cursor-pointer flex items-center gap-1.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
          <span>শুরুতে ফিরে চলো</span>
        </button>
      </div>
    </div>
  );
};

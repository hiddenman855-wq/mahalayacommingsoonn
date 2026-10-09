import React, { useEffect, useRef, useState } from 'react';
import { audioController } from '../utils/audio';

declare global {
  interface Window {
    onYouTubeIframeAPIReady?: () => void;
    YT?: any;
  }
}

export const YouTubeBackgroundMusic: React.FC = () => {
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [audioState, setAudioState] = useState({ isPlaying: false, isMuted: false });

  useEffect(() => {
    const unsubscribe = audioController.subscribe((st) => {
      setAudioState(st);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const iframe = iframeRef.current;
    if (!iframe) return;

    audioController.registerIFrame(iframe);

    // Load YouTube API script immediately
    if (!window.YT) {
      const tag = document.createElement('script');
      tag.src = 'https://www.youtube.com/iframe_api';
      const firstScriptTag = document.getElementsByTagName('script')[0];
      firstScriptTag?.parentNode?.insertBefore(tag, firstScriptTag);
    }

    const initPlayer = () => {
      if (window.YT && window.YT.Player && iframe) {
        try {
          const player = new window.YT.Player(iframe, {
            events: {
              onReady: (event: any) => {
                audioController.registerIFrame(iframe, event.target);
                // Pre-warm the buffer at 17s
                event.target.seekTo(17, true);
                // If user hasn't unlocked yet, keep it cued
                if (!audioController.getIsPlaying()) {
                  event.target.pauseVideo();
                } else {
                  event.target.unMute();
                  event.target.setVolume(90);
                  event.target.playVideo();
                }
              },
              onStateChange: (event: any) => {
                if (event.data === 0) {
                  // Loop track if completed
                  event.target.seekTo(17, true);
                  event.target.playVideo();
                } else if (event.data === 1 && !audioController.getIsPlaying()) {
                  // Pre-buffering complete, hold at 17s until user key press
                  event.target.pauseVideo();
                  event.target.seekTo(17, true);
                }
              },
            },
          });
        } catch (e) {
          console.warn('YT Player init notice:', e);
        }
      }
    };

    if (window.YT && window.YT.Player) {
      initPlayer();
    } else {
      const prev = window.onYouTubeIframeAPIReady;
      window.onYouTubeIframeAPIReady = () => {
        if (prev) prev();
        initPlayer();
      };
    }
  }, []);

  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  // Notice: autoplay=1&mute=1 pre-loads and warms the buffer at 17s immediately on page mount!
  const embedUrl = `https://www.youtube.com/embed/8FytVk54-dw?enablejsapi=1&autoplay=1&mute=1&start=17&origin=${encodeURIComponent(
    origin
  )}&playsinline=1&controls=0&rel=0&iv_load_policy=3`;

  return (
    <>
      {/* Floating Active Mini Audio Bar (Bottom-Left) */}
      {audioState.isPlaying && (
        <div className="fixed bottom-3 left-3 z-40 flex items-center gap-2 bg-stone-950/90 border border-amber-500/40 rounded-full px-3 py-1.5 backdrop-blur-md shadow-[0_4px_20px_rgba(0,0,0,0.8)] animate-fade-in select-none">
          {/* Animated Dancing Equalizer Bars */}
          <div className="flex items-end gap-0.5 h-3.5 w-3.5">
            <span
              className={`w-1 bg-amber-400 rounded-full transition-all ${
                audioState.isPlaying && !audioState.isMuted
                  ? 'h-3.5 animate-pulse'
                  : 'h-1'
              }`}
            />
            <span
              className={`w-1 bg-amber-300 rounded-full transition-all ${
                audioState.isPlaying && !audioState.isMuted
                  ? 'h-2 animate-bounce'
                  : 'h-1.5'
              }`}
            />
            <span
              className={`w-1 bg-amber-500 rounded-full transition-all ${
                audioState.isPlaying && !audioState.isMuted
                  ? 'h-3 animate-pulse'
                  : 'h-1'
              }`}
            />
          </div>

          <span className="text-[11px] sm:text-xs font-semibold text-amber-200">
            মহালয়া আগমনী গান
          </span>

          {/* Toggle Play / Pause */}
          <button
            onClick={() => audioController.togglePlay()}
            className="w-6 h-6 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 flex items-center justify-center cursor-pointer transition-colors"
            title={audioState.isPlaying ? 'গান থামান' : 'গান চালান'}
          >
            {audioState.isPlaying ? (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
              </svg>
            ) : (
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
          </button>

          {/* Toggle Mute / Unmute */}
          <button
            onClick={() => audioController.toggleMute()}
            className="w-6 h-6 rounded-full bg-amber-500/20 hover:bg-amber-500/40 text-amber-200 flex items-center justify-center cursor-pointer transition-colors"
            title={audioState.isMuted ? 'শব্দ চালু করুন' : 'শব্দ বন্ধ করুন'}
          >
            {audioState.isMuted ? (
              <svg className="w-3 h-3 text-rose-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
              </svg>
            ) : (
              <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              </svg>
            )}
          </button>
        </div>
      )}

      {/* Rendered YouTube IFrame Container */}
      <div
        aria-hidden="true"
        className="fixed bottom-0 right-0 w-[260px] h-[150px] pointer-events-none overflow-hidden z-[-50] opacity-[0.01]"
      >
        <iframe
          ref={iframeRef}
          id="mahalaya-yt-player"
          title="মহালয়া আবহ সঙ্গীত"
          src={embedUrl}
          allow="autoplay; encrypted-media; accelerometer; clipboard-write; gyroscope; picture-in-picture"
          className="w-full h-full border-0 pointer-events-none"
        />
      </div>
    </>
  );
};

/**
 * Ultra-Low-Latency Audio Controller for Shubho Mahalaya
 * Video: https://youtu.be/8FytVk54-dw
 * Start time: exactly 17 seconds
 */

class AudioController {
  private iframeRef: HTMLIFrameElement | null = null;
  private ytPlayer: any = null;
  private isPlaying = false;
  private isMuted = false;
  private hasInitialSeekHappened = false;
  private isPreWarmed = false;
  private listeners: Set<(state: { isPlaying: boolean; isMuted: boolean }) => void> = new Set();
  private audioCtx: AudioContext | null = null;
  private watchdogInterval: any = null;

  constructor() {
    this.startWatchdog();
  }

  public getIsPlaying() {
    return this.isPlaying;
  }

  public subscribe(fn: (state: { isPlaying: boolean; isMuted: boolean }) => void) {
    this.listeners.add(fn);
    fn({ isPlaying: this.isPlaying, isMuted: this.isMuted });
    return () => {
      this.listeners.delete(fn);
    };
  }

  private notify() {
    this.listeners.forEach((fn) => fn({ isPlaying: this.isPlaying, isMuted: this.isMuted }));
  }

  public registerIFrame(iframe: HTMLIFrameElement, playerInstance?: any) {
    this.iframeRef = iframe;
    if (playerInstance) {
      this.ytPlayer = playerInstance;

      try {
        if (typeof playerInstance.addEventListener === 'function') {
          playerInstance.addEventListener('onStateChange', (event: any) => {
            // State: 1 = playing, 2 = paused, 0 = ended
            if (event.data === 1) {
              if (this.isPlaying) {
                this.notify();
              }
            } else if (event.data === 0) {
              // Loop track
              playerInstance.seekTo(17, true);
              playerInstance.playVideo();
            } else if (event.data === 2 && this.isPlaying) {
              // Auto-resume if unexpectedly paused
              setTimeout(() => {
                if (this.isPlaying && this.ytPlayer) {
                  this.ytPlayer.playVideo();
                }
              }, 250);
            }
          });
        }
      } catch (e) {
        console.warn('Player event listener notice:', e);
      }
    }
  }

  private getAudioContext(): AudioContext {
    if (!this.audioCtx) {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      this.audioCtx = new AudioCtx();
    }
    if (this.audioCtx.state === 'suspended') {
      this.audioCtx.resume();
    }
    return this.audioCtx;
  }

  private startWatchdog() {
    if (typeof window === 'undefined') return;
    this.watchdogInterval = setInterval(() => {
      if (this.isPlaying && !this.isMuted) {
        if (this.ytPlayer && typeof this.ytPlayer.getPlayerState === 'function') {
          try {
            const state = this.ytPlayer.getPlayerState();
            if (state === 2 || state === 5) {
              this.ytPlayer.playVideo();
            }
          } catch {
            // Ignore cross-origin transient warnings
          }
        }
      }
    }, 1500);
  }

  /**
   * Starts background music instantly with zero latency
   * Called synchronously on user's golden key touch gesture
   */
  public startMusic() {
    this.isPlaying = true;
    this.isMuted = false;
    this.notify();

    // 1. Immediately unlock browser audio context
    this.getAudioContext();

    // 2. Instant un-mute & play on pre-warmed buffer
    if (this.ytPlayer) {
      try {
        if (typeof this.ytPlayer.unMute === 'function') this.ytPlayer.unMute();
        if (typeof this.ytPlayer.setVolume === 'function') this.ytPlayer.setVolume(90);
        if (!this.hasInitialSeekHappened && typeof this.ytPlayer.seekTo === 'function') {
          this.ytPlayer.seekTo(17, true);
          this.hasInitialSeekHappened = true;
        }
        if (typeof this.ytPlayer.playVideo === 'function') this.ytPlayer.playVideo();
      } catch (e) {
        console.warn('YT player instant play notice:', e);
      }
    }

    // 3. Parallel zero-latency postMessage commands
    this.sendCommand('unMute');
    this.sendCommand('setVolume', [90]);
    if (!this.hasInitialSeekHappened) {
      this.sendCommand('seekTo', [17, true]);
      this.hasInitialSeekHappened = true;
    }
    this.sendCommand('playVideo');
  }

  public resumeMusic() {
    this.isPlaying = true;
    this.notify();

    if (this.ytPlayer) {
      try {
        if (typeof this.ytPlayer.unMute === 'function') this.ytPlayer.unMute();
        if (typeof this.ytPlayer.setVolume === 'function') this.ytPlayer.setVolume(90);
        if (typeof this.ytPlayer.playVideo === 'function') this.ytPlayer.playVideo();
      } catch (e) {
        console.warn('YT playVideo notice:', e);
      }
    }

    this.sendCommand('unMute');
    this.sendCommand('setVolume', [90]);
    this.sendCommand('playVideo');
  }

  public pauseMusic() {
    this.isPlaying = false;
    this.notify();

    if (this.ytPlayer && typeof this.ytPlayer.pauseVideo === 'function') {
      try {
        this.ytPlayer.pauseVideo();
      } catch (e) {
        console.warn('YT pause notice:', e);
      }
    }
    this.sendCommand('pauseVideo');
  }

  public togglePlay() {
    if (this.isPlaying) {
      this.pauseMusic();
    } else {
      this.resumeMusic();
    }
  }

  private sendCommand(func: string, args: any[] = []) {
    if (!this.iframeRef || !this.iframeRef.contentWindow) return;
    try {
      this.iframeRef.contentWindow.postMessage(
        JSON.stringify({
          event: 'command',
          func,
          args,
        }),
        '*'
      );
    } catch (e) {
      console.warn('postMessage error:', e);
    }
  }

  public toggleMute() {
    this.isMuted = !this.isMuted;
    if (this.isMuted) {
      this.sendCommand('mute');
      if (this.ytPlayer && typeof this.ytPlayer.mute === 'function') {
        this.ytPlayer.mute();
      }
    } else {
      this.sendCommand('unMute');
      this.sendCommand('setVolume', [90]);
      if (this.ytPlayer && typeof this.ytPlayer.unMute === 'function') {
        this.ytPlayer.unMute();
      }
    }
    this.notify();
  }

  /**
   * Synthesize realistic antique brass lock unlocking sound using Web Audio API
   */
  public playLockSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Key insertion rattle
      const noiseBuffer = ctx.createBuffer(1, ctx.sampleRate * 0.15, ctx.sampleRate);
      const output = noiseBuffer.getChannelData(0);
      for (let i = 0; i < noiseBuffer.length; i++) {
        output[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ctx.sampleRate * 0.05));
      }
      const noise = ctx.createBufferSource();
      noise.buffer = noiseBuffer;
      const noiseFilter = ctx.createBiquadFilter();
      noiseFilter.type = 'bandpass';
      noiseFilter.frequency.setValueAtTime(3200, now);
      noiseFilter.Q.setValueAtTime(3, now);
      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.25, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
      noise.connect(noiseFilter);
      noiseFilter.connect(noiseGain);
      noiseGain.connect(ctx.destination);
      noise.start(now);

      // Brass Tumbler Clicks
      [0.08, 0.14, 0.22].forEach((offset, idx) => {
        const clickOsc = ctx.createOscillator();
        const clickGain = ctx.createGain();
        clickOsc.type = 'triangle';
        clickOsc.frequency.setValueAtTime(1400 + idx * 300, now + offset);
        clickOsc.frequency.exponentialRampToValueAtTime(400, now + offset + 0.06);

        clickGain.gain.setValueAtTime(0.35, now + offset);
        clickGain.gain.exponentialRampToValueAtTime(0.001, now + offset + 0.06);

        clickOsc.connect(clickGain);
        clickGain.connect(ctx.destination);
        clickOsc.start(now + offset);
        clickOsc.stop(now + offset + 0.06);
      });

      // Heavy Iron Bolt sliding
      const boltOsc = ctx.createOscillator();
      const boltGain = ctx.createGain();
      boltOsc.type = 'sine';
      boltOsc.frequency.setValueAtTime(220, now + 0.25);
      boltOsc.frequency.exponentialRampToValueAtTime(110, now + 0.7);

      boltGain.gain.setValueAtTime(0.4, now + 0.25);
      boltGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

      boltOsc.connect(boltGain);
      boltGain.connect(ctx.destination);
      boltOsc.start(now + 0.25);
      boltOsc.stop(now + 0.7);

      // Antique Door Creak
      const creakOsc = ctx.createOscillator();
      const creakGain = ctx.createGain();
      creakOsc.type = 'sawtooth';
      creakOsc.frequency.setValueAtTime(160, now + 0.35);
      creakOsc.frequency.linearRampToValueAtTime(280, now + 0.7);
      creakOsc.frequency.linearRampToValueAtTime(140, now + 1.1);

      const creakFilter = ctx.createBiquadFilter();
      creakFilter.type = 'lowpass';
      creakFilter.frequency.setValueAtTime(600, now + 0.35);

      creakGain.gain.setValueAtTime(0.001, now + 0.35);
      creakGain.gain.linearRampToValueAtTime(0.12, now + 0.6);
      creakGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      creakOsc.connect(creakFilter);
      creakFilter.connect(creakGain);
      creakGain.connect(ctx.destination);
      creakOsc.start(now + 0.35);
      creakOsc.stop(now + 1.2);
    } catch (e) {
      console.warn('Audio synthesis notice:', e);
    }
  }

  /**
   * Sacred Shankha (শঙ্খধ্বনি) & Temple Bell instant chime on key touch
   */
  public playTempleBellSound() {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      // Pure bell harmonic frequencies
      const freqs = [587.33, 1174.66, 1760.0, 2349.32];
      const gains = [0.25, 0.15, 0.08, 0.04];

      freqs.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now);

        gain.gain.setValueAtTime(gains[i], now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);

        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 2.5);
      });
    } catch (e) {
      console.warn('Bell synthesis notice:', e);
    }
  }

  /**
   * Synthesize single authentic Bengali Dhak beat
   */
  public playSingleDhakBeat(isHeavy = true) {
    try {
      const ctx = this.getAudioContext();
      const now = ctx.currentTime;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(isHeavy ? 155 : 190, now);
      osc.frequency.exponentialRampToValueAtTime(65, now + (isHeavy ? 0.28 : 0.18));

      gain.gain.setValueAtTime(isHeavy ? 0.45 : 0.28, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + (isHeavy ? 0.28 : 0.18));

      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + (isHeavy ? 0.28 : 0.18));

      const stickOsc = ctx.createOscillator();
      const stickGain = ctx.createGain();
      stickOsc.type = 'triangle';
      stickOsc.frequency.setValueAtTime(1200, now);
      stickOsc.frequency.exponentialRampToValueAtTime(300, now + 0.04);

      stickGain.gain.setValueAtTime(0.3, now);
      stickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      stickOsc.connect(stickGain);
      stickGain.connect(ctx.destination);
      stickOsc.start(now);
      stickOsc.stop(now + 0.04);
    } catch (e) {
      console.warn('Dhak sound notice:', e);
    }
  }

  // Rhythmic festive Dhak loop state
  private dhakInterval: any = null;
  private isDhakActive = false;

  public toggleDhakLoop(onStateChange?: (active: boolean) => void) {
    if (this.isDhakActive) {
      clearInterval(this.dhakInterval);
      this.isDhakActive = false;
      if (onStateChange) onStateChange(false);
      return false;
    } else {
      this.isDhakActive = true;
      let step = 0;
      const pattern = [true, false, true, false, true, true, false, true];

      this.dhakInterval = setInterval(() => {
        const isHeavy = pattern[step % pattern.length];
        this.playSingleDhakBeat(isHeavy);
        step++;
      }, 220);

      if (onStateChange) onStateChange(true);
      return true;
    }
  }

  public stopDhakLoop() {
    if (this.isDhakActive) {
      clearInterval(this.dhakInterval);
      this.isDhakActive = false;
    }
  }
}

export const audioController = new AudioController();

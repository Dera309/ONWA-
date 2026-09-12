"use client";

import { useState, useEffect, useRef } from "react";

interface AmbientAudioPlayerProps {
  audioUrl?: string | null;
  title?: string;
  className?: string;
  variant?: "compact" | "banner" | "floating";
}

export function AmbientAudioPlayer({
  audioUrl,
  title = "African Lunar Ambient Soundscape",
  className = "",
  variant = "banner",
}: AmbientAudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.4);
  const [isMuted, setIsMuted] = useState(false);
  const [mode, setMode] = useState<"file" | "synth">("file");

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainNodeRef = useRef<GainNode | null>(null);
  const oscillatorsRef = useRef<OscillatorNode[]>([]);
  const intervalRef = useRef<any>(null);

  useEffect(() => {
    if (audioUrl) {
      setMode("file");
    } else {
      setMode("synth");
    }
  }, [audioUrl]);

  // Clean up Web Audio / HTMLAudio on unmount
  useEffect(() => {
    return () => {
      stopSynth();
      if (audioRef.current) {
        audioRef.current.pause();
      }
    };
  }, []);

  // Web Audio Procedural Lunar Drone Synthesizer
  const startSynth = () => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;

      if (!audioCtxRef.current || audioCtxRef.current.state === "closed") {
        audioCtxRef.current = new AudioCtx();
      }

      const ctx = audioCtxRef.current;
      if (ctx.state === "suspended") {
        ctx.resume();
      }

      const masterGain = ctx.createGain();
      const currentVol = isMuted ? 0 : volume;
      masterGain.gain.setValueAtTime(0.001, ctx.currentTime);
      masterGain.gain.exponentialRampToValueAtTime(Math.max(0.001, currentVol * 0.15), ctx.currentTime + 2);
      masterGain.connect(ctx.destination);
      gainNodeRef.current = masterGain;

      // Deep harmonic frequencies (A minor / African pentatonic fundamental: 110Hz, 164.8Hz, 220Hz, 329.6Hz)
      const freqs = [55, 110, 164.81, 220, 329.63];
      const oscs: OscillatorNode[] = [];

      freqs.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const filter = ctx.createBiquadFilter();
        const oscGain = ctx.createGain();

        osc.type = idx % 2 === 0 ? "sine" : "triangle";
        osc.frequency.setValueAtTime(freq, ctx.currentTime);

        // Low-pass filter for smooth lunar warmth
        filter.type = "lowpass";
        filter.frequency.setValueAtTime(450 + idx * 80, ctx.currentTime);

        // Subtle LFO modulation
        const lfo = ctx.createOscillator();
        const lfoGain = ctx.createGain();
        lfo.frequency.value = 0.1 + idx * 0.05;
        lfoGain.gain.value = 1.5;
        lfo.connect(osc.frequency);
        lfo.start();

        oscGain.gain.value = 1 / (idx + 1.8);

        osc.connect(filter);
        filter.connect(oscGain);
        oscGain.connect(masterGain);
        osc.start();
        oscs.push(osc);
      });

      oscillatorsRef.current = oscs;
    } catch (e) {
      console.error("[AmbientSynth] Error starting procedural audio:", e);
    }
  };

  const stopSynth = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    if (gainNodeRef.current && audioCtxRef.current) {
      try {
        const ctx = audioCtxRef.current;
        gainNodeRef.current.gain.setValueAtTime(gainNodeRef.current.gain.value, ctx.currentTime);
        gainNodeRef.current.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.8);
      } catch {}
    }
    setTimeout(() => {
      oscillatorsRef.current.forEach((osc) => {
        try {
          osc.stop();
          osc.disconnect();
        } catch {}
      });
      oscillatorsRef.current = [];
    }, 900);
  };

  const togglePlay = async () => {
    if (isPlaying) {
      if (mode === "file" && audioRef.current) {
        audioRef.current.pause();
      } else {
        stopSynth();
      }
      setIsPlaying(false);
    } else {
      if (mode === "file" && audioUrl) {
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl);
          audioRef.current.loop = true;
        }
        audioRef.current.volume = isMuted ? 0 : volume;
        try {
          await audioRef.current.play();
          setIsPlaying(true);
        } catch (err) {
          console.warn("[AmbientAudio] File playback failed, falling back to ambient synth:", err);
          setMode("synth");
          startSynth();
          setIsPlaying(true);
        }
      } else {
        startSynth();
        setIsPlaying(true);
      }
    }
  };

  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    if (isMuted) setIsMuted(false);
    if (mode === "file" && audioRef.current) {
      audioRef.current.volume = newVol;
    }
    if (mode === "synth" && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        Math.max(0.001, newVol * 0.15),
        audioCtxRef.current.currentTime
      );
    }
  };

  const toggleMute = () => {
    const nextMute = !isMuted;
    setIsMuted(nextMute);
    if (mode === "file" && audioRef.current) {
      audioRef.current.volume = nextMute ? 0 : volume;
    }
    if (mode === "synth" && gainNodeRef.current && audioCtxRef.current) {
      gainNodeRef.current.gain.setValueAtTime(
        nextMute ? 0.0001 : Math.max(0.001, volume * 0.15),
        audioCtxRef.current.currentTime
      );
    }
  };

  if (variant === "floating") {
    return (
      <div className={`fixed bottom-8 right-8 z-50 flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-primary/30 p-2.5 rounded-full shadow-2xl transition-all ${className}`}>
        <button
          onClick={togglePlay}
          className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
            isPlaying
              ? "bg-primary text-black shadow-[0_0_20px_rgba(220,220,224,0.4)]"
              : "border border-primary/40 text-primary hover:border-primary"
          }`}
          title={isPlaying ? "Pause Ambient Sound" : "Play Ambient Sound"}
        >
          {isPlaying ? (
            <span className="text-sm font-bold">⏸</span>
          ) : (
            <span className="text-lg">🔊</span>
          )}
        </button>

        {isPlaying && (
          <div className="flex items-center gap-3 pr-3 animate-in-fade">
            <div className="flex items-center gap-1 h-4">
              <span className="w-1 bg-primary animate-pulse h-3 rounded-full" />
              <span className="w-1 bg-primary/80 animate-pulse delay-75 h-4 rounded-full" />
              <span className="w-1 bg-primary/60 animate-pulse delay-150 h-2 rounded-full" />
            </div>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-16 h-1 bg-white/20 rounded-lg appearance-none cursor-pointer accent-primary"
            />
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`artwork-mat p-4 sm:p-5 border border-primary/20 bg-background/60 backdrop-blur-md rounded ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={togglePlay}
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-all flex-shrink-0 ${
              isPlaying
                ? "bg-primary text-black shadow-[0_0_15px_rgba(220,220,224,0.3)]"
                : "border border-primary/50 text-primary hover:bg-primary hover:text-black"
            }`}
          >
            {isPlaying ? (
              <span className="text-sm font-bold">⏸</span>
            ) : (
              <span className="text-base font-bold ml-0.5">▶</span>
            )}
          </button>

          <div>
            <div className="flex items-center gap-2">
              <p className="label-caps text-xs text-primary font-medium">Ambient Atmosphere</p>
              {isPlaying && (
                <span className="inline-flex items-center gap-1 text-[10px] text-green-400 font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-ping" />
                  Playing
                </span>
              )}
            </div>
            <p className="text-xs text-muted-foreground truncate max-w-[220px] sm:max-w-xs">
              {title}
            </p>
          </div>
        </div>

        {/* Audio Wave & Controls */}
        <div className="flex items-center gap-4 justify-between sm:justify-end">
          {isPlaying && (
            <div className="flex items-end gap-1 h-5 px-2">
              <span className="w-1 bg-primary rounded-full animate-[bounce_0.8s_ease-in-out_infinite]" style={{ height: "60%" }} />
              <span className="w-1 bg-primary/90 rounded-full animate-[bounce_1.2s_ease-in-out_infinite]" style={{ height: "100%" }} />
              <span className="w-1 bg-primary/70 rounded-full animate-[bounce_0.6s_ease-in-out_infinite]" style={{ height: "40%" }} />
              <span className="w-1 bg-primary/80 rounded-full animate-[bounce_1s_ease-in-out_infinite]" style={{ height: "80%" }} />
            </div>
          )}

          <div className="flex items-center gap-2">
            <button
              onClick={toggleMute}
              className="text-xs text-muted-foreground hover:text-primary transition-colors p-1"
            >
              {isMuted || volume === 0 ? "🔇" : "🔉"}
            </button>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={isMuted ? 0 : volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 bg-white/20 rounded appearance-none cursor-pointer accent-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
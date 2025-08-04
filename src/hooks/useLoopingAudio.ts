import { useEffect, useRef, useState } from 'react';

/**
 * useLoopingAudio: Like useAudio, but loops and exposes play/pause/stop controls.
 */
export function useLoopingAudio(src: string, volume: number, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audio.loop = true;
    audioRef.current = audio;
    return () => {
      audio.pause();
      audioRef.current = null;
    };
  }, [src]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = !enabled;
  }, [volume, enabled]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      setError(null);
      await audio.play();
    } catch (e: unknown) {
      console.warn('Looping audio playback failed:', e);
      setError('Unable to play looping audio (it may be blocked by the browser)');
    }
  };

  const pause = () => {
    audioRef.current?.pause();
  };

  const stop = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  return { play, pause, stop, audioRef, error };
}

import { useEffect, useRef } from 'react';

/**
 * Hook for loading and playing audio.
 * When enabled is false the audio element is muted.
 */
export function useAudio(src: string, volume: number, enabled: boolean) {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = new Audio(src);
    audio.preload = 'auto';
    audioRef.current = audio;
    return () => {
      audio.pause();
      audio.currentTime = 0;
      audioRef.current = null;
    };
  }, [src]);

  // Update volume and muted state when props change
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.volume = volume / 100;
    audioRef.current.muted = !enabled;
  }, [volume, enabled]);

  const play = async () => {
    const audio = audioRef.current;
    if (!audio) return;
    try {
      audio.currentTime = 0;
      await audio.play();
    } catch {
      // swallow error (e.g. autoplay restrictions)
    }
  };

  return { play };
}

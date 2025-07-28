import { useLoopingAudio } from '../hooks/useLoopingAudio';
import lofiMusic from '../assets/sounds/chill-lofi-hiphop-328179.mp3';
export function useLofiMusic(volume: number, enabled: boolean) {
  return useLoopingAudio(lofiMusic, volume, enabled);
}

import { useState, useEffect, useRef, useCallback } from 'react';

export type Phase = 'work' | 'break';
export type TimerStatus = 'work' | 'break' | 'paused' | 'completed';

export interface TimerOptions {
  workMinutes: number;
  breakMinutes: number;
  autoStartBreak: boolean;
  autoStartWork: boolean;
}

export interface TimerState {
  minutes: number;
  seconds: number;
  progress: number;
  phase: Phase;
  isRunning: boolean;
  sessions: number;
  status: TimerStatus;
}

export function useTimer(options: TimerOptions, onComplete?: (phase: Phase) => void) {
  const { workMinutes, breakMinutes, autoStartBreak, autoStartWork } = options;

  const initialWorkMs = workMinutes * 60 * 1000;
  const initialBreakMs = breakMinutes * 60 * 1000;

  const [phase, setPhase] = useState<Phase>('work');
  const [remainingMs, setRemainingMs] = useState<number>(initialWorkMs);
  const [isRunning, setRunning] = useState(false);
  const [sessions, setSessions] = useState(0);
  const startTimeRef = useRef<number>(0);
  const initialRemainingRef = useRef<number>(0);
  const intervalRef = useRef<number | null>(null);

  // Reset when work/break minutes change
  useEffect(() => {
    // Always clear interval on timer reset (preset/custom change)
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase('work');
    setRemainingMs(initialWorkMs);
    setRunning(false);
  }, [initialWorkMs, initialBreakMs]);

  // Cleanup interval on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const tick = useCallback(() => {
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    const newRemaining = Math.max(initialRemainingRef.current - elapsed, 0);
    setRemainingMs(newRemaining);
    if (newRemaining <= 0) {
      // stop current interval
      if (intervalRef.current !== null) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      // handle completion
      onComplete?.(phase);
      if (phase === 'work') {
        setSessions((s) => s + 1);
        // switch to break
        setPhase('break');
        const nextRemaining = initialBreakMs;
        setRemainingMs(nextRemaining);
        if (autoStartBreak) {
          startTimeRef.current = performance.now();
          initialRemainingRef.current = nextRemaining;
          setRunning(true);
          intervalRef.current = window.setInterval(tick, 200);
        } else {
          setRunning(false);
        }
      } else {
        // phase === 'break'
        // switch to work
        setPhase('work');
        const nextRemaining = initialWorkMs;
        setRemainingMs(nextRemaining);
        if (autoStartWork) {
          startTimeRef.current = performance.now();
          initialRemainingRef.current = nextRemaining;
          setRunning(true);
          intervalRef.current = window.setInterval(tick, 200);
        } else {
          setRunning(false);
        }
      }
    }
  }, [autoStartBreak, autoStartWork, initialBreakMs, initialWorkMs, onComplete, phase]);

  const start = useCallback(() => {
    if (isRunning) return;
    startTimeRef.current = performance.now();
    initialRemainingRef.current = remainingMs;
    setRunning(true);
    intervalRef.current = window.setInterval(tick, 200);
  }, [isRunning, remainingMs, tick]);

  const pause = useCallback(() => {
    if (!isRunning) return;
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setRunning(false);
    // update remainingMs to the time at pause
    const now = performance.now();
    const elapsed = now - startTimeRef.current;
    setRemainingMs(Math.max(initialRemainingRef.current - elapsed, 0));
  }, [isRunning]);

  const reset = useCallback(() => {
    if (intervalRef.current !== null) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setPhase('work');
    setRemainingMs(initialWorkMs);
    setRunning(false);
  }, [initialWorkMs]);

  const minutes = Math.floor(remainingMs / 60000);
  const seconds = Math.floor((remainingMs % 60000) / 1000);
  const phaseDuration = phase === 'work' ? initialWorkMs : initialBreakMs;
  const progress = 1 - remainingMs / phaseDuration;

  const status: TimerStatus = isRunning
    ? phase
    : remainingMs === (phase === 'work' ? initialWorkMs : initialBreakMs)
      ? 'paused'
      : 'paused';
  // If status is ambiguous, just show phase or paused. Completed is not used as we auto switch

  return {
    minutes,
    seconds,
    progress,
    phase,
    isRunning,
    sessions,
    status,
    start,
    pause,
    reset,
  } as const;
}

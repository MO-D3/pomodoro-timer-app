import { useEffect } from 'react';

interface ControlsProps {
  isRunning: boolean;
  start: () => void;
  pause: () => void;
  reset: () => void;
}

const Controls = ({ isRunning, start, pause, reset }: ControlsProps) => {
  // keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'BUTTON') return;
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        isRunning ? pause() : start();
      }
      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        // confirm reset
        if (window.confirm('Are you sure you want to reset the timer?')) {
          reset();
        }
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isRunning, start, pause, reset]);

  return (
    <div
      className="flex flex-wrap space-x-2 mt-2 w-full justify-center"
      aria-label="Sterowanie"
      style={{ minWidth: 0 }}
    >
      <button
        onClick={isRunning ? pause : start}
        className="px-4 py-2 rounded-full bg-brand-green text-brand-text font-medium focus:ring-2 focus:ring-brand-greenMuted text-base min-w-[90px] mb-1"
        aria-label={isRunning ? 'Pause' : 'Start timer'}
      >
        {isRunning ? 'Pause' : 'Start'}
      </button>
      <button
        onClick={() => {
          if (window.confirm('Are you sure you want to reset the timer?')) {
            reset();
          }
        }}
        className="px-4 py-2 rounded-full bg-brand-blueMuted text-brand-text font-medium focus:ring-2 focus:ring-brand-greenMuted text-base min-w-[90px] mb-1"
        aria-label="Reset timer"
      >
        Reset
      </button>
    </div>
  );
};

export default Controls;

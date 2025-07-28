import { pad2 } from '../lib/format';
import type { Phase } from '../hooks/useTimer';

interface TimerProps {
  minutes: number;
  seconds: number;
  progress: number;
  phase: Phase;
  status: string;
}

const Timer: React.FC<TimerProps> = ({ minutes, seconds, progress, phase, status }) => {
  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);

  const phaseLabel = phase === 'work' ? 'Work' : 'Break';
  const statusLabel = status === 'paused' ? 'Paused' : phaseLabel;

  return (
    <div className="relative flex flex-col items-center justify-center space-y-4" aria-live="polite" aria-label="Timer">
      <svg width={size} height={size} className="block">
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-brand-blueMuted"
          fill="none"
          stroke="currentColor"
          opacity="0.25"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          strokeWidth={strokeWidth}
          className="text-brand-green"
          fill="none"
          stroke="currentColor"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          style={{ transition: 'stroke-dashoffset 0.2s linear' }}
        />
      </svg>
      <div className="text-6xl font-mono tabular-nums" aria-label="Pozostały czas">
        {pad2(minutes)}:{pad2(seconds)}
      </div>
      <div className="text-xl uppercase tracking-widest text-brand-greenMuted" aria-label="Status sesji">
        {statusLabel}
      </div>
    </div>
  );
};

export default Timer;
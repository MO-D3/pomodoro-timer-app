// Detect test mode via ?test=1 in the URL
const isTestMode = typeof window !== 'undefined' && window.location.search.includes('test=1');
import * as React from 'react';
import { useState } from 'react';
import Layout from '../components/Layout';
import Timer from '../components/Timer';
import PresetSelector from '../components/PresetSelector';
import Controls from '../components/Controls';
import Settings from '../components/Settings';
import StatsToday from '../components/StatsToday';
import { useTimer, Phase } from '../hooks/useTimer';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useNotifications } from '../hooks/useNotifications';
import { useAudio } from '../hooks/useAudio';
import { useLofiMusic } from '../hooks/useLofiMusic';
import { FaPlay, FaPause, FaMusic } from 'react-icons/fa';
// Import audio files via Vite so paths are resolved at build time
import endSound from '../assets/sounds/end.mp3';

// Define the presets for work/break durations
const PRESETS = [
  { label: 'Custom', work: 25, break: 5 },
  { label: '15/5', work: 15, break: 5 },
  { label: '25/5', work: 25, break: 5 },
  { label: '35/5', work: 35, break: 5 },
  { label: '45/5', work: 45, break: 5 },
];

const Home: React.FC = () => {
  // Selected tab index; defaults to 25/5 (now index 2)
  const [selectedIndex, setSelectedIndex] = useState(2);
  // Custom times state
  const [customWork, setCustomWork] = useState(isTestMode ? 1 : 25);
  const [customBreak, setCustomBreak] = useState(isTestMode ? 1 : 5);
  // Music playing state for icon toggle
  const [musicPlaying, setMusicPlaying] = useState(false);

  // When preset changes, reset timer and music
  const handlePresetChange = (index: number) => {
    setSelectedIndex(index);
    reset();
    lofiMusic.pause();
    setMusicPlaying(false); // Always show play icon after preset change
    // setMusic(false); // removed, not needed
  };
  // Preferences stored in localStorage
  const [autoStartBreak, setAutoStartBreak] = useLocalStorage('autoStartBreak', false);
  const [autoStartWork, setAutoStartWork] = useLocalStorage('autoStartWork', false);
  const [sounds, setSounds] = useLocalStorage('sounds', true);
  const [volume, setVolume] = useLocalStorage('volume', 70);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications', false);
  const [vibrations, setVibrations] = useLocalStorage('vibrations', false);
  // Music is now controlled only by Play/Pause button, not settings
  // Remove all traces of setMusic/music from settings and state
  // const [music, setMusic] = useLocalStorage('music', true);
  const music = true;
  // Stats per day stored in localStorage
  const todayKey = `stats-${new Date().toISOString().slice(0, 10)}`;
  const [stats, setStats] = useLocalStorage(todayKey, { sessions: 0, workMinutes: 0 });

  // Notifications
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { permission, requestPermission, send } = useNotifications();

  // Audio hooks for end and lofi music
  const endAudio = useAudio(endSound, volume, sounds);
  const lofiMusic = useLofiMusic(volume, music);

  // Timer hook
  const { minutes, seconds, progress, phase, isRunning, start, pause, reset } = useTimer(
    {
      workMinutes:
        selectedIndex === 0
          ? (isTestMode ? customWork / 60 : customWork)
          : PRESETS[selectedIndex]?.work ?? 25,
      breakMinutes:
        selectedIndex === 0
          ? (isTestMode ? customBreak / 60 : customBreak)
          : PRESETS[selectedIndex]?.break ?? 5,
      autoStartBreak,
      autoStartWork,
    },
    (completedPhase: Phase) => {
      // callback when a phase completes
      // Play audio signal
      endAudio.play();
      // Browser notifications
      if (notificationsEnabled) {
        const title = completedPhase === 'work' ? 'Time for a break!' : 'Time to work!';
        send(title, { body: 'Pomodoro interval finished.' });
      }
      // Vibrations
      if (vibrations && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      // Update stats only when a work session completes
      if (completedPhase === 'work') {
        setStats((prev) => {
          const newSessions = prev.sessions + 1;
          // Use correct work minutes for custom preset
          const workMinutesToAdd = selectedIndex === 0
            ? (isTestMode ? customWork / 60 : customWork)
            : PRESETS[selectedIndex].work;
          const newWorkMinutes = prev.workMinutes + workMinutesToAdd;
          if (prev.sessions === newSessions && prev.workMinutes === newWorkMinutes) {
            return prev;
          }
          return {
            sessions: newSessions,
            workMinutes: newWorkMinutes,
          };
        });
      }
    }
  );

  // Determine if we are on settings tab
  const onSettings = selectedIndex >= PRESETS.length;

  // Music control handlers
  const handleStart = () => {
    if (!isRunning) {
      lofiMusic.play();
      setMusicPlaying(true);
      start();
    }
  };
  const handlePause = () => {
    if (isRunning) {
      lofiMusic.pause();
      pause();
    }
  };

  return (
    <Layout>
      {/* LinkedIn link above Presets */}
      <div className="flex items-center justify-center mt-2 mb-2" style={{ marginTop: '0.25rem', marginBottom: '0.25rem' }}>
        <a
          href="https://www.linkedin.com/in/michal-olesiak/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-brand-green hover:text-brand-greenMuted flex items-center gap-2 text-2xl md:text-3xl font-bold italic"
          style={{ textDecoration: 'none' }}
        >
          Follow me
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="currentColor"
            style={{ verticalAlign: 'middle' }}
            aria-hidden="true"
            focusable="false"
          >
            <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-10h3v10zm-1.5-11.268c-.966 0-1.75-.785-1.75-1.75s.784-1.75 1.75-1.75 1.75.785 1.75 1.75-.784 1.75-1.75 1.75zm15.5 11.268h-3v-5.604c0-1.337-.025-3.063-1.868-3.063-1.868 0-2.154 1.459-2.154 2.967v5.7h-3v-10h2.881v1.367h.041c.401-.761 1.379-1.563 2.838-1.563 3.036 0 3.6 2.001 3.6 4.601v5.595z"/>
          </svg>
        </a>
      </div>
      {/* Preset selector including settings tab */}
      <PresetSelector
        presets={PRESETS}
        includeSettings={true}
        selectedIndex={selectedIndex}
        onSelect={handlePresetChange}
      />
      {/* Custom inputs for Custom preset - under presets, above timer */}
      {selectedIndex === 0 && !onSettings && (
        <div className="flex flex-row items-center justify-center mt-4 mb-2 w-full gap-8 custom-inputs-responsive">
          {/* Work/Break Inputs */}
          <div className="flex flex-row items-end gap-4">
            <label className="flex flex-col items-center">
              <span className="mb-1 font-medium">Focus Time ({isTestMode ? 'sec' : 'min'})</span>
              <input
                type="number"
                min={1}
                max={isTestMode ? 600 : 120}
                step={1}
                value={customWork}
                onChange={e => {
                  const val = Math.max(1, Math.min(isTestMode ? 600 : 120, Math.floor(Number(e.target.value))));
                  setCustomWork(val);
                  reset();
                }}
                className="text-center border rounded px-2 py-1 w-[100px] text-black"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </label>
            <label className="flex flex-col items-center">
              <span className="mb-1 font-medium">Break Time ({isTestMode ? 'sec' : 'min'})</span>
              <input
                type="number"
                min={1}
                max={isTestMode ? 600 : 120}
                step={1}
                value={customBreak}
                onChange={e => {
                  const val = Math.max(1, Math.min(isTestMode ? 600 : 120, Math.floor(Number(e.target.value))));
                  setCustomBreak(val);
                  reset();
                }}
                className="text-center border rounded px-2 py-1 w-[100px] text-black"
                inputMode="numeric"
                pattern="[0-9]*"
              />
            </label>
          </div>
        </div>
      )}

      {/* Timer and music controls */}
      {!onSettings && (
        <div id="timer-panel" role="tabpanel" className="flex flex-col items-center">
          <Timer
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            phase={phase}
            status={isRunning ? phase : 'paused'}
          />
          <button
            aria-label={musicPlaying ? 'Pause music' : 'Play music'}
            className="flex items-center gap-2 text-brand-green hover:text-brand-greenMuted font-medium text-2xl focus:outline-none mt-2 mb-2"
            style={{ border: 'none', background: 'none', padding: 0, cursor: 'pointer' }}
            onClick={async () => {
              // Toggle both music state and menu setting
              if (musicPlaying) {
                lofiMusic.pause();
                setMusicPlaying(false);
              } else {
                await lofiMusic.play();
                setMusicPlaying(true);
              }
            }}
          >
            <span>Play music</span>
            {musicPlaying ? (
              <FaPause style={{ verticalAlign: 'middle' }} />
            ) : (
              <FaPlay style={{ verticalAlign: 'middle' }} />
            )}
          </button>
          <Controls isRunning={isRunning} start={handleStart} pause={handlePause} reset={reset} />
          <StatsToday sessions={stats.sessions} workMinutes={stats.workMinutes} />
        </div>
      )}

      {/* ...music button now handled in timer panel above... */}
      
      {/* ...timer panel now handled above with custom inputs beside timer... */}
      {onSettings && (
        <Settings
          autoStartBreak={autoStartBreak}
          setAutoStartBreak={setAutoStartBreak}
          autoStartWork={autoStartWork}
          setAutoStartWork={setAutoStartWork}
          sounds={sounds}
          setSounds={setSounds}
          volume={volume}
          setVolume={setVolume}
          notifications={notificationsEnabled}
          setNotifications={setNotificationsEnabled}
          requestNotificationPermission={requestPermission}
          vibrations={vibrations}
          setVibrations={setVibrations}
        />
      )}
    </Layout>
  );
};

export default Home;

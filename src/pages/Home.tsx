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

  // When preset changes, reset timer and music
  const handlePresetChange = (index: number) => {
    setSelectedIndex(index);
    reset();
    lofiMusic.pause();
  };
  // Preferences stored in localStorage
  const [autoStartBreak, setAutoStartBreak] = useLocalStorage('autoStartBreak', false);
  const [autoStartWork, setAutoStartWork] = useLocalStorage('autoStartWork', false);
  const [sounds, setSounds] = useLocalStorage('sounds', true);
  const [volume, setVolume] = useLocalStorage('volume', 70);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications', false);
  const [vibrations, setVibrations] = useLocalStorage('vibrations', false);
  const [music, setMusic] = useLocalStorage('music', true);
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
          const newWorkMinutes = prev.workMinutes + PRESETS[selectedIndex].work;
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
      reset(); // Always start from preset's initial value
      if (music) lofiMusic.play();
      start();
    }
  };
  const handlePause = () => {
    if (isRunning) {
      if (music) lofiMusic.pause();
      pause();
    }
  };

  return (
    <Layout>
      {/* Preset selector including settings tab */}
      <PresetSelector
        presets={PRESETS}
        includeSettings={true}
        selectedIndex={selectedIndex}
        onSelect={handlePresetChange}
      />
      {/* Custom inputs for Custom preset */}
      {selectedIndex === 0 && (
        <div className="flex flex-col items-center justify-center mt-4 mb-2">
          <label className="mb-2 flex flex-col items-center">
            <span className="mb-1 font-medium">Focus Time ({isTestMode ? 'sec' : 'min'})</span>
            <input
              type="number"
              min={1}
              max={isTestMode ? 600 : 120}
              step={1}
              value={customWork}
              onChange={e => setCustomWork(Math.max(1, Math.min(isTestMode ? 600 : 120, Math.floor(Number(e.target.value)))))}
              className="text-center border rounded px-2 py-1 w-[100px] text-black"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </label>
          <label className="mb-2 flex flex-col items-center">
            <span className="mb-1 font-medium">Break Time ({isTestMode ? 'sec' : 'min'})</span>
            <input
              type="number"
              min={1}
              max={isTestMode ? 600 : 120}
              step={1}
              value={customBreak}
              onChange={e => setCustomBreak(Math.max(1, Math.min(isTestMode ? 600 : 120, Math.floor(Number(e.target.value)))))}
              className="text-center border rounded px-2 py-1 w-[100px] text-black"
              inputMode="numeric"
              pattern="[0-9]*"
            />
          </label>
        </div>
      )}
      {!onSettings && (
        <div id="timer-panel" role="tabpanel" className="mt-6 flex flex-col items-center">
          <Timer
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            phase={phase}
            status={isRunning ? phase : 'paused'}
          />
          <Controls isRunning={isRunning} start={handleStart} pause={handlePause} reset={reset} />
          <StatsToday sessions={stats.sessions} workMinutes={stats.workMinutes} />
        </div>
      )}
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
          music={music}
          setMusic={setMusic}
        />
      )}
    </Layout>
  );
};

export default Home;

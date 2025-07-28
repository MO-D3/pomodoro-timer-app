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
// Import audio files via Vite so paths are resolved at build time
import endSound from '../assets/sounds/end.mp3';

// Define the presets for work/break durations
const PRESETS = [
  { label: '10/5', work: 0.1667, break: 0.0834 }, // 10 sekund pracy, 5 sekund przerwy
  { label: '15/5', work: 15, break: 5 },
  { label: '25/5', work: 25, break: 5 },
  { label: '35/5', work: 35, break: 5 },
  { label: '45/5', work: 45, break: 5 },
];

const Home: React.FC = () => {
  // Selected tab index; defaults do 25/5 (teraz index 2)
  const [selectedIndex, setSelectedIndex] = useState(2);
  // Preferences stored in localStorage
  const [autoStartBreak, setAutoStartBreak] = useLocalStorage('autoStartBreak', false);
  const [autoStartWork, setAutoStartWork] = useLocalStorage('autoStartWork', false);
  const [sounds, setSounds] = useLocalStorage('sounds', true);
  const [volume, setVolume] = useLocalStorage('volume', 70);
  const [notificationsEnabled, setNotificationsEnabled] = useLocalStorage('notifications', false);
  const [vibrations, setVibrations] = useLocalStorage('vibrations', false);
  // Stats per day stored in localStorage
  const todayKey = `stats-${new Date().toISOString().slice(0, 10)}`;
  const [stats, setStats] = useLocalStorage(todayKey, { sessions: 0, workMinutes: 0 });

  // Notifications
  const { permission, requestPermission, send } = useNotifications();

  // Audio hooks for end and tick; we might only use end
  const endAudio = useAudio(endSound, volume, sounds);

  // Timer hook
  const { minutes, seconds, progress, phase, isRunning, start, pause, reset } = useTimer(
    {
      workMinutes: PRESETS[selectedIndex]?.work ?? 25,
      breakMinutes: PRESETS[selectedIndex]?.break ?? 5,
      autoStartBreak,
      autoStartWork,
    },
    (completedPhase: Phase) => {
      // callback when a phase completes
      // Play audio signal
      endAudio.play();
      // Browser notifications
      if (notificationsEnabled) {
        const title = completedPhase === 'work' ? 'Czas na przerwę!' : 'Czas do pracy!';
        send(title, { body: 'Interwał pomodoro zakończony.' });
      }
      // Vibrations
      if (vibrations && 'vibrate' in navigator) {
        navigator.vibrate([200, 100, 200]);
      }
      // Update stats only when a work session completes
      if (completedPhase === 'work') {
        setStats((prev) => ({
          sessions: prev.sessions + 1,
          workMinutes: prev.workMinutes + PRESETS[selectedIndex].work,
        }));
      }
    }
  );

  // Determine if we are on settings tab
  const onSettings = selectedIndex >= PRESETS.length;

  return (
    <Layout>
      {/* Preset selector including settings tab */}
      <PresetSelector
        presets={PRESETS}
        includeSettings={true}
        selectedIndex={selectedIndex}
        onSelect={(index) => setSelectedIndex(index)}
      />
      {!onSettings && (
        <div id="timer-panel" role="tabpanel" className="mt-6 flex flex-col items-center">
          <Timer
            minutes={minutes}
            seconds={seconds}
            progress={progress}
            phase={phase}
            status={isRunning ? phase : 'paused'}
          />
          <Controls isRunning={isRunning} start={start} pause={pause} reset={reset} />
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
        />
      )}
    </Layout>
  );
};

export default Home;

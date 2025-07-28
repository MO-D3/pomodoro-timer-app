interface SettingsProps {
  autoStartBreak: boolean;
  setAutoStartBreak: (v: boolean) => void;
  autoStartWork: boolean;
  setAutoStartWork: (v: boolean) => void;
  sounds: boolean;
  setSounds: (v: boolean) => void;
  volume: number;
  setVolume: (v: number) => void;
  notifications: boolean;
  setNotifications: (v: boolean) => void;
  requestNotificationPermission: () => void;
  vibrations: boolean;
  setVibrations: (v: boolean) => void;
}

const Settings: React.FC<SettingsProps> = ({
  autoStartBreak,
  setAutoStartBreak,
  autoStartWork,
  setAutoStartWork,
  sounds,
  setSounds,
  volume,
  setVolume,
  notifications,
  setNotifications,
  requestNotificationPermission,
  vibrations,
  setVibrations,
}) => {
  return (
    <div id="settings-panel" role="tabpanel" className="mt-6 space-y-6">
      <h2 className="text-2xl font-semibold">Settings</h2>
      <div className="space-y-4">
        {/* Auto start break */}
        <label className="flex items-center justify-between">
          <span>Auto-start przerw</span>
          <input
            type="checkbox"
            checked={autoStartBreak}
            onChange={(e) => setAutoStartBreak(e.target.checked)}
            className="h-5 w-5"
            aria-label="Auto-start przerw"
          />
        </label>
        {/* Auto start work */}
        <label className="flex items-center justify-between">
          <span>Auto-start pracy</span>
          <input
            type="checkbox"
            checked={autoStartWork}
            onChange={(e) => setAutoStartWork(e.target.checked)}
            className="h-5 w-5"
            aria-label="Auto-start pracy"
          />
        </label>
        {/* Sounds */}
        <label className="flex items-center justify-between" htmlFor="sounds-toggle">
          <span id="sounds-label">Sounds</span>
          <input
            id="sounds-toggle"
            type="checkbox"
            checked={sounds}
            onChange={(e) => setSounds(e.target.checked)}
            className="h-5 w-5"
            aria-labelledby="sounds-label"
          />
        </label>
        {/* Volume */}
        <label className="flex items-center justify-between" htmlFor="volume-range">
          <span id="volume-label" className="inline-block min-w-[80px]">
            Volume: {volume}%
          </span>
          <input
            id="volume-range"
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="flex-1 ml-4"
            aria-labelledby="volume-label"
          />
        </label>
        {/* Notifications */}
        <label className="flex items-center justify-between" htmlFor="notifications-toggle">
          <span id="notifications-label">Notifications</span>
          <input
            id="notifications-toggle"
            type="checkbox"
            checked={notifications}
            onChange={async (e) => {
              const checked = e.target.checked;
              setNotifications(checked);
              if (checked) {
                await requestNotificationPermission();
              }
            }}
            className="h-5 w-5"
            aria-labelledby="notifications-label"
          />
        </label>
        {/* Vibrations */}
        <label className="flex items-center justify-between" htmlFor="vibrations-toggle">
          <span id="vibrations-label">Vibrations</span>
          <input
            id="vibrations-toggle"
            type="checkbox"
            checked={vibrations}
            onChange={(e) => setVibrations(e.target.checked)}
            className="h-5 w-5"
            aria-labelledby="vibrations-label"
          />
        </label>
      </div>
    </div>
  );
};

export default Settings;

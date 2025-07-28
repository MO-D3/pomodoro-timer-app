interface StatsTodayProps {
  sessions: number;
  workMinutes: number;
}

const StatsToday: React.FC<StatsTodayProps> = ({ sessions, workMinutes }) => {
  return (
    <div className="mt-6 border border-brand-blueMuted rounded-xl p-4 bg-brand-surface text-brand-text" role="complementary">
      <h2 className="text-xl font-semibold mb-2">Dzisiejsze statystyki</h2>
      <p>Liczba zakończonych pomodoro: <strong>{sessions}</strong></p>
      <p>Łączny czas pracy: <strong>{workMinutes}</strong> min</p>
    </div>
  );
};

export default StatsToday;
interface StatsTodayProps {
  sessions: number;
  workMinutes: number;
}

const StatsToday: React.FC<StatsTodayProps> = ({ sessions, workMinutes }) => {
  return (
    <div
      className="mt-2 border border-brand-blueMuted rounded-xl p-2 bg-brand-surface text-brand-text w-full max-w-xs mx-auto"
      role="complementary"
    >
      <h2 className="text-xl font-semibold mb-1">Today's stats</h2>
      <p>
        Pomodoros completed: <strong>{sessions}</strong>
      </p>
      <p>
        Total work time: <strong>{workMinutes}</strong> min
      </p>
    </div>
  );
};

export default StatsToday;

interface StatsTodayProps {
  sessions: number; // integer
  workMinutes: number; // float, will be formatted to max 3 digits
}

const StatsToday: React.FC<StatsTodayProps> = ({ sessions, workMinutes }) => {
  // Ensure sessions is always an integer
  const sessionsInt = Math.floor(sessions);
  // Format workMinutes to max 3 significant digits, similar to Java's BigDecimal rounding
  const workMinutesFormatted = Number.parseFloat(workMinutes.toPrecision(3));
  return (
    <div
      className="mt-2 border border-brand-blueMuted rounded-xl p-2 bg-brand-surface text-brand-text w-full max-w-xs mx-auto"
      role="complementary"
    >
      <h2 className="text-xl font-semibold mb-1">Today's stats</h2>
      <p>
        Pomodoros completed: <strong>{sessionsInt}</strong>
      </p>
      <p>
        Total work time: <strong>{workMinutesFormatted}</strong> min
      </p>
    </div>
  );
};

export default StatsToday;

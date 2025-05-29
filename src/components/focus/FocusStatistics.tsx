
interface FocusStatisticsProps {
  sessions: number;
  totalFocusTime: number;
  treeGrowth: number;
  totalLifetimeMinutes: number;
}

const FocusStatistics = ({ sessions, totalFocusTime, treeGrowth, totalLifetimeMinutes }: FocusStatisticsProps) => {
  const formatTime = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <div className="text-center">
        <div className="text-2xl font-bold text-green-600 dark:text-green-400">
          {sessions}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Today's Sessions</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
          {totalFocusTime}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Minutes Focused</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
          {Math.round(treeGrowth)}%
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Current Progress</div>
      </div>
      <div className="text-center">
        <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">
          {totalLifetimeMinutes > 0 ? formatTime(totalLifetimeMinutes) : '0h 0m'}
        </div>
        <div className="text-sm text-gray-600 dark:text-gray-400">Total Time</div>
      </div>
    </div>
  );
};

export default FocusStatistics;


import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock, Target, Trophy, TrendingUp } from 'lucide-react';

interface UserStatsCardsProps {
  userRank: {
    total_focus_time: number;
    total_sessions: number;
    rank: number;
  } | null;
  schoolName: string;
}

const UserStatsCards = ({ userRank, schoolName }: UserStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Focus Sessions
          </CardTitle>
          <Clock className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {userRank?.total_focus_time ? `${Math.floor(userRank.total_focus_time / 60)}h ${userRank.total_focus_time % 60}m` : '0h 0m'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Total focus time
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Sessions Completed
          </CardTitle>
          <Target className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            {userRank?.total_sessions || 0}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Focus sessions
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            Current Rank
          </CardTitle>
          <Trophy className="h-4 w-4 text-yellow-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-gray-900 dark:text-white">
            #{userRank?.rank || '-'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            In leaderboard
          </p>
        </CardContent>
      </Card>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600 dark:text-gray-400">
            School
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-purple-500" />
        </CardHeader>
        <CardContent>
          <div className="text-lg font-bold text-gray-900 dark:text-white truncate">
            {schoolName || 'Not set'}
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Your institution
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserStatsCards;

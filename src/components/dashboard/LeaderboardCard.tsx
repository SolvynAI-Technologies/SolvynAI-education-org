
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Trophy } from 'lucide-react';

interface LeaderboardEntry {
  full_name: string;
  school_name: string;
  total_focus_time: number;
  total_sessions: number;
  rank: number;
}

interface LeaderboardCardProps {
  leaderboard: LeaderboardEntry[];
  userRank: LeaderboardEntry | null;
  loading: boolean;
}

const LeaderboardCard = ({ leaderboard, userRank, loading }: LeaderboardCardProps) => {
  return (
    <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
          <Trophy className="h-5 w-5 text-yellow-500" />
          <span>Focus Leaderboard</span>
        </CardTitle>
        <CardDescription className="text-gray-600 dark:text-gray-400">
          Top performers by focus session duration
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-4">
              <p className="text-gray-500 dark:text-gray-400">Loading leaderboard...</p>
            </div>
          ) : (
            <>
              {/* Top performers */}
              <div className="space-y-3">
                {leaderboard.slice(0, 5).map((user) => (
                  <div key={user.rank} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        user.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        user.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        user.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {user.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{user.full_name}</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{user.school_name}</div>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200">
                      {Math.floor(user.total_focus_time / 60)}h {user.total_focus_time % 60}m
                    </Badge>
                  </div>
                ))}
              </div>

              {/* User's Rank */}
              {userRank && userRank.rank > 5 && (
                <div className="border-t pt-4 mt-4 border-gray-200 dark:border-gray-600">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800">
                    <div className="flex items-center space-x-4">
                      <div className="w-8 h-8 rounded-full bg-green-500 text-white flex items-center justify-center text-sm font-bold">
                        {userRank.rank}
                      </div>
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{userRank.full_name} (You)</div>
                        <div className="text-sm text-gray-500 dark:text-gray-400">{userRank.school_name}</div>
                      </div>
                    </div>
                    <Badge className="bg-green-500 text-white">
                      {Math.floor(userRank.total_focus_time / 60)}h {userRank.total_focus_time % 60}m
                    </Badge>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LeaderboardCard;

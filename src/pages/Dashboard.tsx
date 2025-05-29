
import UserStatsCards from '@/components/dashboard/UserStatsCards';
import LeaderboardCard from '@/components/dashboard/LeaderboardCard';
import FeatureGrid from '@/components/dashboard/FeatureGrid';
import { useProfile } from '@/hooks/useProfile';
import { useFocusLeaderboard } from '@/hooks/useFocusLeaderboard';

const Dashboard = () => {
  const { profile } = useProfile();
  const { leaderboard, userRank, loading } = useFocusLeaderboard();

  const userName = profile?.full_name || "User";

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-8 text-white">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {userName.split(' ')[0]}! 🎓</h1>
        <p className="text-green-100 text-lg">Ready to enhance your learning journey with AI-powered tools?</p>
      </div>

      {/* User Stats */}
      <UserStatsCards userRank={userRank} schoolName={profile?.school_name || ''} />

      {/* Focus Leaderboard */}
      <LeaderboardCard leaderboard={leaderboard} userRank={userRank} loading={loading} />

      {/* Quick Access Features */}
      <FeatureGrid />
    </div>
  );
};

export default Dashboard;

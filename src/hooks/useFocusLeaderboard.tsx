
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';

interface LeaderboardEntry {
  full_name: string;
  school_name: string;
  total_focus_time: number;
  total_sessions: number;
  rank: number;
}

export const useFocusLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<LeaderboardEntry | null>(null);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchLeaderboard();
  }, [user]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      
      // Fetch from the updated leaderboard view
      const { data: viewData, error: viewError } = await supabase
        .from('focus_leaderboard')
        .select('*')
        .order('total_focus_time', { ascending: false })
        .limit(10);

      if (viewError) {
        console.error('Error fetching leaderboard view:', viewError);
        // Fallback to manual calculation if view fails
        await fetchLeaderboardManually();
        return;
      }

      if (viewData && viewData.length > 0) {
        setLeaderboard(viewData);
        
        // Find current user's rank from the full leaderboard
        if (user) {
          const { data: allData, error: allError } = await supabase
            .from('focus_leaderboard')
            .select('*')
            .order('total_focus_time', { ascending: false });
          
          if (!allError && allData) {
            const currentUserRank = allData.find(entry => 
              entry.full_name === user.user_metadata?.full_name
            );
            setUserRank(currentUserRank || null);
          }
        }
      } else {
        // If no data in view, set empty arrays
        setLeaderboard([]);
        setUserRank(null);
      }
    } catch (error) {
      console.error('Error fetching leaderboard:', error);
      setLeaderboard([]);
      setUserRank(null);
    } finally {
      setLoading(false);
    }
  };

  const fetchLeaderboardManually = async () => {
    try {
      // Manual aggregation as fallback
      const { data: sessionData, error: sessionError } = await supabase
        .from('focus_sessions')
        .select(`
          user_id,
          duration,
          profiles!inner(full_name, school_name)
        `);

      if (!sessionError && sessionData && sessionData.length > 0) {
        // Aggregate data by user
        const userStats = sessionData.reduce((acc: any, session: any) => {
          const userId = session.user_id;
          if (!acc[userId]) {
            acc[userId] = {
              full_name: session.profiles.full_name,
              school_name: session.profiles.school_name,
              total_focus_time: 0,
              total_sessions: 0
            };
          }
          acc[userId].total_focus_time += session.duration;
          acc[userId].total_sessions += 1;
          return acc;
        }, {});

        // Convert to array and sort
        const leaderboardData = Object.values(userStats)
          .sort((a: any, b: any) => b.total_focus_time - a.total_focus_time)
          .map((entry: any, index: number) => ({
            ...entry,
            rank: index + 1
          }));

        setLeaderboard(leaderboardData.slice(0, 10));
        
        // Find current user's rank
        if (user) {
          const currentUserRank = leaderboardData.find((entry: any) => 
            entry.full_name === user.user_metadata?.full_name
          );
          setUserRank(currentUserRank || null);
        }
      } else {
        setLeaderboard([]);
        setUserRank(null);
      }
    } catch (error) {
      console.error('Error in manual leaderboard fetch:', error);
      setLeaderboard([]);
      setUserRank(null);
    }
  };

  return { leaderboard, userRank, loading, refetch: fetchLeaderboard };
};

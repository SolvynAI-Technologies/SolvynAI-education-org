
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, School, Calendar, Trophy, Clock, Sun, Moon, LogOut } from 'lucide-react';
import { useProfile } from '@/hooks/useProfile';
import { useFocusLeaderboard } from '@/hooks/useFocusLeaderboard';
import { useAuth } from '@/contexts/AuthContext';
import { useTheme } from 'next-themes';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

const Profile = () => {
  const { profile, loading, updateProfile } = useProfile();
  const { userRank } = useFocusLeaderboard();
  const [isEditing, setIsEditing] = useState(false);
  const { signOut } = useAuth();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await signOut();
    navigate('/auth');
  };

  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };
  const [formData, setFormData] = useState({
    full_name: '',
    school_name: '',
    gender: ''
  });

  // Update form data when profile loads
  React.useEffect(() => {
    if (profile) {
      setFormData({
        full_name: profile.full_name,
        school_name: profile.school_name,
        gender: profile.gender
      });
    }
  }, [profile]);

  const handleUpdateProfile = async () => {
    const { error } = await updateProfile(formData);
    if (error) {
      toast.error('Failed to update profile');
    } else {
      toast.success('Profile updated successfully');
      setIsEditing(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Loading profile...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <div className="text-center">
          <p className="text-gray-600 dark:text-gray-400">Profile not found</p>
        </div>
      </div>
    );
  }

  const userInitials = profile.full_name.split(' ').map(name => name[0]).join('').slice(0, 2);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      {/* Mobile-only buttons for Logout and Theme Toggler */}
      <div className="md:hidden flex justify-end space-x-4 mb-4">
        <Button
          variant="outline"
          onClick={handleLogout}
          className="flex items-center space-x-2"
        >
          <LogOut className="h-4 w-4" />
          <span>Logout</span>
        </Button>
        <button
          aria-label="Toggle theme"
          className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          onClick={handleThemeToggle}
          type="button"
        >
          {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
        </button>
      </div>
      {/* Profile Header */}
      <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white border-0">
        <CardHeader>
          <div className="flex items-center space-x-6">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
              {userInitials}
            </div>
            <div>
              <CardTitle className="text-2xl">{profile.full_name}</CardTitle>
              <CardDescription className="text-green-100">
                Student at {profile.school_name}
              </CardDescription>
              <div className="flex items-center space-x-4 mt-2 text-sm text-green-100">
                <span className="flex items-center space-x-1">
                  <Calendar className="h-4 w-4" />
                  <span>Joined {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                </span>
                <span className="flex items-center space-x-1">
                  <Trophy className="h-4 w-4" />
                  <span>Rank #{userRank?.rank || '-'}</span>
                </span>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Personal Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                    <User className="h-5 w-5" />
                    <span>Personal Information</span>
                  </CardTitle>
                  <CardDescription className="text-gray-600 dark:text-gray-400">
                    Update your personal details and preferences
                  </CardDescription>
                </div>
                <Button
                  variant={isEditing ? "outline" : "default"}
                  onClick={() => setIsEditing(!isEditing)}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  {isEditing ? 'Cancel' : 'Edit'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="fullName">Full Name</Label>
                  <Input
                    id="fullName"
                    value={isEditing ? formData.full_name : profile.full_name}
                    onChange={(e) => setFormData({...formData, full_name: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="school">School Name</Label>
                  <Input
                    id="school"
                    value={isEditing ? formData.school_name : profile.school_name}
                    onChange={(e) => setFormData({...formData, school_name: e.target.value})}
                    disabled={!isEditing}
                    className="bg-gray-50 dark:bg-gray-700"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">Gender</Label>
                <Select 
                  value={isEditing ? formData.gender : profile.gender} 
                  onValueChange={(value) => setFormData({...formData, gender: value})}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <Button 
                  onClick={handleUpdateProfile}
                  className="w-full bg-green-500 hover:bg-green-600 text-white"
                >
                  Update Profile
                </Button>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Statistics */}
        <div className="space-y-6">
          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Trophy className="h-5 w-5" />
                <span>Statistics</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Total Focus Time</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {userRank?.total_focus_time ? `${Math.floor(userRank.total_focus_time / 60)}h ${userRank.total_focus_time % 60}m` : '0h 0m'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Sessions Completed</span>
                  <span className="font-semibold text-gray-900 dark:text-white">{userRank?.total_sessions || 0}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Current Rank</span>
                  <span className="font-semibold text-gray-900 dark:text-white">#{userRank?.rank || '-'}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2 text-gray-900 dark:text-white">
                <Clock className="h-5 w-5" />
                <span>Account Info</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Member since</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(profile.created_at).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Last updated</span>
                  <span className="text-gray-900 dark:text-white">
                    {new Date(profile.updated_at).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Profile;

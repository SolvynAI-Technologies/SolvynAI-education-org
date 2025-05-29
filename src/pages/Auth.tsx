
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { toast } from 'sonner';
import { useTheme } from 'next-themes';
import { Switch } from '@/components/ui/switch';
import authImage from '../../public/2a4baae7-0522-4972-8e6e-c5712b1d3744.png';
import { Sun, Moon } from 'lucide-react';
import logoLight from '../../public/logo light.png';
import logoDark from '../../public/aa698e7f-a6ed-420f-9a12-a76da65118f5.png';

const Auth = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [gender, setGender] = useState('');
  const [loading, setLoading] = useState(false);
  const { theme, setTheme, resolvedTheme } = useTheme();
  const { signIn, signUp, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate('/');
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isLogin) {
        const { error } = await signIn(email, password);
        if (error) {
          toast.error(error.message || 'Login failed');
        } else {
          toast.success('Logged in successfully!');
          navigate('/');
        }
      } else {
        if (!fullName || !schoolName || !gender) {
          toast.error('Please fill in all required fields');
          setLoading(false);
          return;
        }
        const { error } = await signUp(email, password, {
          full_name: fullName,
          school_name: schoolName,
          gender: gender
        });
        if (error) {
          toast.error(error.message || 'Signup failed');
        } else {
          toast.success('Account created successfully! Please check your email to verify your account.');
        }
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Theme toggler handler
  const handleThemeToggle = () => {
    setTheme(resolvedTheme === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row items-stretch bg-gray-50 dark:bg-gray-900">
      {/* Left Side Image (visible on mobile as background) */}
      <div
        className="absolute inset-0 md:relative md:w-1/2 flex items-center justify-center bg-white dark:bg-gray-800 p-0"
        style={{ backgroundImage: `url(${authImage})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        {/* Overlay for blur and dimming effect on mobile */}
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm md:hidden"></div>
        <img 
          src={authImage} 
          alt="Auth Visual" 
          className="object-cover w-full h-full hidden md:block" 
        />
      </div>
      {/* Right Side Auth Card */}
      <div className="relative flex flex-1 items-center justify-center p-4 z-10">
        <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
          <button
            aria-label="Toggle theme"
            className="rounded-full p-2 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
            onClick={handleThemeToggle}
            type="button"
          >
            {resolvedTheme === 'dark' ? <Sun className="w-5 h-5 text-yellow-400" /> : <Moon className="w-5 h-5 text-gray-800" />}
          </button>
        </div>
        <Card className="w-full max-w-md bg-white dark:bg-gray-800 border-0 shadow-lg">
          <CardHeader className="text-center pb-2">
            <div className="flex items-center justify-center gap-2 mb-4">
  <img
    src={resolvedTheme === 'dark' ? logoDark : logoLight}
    alt="SolvynAI Logo"
    className="h-16 w-auto"
  />
</div>

            <CardDescription className="text-gray-600 dark:text-gray-400">
              {isLogin ? 'Sign in to your account' : 'Join the educational revolution'}
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-0">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-50 dark:bg-gray-700"
                />
              </div>
              {!isLogin && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="fullName">Full Name</Label>
                    <Input
                      id="fullName"
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="schoolName">School Name</Label>
                    <Input
                      id="schoolName"
                      type="text"
                      value={schoolName}
                      onChange={(e) => setSchoolName(e.target.value)}
                      required
                      className="bg-gray-50 dark:bg-gray-700"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select value={gender} onValueChange={setGender} required>
                      <SelectTrigger className="bg-gray-50 dark:bg-gray-700">
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                        <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </>
              )}
              <Button 
                type="submit" 
                className="w-full bg-green-500 hover:bg-green-600 text-white"
                disabled={loading}
              >
                {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
              </Button>
            </form>
            <div className="mt-6 text-center">
              <Button
                variant="link"
                onClick={() => setIsLogin(!isLogin)}
                className="text-green-500 hover:text-green-600"
              >
                {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Auth;

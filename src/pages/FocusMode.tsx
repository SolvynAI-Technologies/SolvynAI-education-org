
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import FocusTimer from '@/components/focus/FocusTimer';
import FocusModeControls from '@/components/focus/FocusModeControls';
import FocusTreeVisualization from '@/components/focus/FocusTreeVisualization';
import FocusStatistics from '@/components/focus/FocusStatistics';
import { useFocusSession } from '@/hooks/useFocusSession';

const FocusMode = () => {
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'focus' | 'shortBreak' | 'longBreak'>('focus');
  const [currentTask, setCurrentTask] = useState('');
  const [treeGrowth, setTreeGrowth] = useState(0);
  const [currentDuration, setCurrentDuration] = useState(25 * 60);
  
  const { sessions, totalFocusTime, totalLifetimeMinutes, saveFocusSession } = useFocusSession();

  const presets = {
    focus: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;
    
    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((time) => {
          const newTime = time - 1;
          const progress = ((currentDuration - newTime) / currentDuration) * 100;
          setTreeGrowth(Math.min(progress, 100));
          return newTime;
        });
      }, 1000);
    } else if (timeLeft === 0) {
      setIsActive(false);
      handleSessionComplete();
    }

    return () => clearInterval(interval);
  }, [isActive, timeLeft, currentDuration]);

  const handleSessionComplete = async () => {
    if (mode === 'focus') {
      const completedMinutes = Math.round(currentDuration / 60);
      await saveFocusSession(completedMinutes, currentTask);
    }
    
    if (mode === 'focus') {
      const nextMode = sessions > 0 && (sessions + 1) % 4 === 0 ? 'longBreak' : 'shortBreak';
      setMode(nextMode);
      const nextDuration = presets[nextMode];
      setTimeLeft(nextDuration);
      setCurrentDuration(nextDuration);
    } else {
      setMode('focus');
      const nextDuration = presets.focus;
      setTimeLeft(nextDuration);
      setCurrentDuration(nextDuration);
    }
    
    setTreeGrowth(0);
  };

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(currentDuration);
    setTreeGrowth(0);
  };

  const switchMode = (newMode: 'focus' | 'shortBreak' | 'longBreak') => {
    setMode(newMode);
    const newDuration = presets[newMode];
    setTimeLeft(newDuration);
    setCurrentDuration(newDuration);
    setIsActive(false);
    setTreeGrowth(0);
  };

  const handleCustomDuration = (minutes: number, type: 'focus' | 'shortBreak' | 'longBreak') => {
    const seconds = minutes * 60;
    setCurrentDuration(seconds);
    setTimeLeft(seconds);
    setIsActive(false);
    setTreeGrowth(0);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card className="bg-gradient-to-r from-indigo-500 to-indigo-600 text-white border-0">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2 text-2xl">
            <Timer className="h-6 w-6" />
            <span>Focus Mode</span>
          </CardTitle>
          <CardDescription className="text-indigo-100">
            Enhance your concentration with pomodoro sessions and watch your tree grow
          </CardDescription>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <FocusModeControls 
              mode={mode} 
              onSwitchMode={switchMode}
              onCustomDuration={handleCustomDuration}
            />
          </CardHeader>
          
          <CardContent>
            <FocusTimer
              timeLeft={timeLeft}
              isActive={isActive}
              mode={mode}
              currentTask={currentTask}
              treeGrowth={treeGrowth}
              onToggleTimer={toggleTimer}
              onResetTimer={resetTimer}
              onTaskChange={setCurrentTask}
            />
          </CardContent>
        </Card>

        <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
          <CardHeader>
            <CardTitle className="text-gray-900 dark:text-white">Your Focus Tree</CardTitle>
            <CardDescription className="text-gray-600 dark:text-gray-400">
              Watch your tree grow as you stay focused
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <FocusTreeVisualization treeGrowth={treeGrowth} />
          </CardContent>
        </Card>
      </div>

      <Card className="bg-white dark:bg-gray-800 border-0 shadow-sm">
        <CardHeader>
          <CardTitle className="text-gray-900 dark:text-white">Session Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <FocusStatistics 
            sessions={sessions} 
            totalFocusTime={totalFocusTime} 
            treeGrowth={treeGrowth} 
            totalLifetimeMinutes={totalLifetimeMinutes}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default FocusMode;

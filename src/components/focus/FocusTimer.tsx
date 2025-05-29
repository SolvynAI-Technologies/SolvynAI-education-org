
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface FocusTimerProps {
  timeLeft: number;
  isActive: boolean;
  mode: 'focus' | 'shortBreak' | 'longBreak';
  currentTask: string;
  treeGrowth: number;
  onToggleTimer: () => void;
  onResetTimer: () => void;
  onTaskChange: (task: string) => void;
}

const FocusTimer = ({
  timeLeft,
  isActive,
  mode,
  currentTask,
  treeGrowth,
  onToggleTimer,
  onResetTimer,
  onTaskChange
}: FocusTimerProps) => {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getModeColor = (currentMode: string) => {
    switch (currentMode) {
      case 'focus': return 'bg-green-500';
      case 'shortBreak': return 'bg-blue-500';
      case 'longBreak': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  const getModeTitle = (currentMode: string) => {
    switch (currentMode) {
      case 'focus': return 'Focus Session';
      case 'shortBreak': return 'Short Break';
      case 'longBreak': return 'Long Break';
      default: return 'Timer';
    }
  };

  return (
    <div className="space-y-6">
      <h3 className="text-center text-gray-900 dark:text-white font-semibold">
        {getModeTitle(mode)}
      </h3>
      
      {/* Timer Display */}
      <div className="text-center">
        <div className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
          {formatTime(timeLeft)}
        </div>
        
        {/* Progress Ring */}
        <div className="relative w-32 h-32 mx-auto mb-6">
          <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 120 120">
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              className="text-gray-200 dark:text-gray-700"
            />
            <circle
              cx="60"
              cy="60"
              r="54"
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={340}
              strokeDashoffset={340 - (treeGrowth / 100) * 340}
              className={`${getModeColor(mode)} transition-all duration-1000 ease-linear`}
              strokeLinecap="round"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">
              {Math.round(treeGrowth)}%
            </span>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="flex justify-center space-x-4">
        <Button
          onClick={onToggleTimer}
          className={`${getModeColor(mode)} hover:opacity-90 text-white px-6`}
        >
          {isActive ? (
            <>
              <Pause className="h-4 w-4 mr-2" />
              Pause
            </>
          ) : (
            <>
              <Play className="h-4 w-4 mr-2" />
              Start
            </>
          )}
        </Button>
        
        <Button variant="outline" onClick={onResetTimer}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Reset
        </Button>
      </div>

      {/* Current Task */}
      {mode === 'focus' && (
        <div className="space-y-2">
          <Label htmlFor="currentTask">What are you working on?</Label>
          <Input
            id="currentTask"
            placeholder="Enter your current task..."
            value={currentTask}
            onChange={(e) => onTaskChange(e.target.value)}
            className="bg-gray-50 dark:bg-gray-700"
          />
        </div>
      )}
    </div>
  );
};

export default FocusTimer;

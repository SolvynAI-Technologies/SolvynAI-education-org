
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Clock, Settings } from 'lucide-react';
import { useState } from 'react';

interface FocusModeControlsProps {
  mode: 'focus' | 'shortBreak' | 'longBreak';
  onSwitchMode: (newMode: 'focus' | 'shortBreak' | 'longBreak') => void;
  onCustomDuration?: (minutes: number, type: 'focus' | 'shortBreak' | 'longBreak') => void;
}

const FocusModeControls = ({ mode, onSwitchMode, onCustomDuration }: FocusModeControlsProps) => {
  const [customMinutes, setCustomMinutes] = useState(25);
  const [showCustomDialog, setShowCustomDialog] = useState(false);

  const presetDurations = [
    { label: '15 min', minutes: 15 },
    { label: '25 min', minutes: 25 },
    { label: '30 min', minutes: 30 },
    { label: '45 min', minutes: 45 },
    { label: '60 min', minutes: 60 },
  ];

  const handlePresetSelect = (minutes: number) => {
    if (onCustomDuration) {
      onCustomDuration(minutes, mode);
    }
  };

  const handleCustomSubmit = () => {
    if (customMinutes > 0 && customMinutes <= 180 && onCustomDuration) {
      onCustomDuration(customMinutes, mode);
      setShowCustomDialog(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-center space-x-2 mb-4">
        <Button
          variant={mode === 'focus' ? 'default' : 'outline'}
          onClick={() => onSwitchMode('focus')}
          className={mode === 'focus' ? 'bg-green-500 hover:bg-green-600' : ''}
        >
          Focus
        </Button>
        <Button
          variant={mode === 'shortBreak' ? 'default' : 'outline'}
          onClick={() => onSwitchMode('shortBreak')}
          className={mode === 'shortBreak' ? 'bg-blue-500 hover:bg-blue-600' : ''}
        >
          Short Break
        </Button>
        <Button
          variant={mode === 'longBreak' ? 'default' : 'outline'}
          onClick={() => onSwitchMode('longBreak')}
          className={mode === 'longBreak' ? 'bg-purple-500 hover:bg-purple-600' : ''}
        >
          Long Break
        </Button>
      </div>

      {mode === 'focus' && (
        <div className="space-y-3">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <Clock className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Duration Presets</span>
          </div>
          
          <div className="flex flex-wrap justify-center gap-2">
            {presetDurations.map((preset) => (
              <Button
                key={preset.minutes}
                variant="outline"
                size="sm"
                onClick={() => handlePresetSelect(preset.minutes)}
                className="text-xs"
              >
                {preset.label}
              </Button>
            ))}
            
            <Dialog open={showCustomDialog} onOpenChange={setShowCustomDialog}>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="text-xs">
                  <Settings className="h-3 w-3 mr-1" />
                  Custom
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle>Custom Duration</DialogTitle>
                  <DialogDescription>
                    Set a custom focus duration (1-180 minutes)
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="custom-minutes">Minutes</Label>
                    <Input
                      id="custom-minutes"
                      type="number"
                      min="1"
                      max="180"
                      value={customMinutes}
                      onChange={(e) => setCustomMinutes(Number(e.target.value))}
                      placeholder="Enter minutes"
                    />
                  </div>
                  <div className="flex space-x-2">
                    <Button onClick={handleCustomSubmit} className="flex-1">
                      Set Duration
                    </Button>
                    <Button variant="outline" onClick={() => setShowCustomDialog(false)} className="flex-1">
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusModeControls;

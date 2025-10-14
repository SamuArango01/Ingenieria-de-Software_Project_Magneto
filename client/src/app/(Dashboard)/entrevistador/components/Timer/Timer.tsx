// src/app/(Dashboard)/entrevistador/components/Timer/Timer.tsx
import { ClockIcon } from '@heroicons/react/24/outline';

interface TimerProps {
  timeLeft: number;
  totalTime: number;
  isRunning: boolean;
}

export function Timer({ 
  timeLeft, 
  totalTime, 
  isRunning 
}: TimerProps) {
  const displayTime = Math.max(0, timeLeft);
  const progressPercentage = Math.max(0, (displayTime / totalTime) * 100);
  
  const getTimerColor = () => {
    if (displayTime > totalTime * 0.6) return 'text-green-400';
    if (displayTime > totalTime * 0.3) return 'text-yellow-400';
    return 'text-red-400';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-gray-700/50 backdrop-blur-sm border border-gray-600 rounded-lg p-4 min-w-48">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <ClockIcon className="h-4 w-4 text-gray-300" />
          <span className="text-sm font-medium text-gray-300">Tiempo</span>
        </div>
        <div className={`text-lg font-bold ${getTimerColor()}`}>
          {formatTime(displayTime)}
        </div>
      </div>

   
      <div className="w-full bg-gray-600 rounded-full h-1.5 mb-1">
        <div 
          className={`h-1.5 rounded-full transition-all duration-1000 ${
            displayTime > totalTime * 0.6 
              ? 'bg-green-500' 
              : displayTime > totalTime * 0.3 
                ? 'bg-yellow-500' 
                : 'bg-red-500'
          }`}
          style={{ width: `${progressPercentage}%` }}
        />
      </div>

      <div className="flex justify-between text-xs text-gray-400">
        <span>{formatTime(totalTime)}</span>
        <span className={displayTime <= 10 ? 'text-red-400 font-bold' : ''}>
          {isRunning ? '⏰' : '⏸️'}
        </span>
        <span>0:00</span>
      </div>
    </div>
  );
}
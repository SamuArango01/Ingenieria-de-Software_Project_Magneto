'use client';

import { useState, useEffect, useRef } from 'react';

interface UseQuestionTimerProps {
  initialTime: number; // en segundos
  onTimeUp?: () => void;
}

export function useQuestionTimer({ initialTime, onTimeUp }: UseQuestionTimerProps) {
  const [timeLeft, setTimeLeft] = useState(initialTime);
  const [isActive, setIsActive] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onTimeUp?.();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isActive, timeLeft, onTimeUp]);

  const start = () => setIsActive(true);
  const pause = () => setIsActive(false);
  const reset = (newTime?: number) => {
    setTimeLeft(newTime ?? initialTime);
    setIsActive(false);
  };

  return {
    timeLeft,
    isActive,
    start,
    pause,
    reset,
  };
}

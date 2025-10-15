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
  const onTimeUpRef = useRef(onTimeUp);

  // Mantener la referencia actualizada
  useEffect(() => {
    onTimeUpRef.current = onTimeUp;
  }, [onTimeUp]);

  useEffect(() => {
    if (isActive) {
      intervalRef.current = setInterval(() => {
        setTimeLeft((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            onTimeUpRef.current?.();
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
  }, [isActive]);

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

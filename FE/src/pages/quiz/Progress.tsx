import * as Progress from '@radix-ui/react-progress';
import { useState, useEffect } from 'react';
import '@/index.css';

interface QuizProgressProps {
  timeout?: number;
  onTimeout?: () => void;
  className?: string;
  startProgress?: boolean;
  isPaused?: boolean; // Add a new prop to pause the timer when an answer is selected
}

function QuizProgress({
  timeout = 0,
  onTimeout = () => {},
  className = '',
  startProgress = false,
  isPaused = false,
}: QuizProgressProps) {
  const [remainingTime, setRemainingTime] = useState<number>(timeout);
  const [hasTimedOut, setHasTimedOut] = useState<boolean>(false);

  // Reset timer when timeout changes
  useEffect(() => {
    setRemainingTime(timeout);
    setHasTimedOut(false);
  }, [timeout]);

  // Handle timeout effect
  useEffect(() => {
    if (timeout <= 0 || !startProgress || isPaused) return;

    let timer: NodeJS.Timeout | null = null;

    if (remainingTime <= 0 && !hasTimedOut) {
      setHasTimedOut(true);
      onTimeout();
    } else if (remainingTime > 0) {
      timer = setTimeout(() => {
        onTimeout();
        setHasTimedOut(true);
      }, remainingTime);
    }

    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeout, onTimeout, remainingTime, startProgress, isPaused, hasTimedOut]);

  // Countdown timer
  useEffect(() => {
    if (timeout <= 0 || !startProgress || isPaused) return;

    const interval = setInterval(() => {
      setRemainingTime((prevRemainingTime) => {
        return Math.max(0, prevRemainingTime - 1000);
      });
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [timeout, startProgress, isPaused]);

  const progressPercent = timeout > 0 ? (remainingTime / timeout) * 100 : 0;

  return (
    <div className="flex justify-center">
      <Progress.Root
        className={`w-full relative h-3 overflow-hidden rounded-full bg-gray-200 m-10 shadow-9xl drop-shadow-quiz-box ${className}`}
        style={{
          transform: 'translateZ(0)',
        }}
        value={progressPercent}
      >
        <Progress.Indicator
          className={`ease-[cubic-bezier(0.65, 0, 0.35, 1)] size-full ${className} stroke-black stroke-3 transition-transform duration-[660ms]`}
          style={{ transform: `translateX(-${100 - progressPercent}%)` }}
        />
      </Progress.Root>
    </div>
  );
}

export default QuizProgress;

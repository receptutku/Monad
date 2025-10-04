'use client';

import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';

interface CountdownTimerProps {
  endTime: number; // Unix timestamp
  onComplete?: () => void;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'warning' | 'danger';
  showLabels?: boolean;
  className?: string;
}

export const CountdownTimer = ({
  endTime,
  onComplete,
  size = 'md',
  variant = 'default',
  showLabels = true,
  className,
}: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState(0);
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateTimer = () => {
      const now = Date.now() / 1000;
      const remaining = endTime - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        setIsExpired(true);
        if (onComplete) {
          onComplete();
        }
      } else {
        setTimeLeft(remaining);
        setIsExpired(false);
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);

    return () => clearInterval(interval);
  }, [endTime, onComplete]);

  const formatTime = (seconds: number) => {
    const days = Math.floor(seconds / 86400);
    const hours = Math.floor((seconds % 86400) / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = Math.floor(seconds % 60);

    return { days, hours, minutes, seconds: secs };
  };

  const { days, hours, minutes, seconds } = formatTime(timeLeft);

  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  const variantClasses = {
    default: 'text-gray-900',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  };

  if (isExpired) {
    return (
      <div className={cn('text-center', variantClasses.danger, sizeClasses[size], className)}>
        <div className="font-bold">EXPIRED</div>
      </div>
    );
  }

  return (
    <div className={cn('text-center', variantClasses[variant], sizeClasses[size], className)}>
      <div className="flex items-center justify-center gap-2">
        {days > 0 && (
          <div className="flex flex-col items-center">
            <div className="font-bold tabular-nums">{days.toString().padStart(2, '0')}</div>
            {showLabels && <div className="text-xs opacity-75">days</div>}
          </div>
        )}
        
        {days > 0 && <div className="text-lg">:</div>}
        
        <div className="flex flex-col items-center">
          <div className="font-bold tabular-nums">{hours.toString().padStart(2, '0')}</div>
          {showLabels && <div className="text-xs opacity-75">hours</div>}
        </div>
        
        <div className="text-lg">:</div>
        
        <div className="flex flex-col items-center">
          <div className="font-bold tabular-nums">{minutes.toString().padStart(2, '0')}</div>
          {showLabels && <div className="text-xs opacity-75">min</div>}
        </div>
        
        <div className="text-lg">:</div>
        
        <div className="flex flex-col items-center">
          <div className="font-bold tabular-nums">{seconds.toString().padStart(2, '0')}</div>
          {showLabels && <div className="text-xs opacity-75">sec</div>}
        </div>
      </div>
    </div>
  );
};


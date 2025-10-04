'use client';

import { useState, useEffect, ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface FadeInProps {
  children: ReactNode;
  delay?: number;
  duration?: number;
  direction?: 'up' | 'down' | 'left' | 'right' | 'fade';
  className?: string;
}

export const FadeIn = ({
  children,
  delay = 0,
  duration = 500,
  direction = 'fade',
  className,
}: FadeInProps) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  const directionClasses = {
    fade: 'opacity-0',
    up: 'opacity-0 translate-y-4',
    down: 'opacity-0 -translate-y-4',
    left: 'opacity-0 translate-x-4',
    right: 'opacity-0 -translate-x-4',
  };

  const visibleClasses = {
    fade: 'opacity-100',
    up: 'opacity-100 translate-y-0',
    down: 'opacity-100 translate-y-0',
    left: 'opacity-100 translate-x-0',
    right: 'opacity-100 translate-x-0',
  };

  return (
    <div
      className={cn(
        'transition-all ease-out',
        isVisible ? visibleClasses[direction] : directionClasses[direction],
        className
      )}
      style={{
        transitionDuration: `${duration}ms`,
      }}
    >
      {children}
    </div>
  );
};


'use client';

import { ReactNode } from 'react';
import { FadeIn } from './FadeIn';

interface StaggeredListProps {
  children: ReactNode[];
  delay?: number;
  className?: string;
}

export const StaggeredList = ({
  children,
  delay = 100,
  className,
}: StaggeredListProps) => {
  return (
    <div className={className}>
      {children.map((child, index) => (
        <FadeIn
          key={index}
          delay={index * delay}
          direction="up"
          duration={400}
        >
          {child}
        </FadeIn>
      ))}
    </div>
  );
};


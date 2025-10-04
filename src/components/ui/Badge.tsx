'use client';

import { HTMLAttributes, forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface BadgeProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md' | 'lg';
  icon?: React.ReactNode;
}

const Badge = forwardRef<HTMLDivElement, BadgeProps>(
  ({ className, variant = 'default', size = 'md', icon, children, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'inline-flex items-center rounded-full font-medium transition-colors',
          {
            // Default variant
            'bg-gray-100 text-gray-800 border border-gray-200': variant === 'default',
            
            // Success variant
            'bg-green-100 text-green-800 border border-green-200': variant === 'success',
            
            // Warning variant
            'bg-yellow-100 text-yellow-800 border border-yellow-200': variant === 'warning',
            
            // Danger variant
            'bg-red-100 text-red-800 border border-red-200': variant === 'danger',
            
            // Info variant
            'bg-blue-100 text-blue-800 border border-blue-200': variant === 'info',
          },
          {
            'px-2 py-1 text-xs': size === 'sm',
            'px-3 py-1.5 text-sm': size === 'md',
            'px-4 py-2 text-base': size === 'lg',
          },
          className
        )}
        {...props}
      >
        {icon && <span className="mr-1.5">{icon}</span>}
        {children}
      </div>
    );
  }
);

Badge.displayName = 'Badge';

export { Badge };


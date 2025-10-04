'use client';

import { cn } from '@/lib/utils';
import { CheckCircle, Clock, AlertCircle, XCircle } from 'lucide-react';

interface StatusIndicatorProps {
  status: 'success' | 'pending' | 'warning' | 'error' | 'loading';
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  showText?: boolean;
  className?: string;
}

export const StatusIndicator = ({
  status,
  size = 'md',
  showIcon = true,
  showText = false,
  className,
}: StatusIndicatorProps) => {
  const sizeClasses = {
    sm: 'h-3 w-3',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
  };

  const statusConfig = {
    success: {
      icon: CheckCircle,
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      text: 'Success',
    },
    pending: {
      icon: Clock,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      text: 'Pending',
    },
    warning: {
      icon: AlertCircle,
      color: 'text-yellow-600',
      bgColor: 'bg-yellow-100',
      text: 'Warning',
    },
    error: {
      icon: XCircle,
      color: 'text-red-600',
      bgColor: 'bg-red-100',
      text: 'Error',
    },
    loading: {
      icon: Clock,
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      text: 'Loading',
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {showIcon && (
        <div className={cn('p-1 rounded-full', config.bgColor)}>
          <Icon className={cn(sizeClasses[size], config.color)} />
        </div>
      )}
      {showText && (
        <span className={cn('text-sm font-medium', config.color)}>
          {config.text}
        </span>
      )}
    </div>
  );
};


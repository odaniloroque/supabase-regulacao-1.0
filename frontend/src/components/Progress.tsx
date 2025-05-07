import React from 'react';
import { twMerge } from 'tailwind-merge';

interface ProgressProps {
  value: number;
  max?: number;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'primary' | 'success' | 'warning' | 'danger';
  showValue?: boolean;
  animated?: boolean;
  className?: string;
}

const Progress: React.FC<ProgressProps> = ({
  value,
  max = 100,
  size = 'md',
  variant = 'primary',
  showValue = false,
  animated = false,
  className
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-4'
  };

  const variants = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const percentage = Math.min(100, Math.max(0, (value / max) * 100));

  return (
    <div className={twMerge('w-full', className)}>
      <div className="relative">
        <div
          className={twMerge(
            'w-full bg-gray-200 rounded-full overflow-hidden',
            sizes[size]
          )}
        >
          <div
            className={twMerge(
              'transition-all duration-300 ease-out',
              variants[variant],
              animated && 'animate-pulse',
              sizes[size]
            )}
            style={{ width: `${percentage}%` }}
            role="progressbar"
            aria-valuenow={value}
            aria-valuemin={0}
            aria-valuemax={max}
          />
        </div>
        {showValue && (
          <div className="text-right mt-1">
            <span className="text-sm font-medium text-gray-700">
              {Math.round(percentage)}%
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress; 
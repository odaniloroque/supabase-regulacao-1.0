import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular';
  width?: string | number;
  height?: string | number;
  className?: string;
}

const Skeleton: React.FC<SkeletonProps> = ({
  variant = 'text',
  width,
  height,
  className
}) => {
  const variants = {
    text: 'rounded',
    circular: 'rounded-full',
    rectangular: 'rounded-lg'
  };

  const getHeight = () => {
    if (height) return height;
    if (variant === 'text') return '1em';
    if (variant === 'circular') return width || '40px';
    return '200px';
  };

  return (
    <div
      className={twMerge(
        'animate-pulse bg-gray-200',
        variants[variant],
        className
      )}
      style={{
        width: width || '100%',
        height: getHeight()
      }}
    />
  );
};

interface SkeletonTextProps {
  lines?: number;
  spacing?: string;
  className?: string;
}

export const SkeletonText: React.FC<SkeletonTextProps> = ({
  lines = 3,
  spacing = '0.5rem',
  className
}) => {
  return (
    <div
      className={twMerge('space-y-2', className)}
      style={{ '--spacing': spacing } as React.CSSProperties}
    >
      {Array.from({ length: lines }).map((_, index) => (
        <Skeleton
          key={index}
          variant="text"
          className="w-full"
          style={{ marginBottom: index === lines - 1 ? 0 : spacing }}
        />
      ))}
    </div>
  );
};

interface SkeletonAvatarProps {
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const SkeletonAvatar: React.FC<SkeletonAvatarProps> = ({
  size = 'md',
  className
}) => {
  const sizes = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-12 h-12'
  };

  return <Skeleton variant="circular" className={twMerge(sizes[size], className)} />;
};

interface SkeletonImageProps {
  aspectRatio?: string;
  className?: string;
}

export const SkeletonImage: React.FC<SkeletonImageProps> = ({
  aspectRatio = '16/9',
  className
}) => {
  return (
    <div
      className={twMerge('w-full', className)}
      style={{ aspectRatio }}
    >
      <Skeleton variant="rectangular" className="w-full h-full" />
    </div>
  );
};

export default Skeleton; 
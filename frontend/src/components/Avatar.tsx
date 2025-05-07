import React from 'react';
import { twMerge } from 'tailwind-merge';
import Image from 'next/image';

interface AvatarProps {
  src?: string;
  alt?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  variant?: 'circle' | 'rounded';
  fallback?: string;
  className?: string;
}

const Avatar: React.FC<AvatarProps> = ({
  src,
  alt = '',
  size = 'md',
  variant = 'circle',
  fallback,
  className
}) => {
  const sizes = {
    xs: 'w-6 h-6 text-xs',
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl'
  };

  const variants = {
    circle: 'rounded-full',
    rounded: 'rounded-lg'
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  if (!src && !fallback) {
    return (
      <div
        className={twMerge(
          'bg-gray-200 flex items-center justify-center text-gray-500',
          sizes[size],
          variants[variant],
          className
        )}
      >
        <svg
          className="w-1/2 h-1/2"
          fill="currentColor"
          viewBox="0 0 24 24"
        >
          <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      </div>
    );
  }

  if (src) {
    return (
      <div
        className={twMerge(
          'relative overflow-hidden',
          sizes[size],
          variants[variant],
          className
        )}
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes={size}
        />
      </div>
    );
  }

  return (
    <div
      className={twMerge(
        'bg-blue-600 flex items-center justify-center text-white font-medium',
        sizes[size],
        variants[variant],
        className
      )}
    >
      {getInitials(fallback || '')}
    </div>
  );
};

export default Avatar; 
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  header?: React.ReactNode;
  footer?: React.ReactNode;
}

const Card: React.FC<CardProps> = ({
  children,
  className,
  header,
  footer
}) => {
  return (
    <div className={twMerge(
      'bg-white shadow rounded-lg overflow-hidden',
      className
    )}>
      {header && (
        <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
          {header}
        </div>
      )}
      <div className="px-4 py-5 sm:p-6">
        {children}
      </div>
      {footer && (
        <div className="px-4 py-4 sm:px-6 bg-gray-50 border-t border-gray-200">
          {footer}
        </div>
      )}
    </div>
  );
};

export default Card; 
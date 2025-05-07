import React from 'react';
import { twMerge } from 'tailwind-merge';
import Link from 'next/link';

interface BreadcrumbItem {
  label: string;
  href?: string;
  icon?: React.ReactNode;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
  separator?: 'slash' | 'chevron' | 'dot';
  className?: string;
}

const Breadcrumb: React.FC<BreadcrumbProps> = ({
  items,
  separator = 'slash',
  className
}) => {
  const separators = {
    slash: '/',
    chevron: (
      <svg
        className="h-5 w-5 flex-shrink-0 text-gray-400"
        viewBox="0 0 20 20"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M5.555 17.776l8-16 .894.448-8 16-.894-.448z" />
      </svg>
    ),
    dot: '•'
  };

  return (
    <nav className={twMerge('flex', className)} aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={index} className="flex items-center">
            {index > 0 && (
              <span className="mx-2 text-gray-400" aria-hidden="true">
                {separators[separator]}
              </span>
            )}
            {item.href ? (
              <Link
                href={item.href}
                className={twMerge(
                  'text-sm font-medium text-gray-500 hover:text-gray-700',
                  index === items.length - 1 && 'text-gray-900'
                )}
              >
                <div className="flex items-center space-x-1">
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </Link>
            ) : (
              <span
                className={twMerge(
                  'text-sm font-medium',
                  index === items.length - 1
                    ? 'text-gray-900'
                    : 'text-gray-500'
                )}
              >
                <div className="flex items-center space-x-1">
                  {item.icon && <span className="w-4 h-4">{item.icon}</span>}
                  <span>{item.label}</span>
                </div>
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb; 
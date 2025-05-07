import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  defaultOpen?: string[];
  variant?: 'default' | 'bordered' | 'separated';
  className?: string;
  onChange?: (openItems: string[]) => void;
}

const Accordion: React.FC<AccordionProps> = ({
  items,
  defaultOpen = [],
  variant = 'default',
  className,
  onChange
}) => {
  const [openItems, setOpenItems] = useState<string[]>(defaultOpen);

  const variants = {
    default: {
      item: 'border-b border-gray-200',
      button: 'flex w-full items-center justify-between py-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50',
      content: 'pb-4 text-sm text-gray-500'
    },
    bordered: {
      item: 'border border-gray-200 rounded-lg mb-2',
      button: 'flex w-full items-center justify-between p-4 text-left text-sm font-medium text-gray-900 hover:bg-gray-50 rounded-lg',
      content: 'p-4 pt-0 text-sm text-gray-500'
    },
    separated: {
      item: 'mb-2',
      button: 'flex w-full items-center justify-between p-4 text-left text-sm font-medium text-gray-900 bg-white rounded-lg shadow hover:bg-gray-50',
      content: 'p-4 text-sm text-gray-500 bg-white rounded-lg shadow mt-2'
    }
  };

  const handleToggle = (itemId: string) => {
    const newOpenItems = openItems.includes(itemId)
      ? openItems.filter((id) => id !== itemId)
      : [...openItems, itemId];
    setOpenItems(newOpenItems);
    onChange?.(newOpenItems);
  };

  return (
    <div className={twMerge('divide-y divide-gray-200', className)}>
      {items.map((item) => (
        <div
          key={item.id}
          className={twMerge(
            variants[variant].item,
            item.disabled && 'opacity-50 cursor-not-allowed'
          )}
        >
          <button
            type="button"
            onClick={() => !item.disabled && handleToggle(item.id)}
            disabled={item.disabled}
            className={twMerge(
              variants[variant].button,
              item.disabled && 'cursor-not-allowed'
            )}
            aria-expanded={openItems.includes(item.id)}
            aria-controls={`accordion-content-${item.id}`}
          >
            <div className="flex items-center space-x-2">
              {item.icon && <span className="w-5 h-5">{item.icon}</span>}
              <span>{item.title}</span>
            </div>
            <span className="ml-6 flex-shrink-0">
              <svg
                className={twMerge(
                  'h-6 w-6 transform transition-transform duration-200',
                  openItems.includes(item.id) ? 'rotate-180' : ''
                )}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </span>
          </button>
          <div
            id={`accordion-content-${item.id}`}
            className={twMerge(
              variants[variant].content,
              'transition-all duration-200 ease-in-out',
              openItems.includes(item.id)
                ? 'max-h-96 opacity-100'
                : 'max-h-0 opacity-0 overflow-hidden'
            )}
          >
            {item.content}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Accordion; 
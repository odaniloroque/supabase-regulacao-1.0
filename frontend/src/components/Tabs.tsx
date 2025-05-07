import React, { useState } from 'react';
import { twMerge } from 'tailwind-merge';

interface Tab {
  id: string;
  label: string;
  content: React.ReactNode;
  disabled?: boolean;
  icon?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  defaultTab?: string;
  variant?: 'line' | 'enclosed' | 'soft-rounded' | 'solid-rounded';
  className?: string;
  onChange?: (tabId: string) => void;
}

const Tabs: React.FC<TabsProps> = ({
  tabs,
  defaultTab,
  variant = 'line',
  className,
  onChange
}) => {
  const [activeTab, setActiveTab] = useState(defaultTab || tabs[0]?.id);

  const variants = {
    line: {
      tab: 'border-b-2 border-transparent px-1 pb-4 text-sm font-medium text-gray-500 hover:border-gray-300 hover:text-gray-700',
      active: 'border-blue-500 text-blue-600 hover:border-blue-500 hover:text-blue-600'
    },
    enclosed: {
      tab: 'rounded-t-lg border border-transparent px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-50 hover:text-gray-700',
      active: 'border-gray-200 bg-white text-blue-600 hover:bg-white hover:text-blue-600'
    },
    'soft-rounded': {
      tab: 'rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700',
      active: 'bg-blue-50 text-blue-600 hover:bg-blue-50 hover:text-blue-600'
    },
    'solid-rounded': {
      tab: 'rounded-md px-3 py-2 text-sm font-medium text-gray-500 hover:bg-gray-100 hover:text-gray-700',
      active: 'bg-blue-600 text-white hover:bg-blue-700 hover:text-white'
    }
  };

  const handleTabClick = (tabId: string) => {
    setActiveTab(tabId);
    onChange?.(tabId);
  };

  return (
    <div className={className}>
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8" aria-label="Tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => !tab.disabled && handleTabClick(tab.id)}
              disabled={tab.disabled}
              className={twMerge(
                'inline-flex items-center space-x-2',
                variants[variant].tab,
                activeTab === tab.id && variants[variant].active,
                tab.disabled && 'cursor-not-allowed opacity-50'
              )}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`tabpanel-${tab.id}`}
            >
              {tab.icon && <span className="w-5 h-5">{tab.icon}</span>}
              <span>{tab.label}</span>
            </button>
          ))}
        </nav>
      </div>

      <div className="mt-4">
        {tabs.map((tab) => (
          <div
            key={tab.id}
            role="tabpanel"
            id={`tabpanel-${tab.id}`}
            aria-labelledby={`tab-${tab.id}`}
            className={activeTab === tab.id ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Tabs; 
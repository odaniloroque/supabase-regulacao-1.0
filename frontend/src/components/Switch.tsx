import React from 'react';
import { twMerge } from 'tailwind-merge';

interface SwitchProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  label?: string;
  className?: string;
}

const Switch: React.FC<SwitchProps> = ({
  checked,
  onChange,
  size = 'md',
  color = 'primary',
  disabled = false,
  label,
  className
}) => {
  const sizes = {
    sm: {
      switch: 'w-9 h-5',
      dot: 'w-4 h-4',
      translate: 'translate-x-4'
    },
    md: {
      switch: 'w-11 h-6',
      dot: 'w-5 h-5',
      translate: 'translate-x-5'
    },
    lg: {
      switch: 'w-14 h-7',
      dot: 'w-6 h-6',
      translate: 'translate-x-7'
    }
  };

  const colors = {
    primary: 'bg-blue-600',
    success: 'bg-green-600',
    warning: 'bg-yellow-600',
    danger: 'bg-red-600'
  };

  const handleChange = () => {
    if (!disabled) {
      onChange(!checked);
    }
  };

  return (
    <label
      className={twMerge(
        'inline-flex items-center cursor-pointer',
        disabled && 'cursor-not-allowed opacity-50',
        className
      )}
    >
      <div className="relative">
        <input
          type="checkbox"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
        />
        <div
          className={twMerge(
            'rounded-full transition-colors duration-200 ease-in-out',
            sizes[size].switch,
            checked ? colors[color] : 'bg-gray-200'
          )}
        />
        <div
          className={twMerge(
            'absolute left-0.5 top-0.5 bg-white rounded-full transition-transform duration-200 ease-in-out',
            sizes[size].dot,
            checked && sizes[size].translate
          )}
        />
      </div>
      {label && (
        <span className="ml-3 text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
};

export default Switch; 
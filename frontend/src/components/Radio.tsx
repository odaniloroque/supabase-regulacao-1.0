import React from 'react';
import { twMerge } from 'tailwind-merge';

interface RadioProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'success' | 'warning' | 'danger';
  disabled?: boolean;
  label?: string;
  className?: string;
  name?: string;
  value: string;
}

const Radio: React.FC<RadioProps> = ({
  checked,
  onChange,
  size = 'md',
  color = 'primary',
  disabled = false,
  label,
  className,
  name,
  value
}) => {
  const sizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6'
  };

  const colors = {
    primary: 'text-blue-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600'
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
          type="radio"
          className="sr-only"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          value={value}
        />
        <div
          className={twMerge(
            'border-2 rounded-full transition-colors duration-200 ease-in-out',
            sizes[size],
            checked ? colors[color] : 'border-gray-300',
            disabled && 'border-gray-200'
          )}
        >
          {checked && (
            <div
              className={twMerge(
                'absolute inset-0 flex items-center justify-center',
                colors[color]
              )}
            >
              <div
                className={twMerge(
                  'rounded-full bg-current',
                  size === 'sm' ? 'w-1.5 h-1.5' : size === 'md' ? 'w-2 h-2' : 'w-2.5 h-2.5'
                )}
              />
            </div>
          )}
        </div>
      </div>
      {label && (
        <span className="ml-2 text-sm font-medium text-gray-700">
          {label}
        </span>
      )}
    </label>
  );
};

interface RadioGroupProps {
  value: string;
  onChange: (value: string) => void;
  children: React.ReactNode;
  name: string;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  value,
  onChange,
  children,
  name,
  className
}) => {
  return (
    <div
      role="radiogroup"
      className={twMerge('space-y-2', className)}
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.type === 'radio') {
          onChange(e.target.value);
        }
      }}
    >
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child, {
            name,
            checked: child.props.value === value,
            onChange: () => onChange(child.props.value)
          });
        }
        return child;
      })}
    </div>
  );
};

export default Radio; 
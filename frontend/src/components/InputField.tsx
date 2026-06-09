/**
 * InputField Component
 * 
 * A reusable input field component with enhanced styling and validation support.
 * Designed for mobile-first interactions with clear visual feedback.
 */

import React from 'react';

// Props interface for the InputField component
interface InputFieldProps {
  label: string;           // Label text displayed above the input
  type?: string;           // Input type (text, password, tel, etc.) - defaults to 'text'
  value: string;           // Current value of the input (controlled component)
  onChange: (value: string) => void;  // Handler called when input value changes
  placeholder?: string;    // Placeholder text shown when input is empty
  error?: string;          // Error message to display (shown below input)
  disabled?: boolean;      // Whether the input is disabled
  icon?: React.ReactNode;  // Optional icon to display inside input
}

/**
 * InputField Component
 * 
 * This is a controlled input component that follows React best practices:
 * - Value is controlled by parent component via props
 * - Changes are communicated back via onChange callback
 * - Error states are visually indicated with red border
 * - Enhanced styling for better mobile experience
 */
const InputField: React.FC<InputFieldProps> = ({
  label,
  type = 'text',
  value,
  onChange,
  placeholder,
  error,
  disabled = false,
  icon,
}) => {
  return (
    <div className="mb-5">
      {/* Label */}
      <label className="block text-sm font-semibold text-gray-700 mb-2">
        {label}
      </label>
      
      {/* Input container with optional icon */}
      <div className="relative">
        {/* Icon */}
        {icon && (
          <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        
        {/* Input field */}
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          disabled={disabled}
          className={`
            w-full 
            ${icon ? 'pl-12' : 'pl-4'} pr-4 py-4
            border-2 rounded-xl 
            text-base
            placeholder:text-gray-400
            focus:ring-4 focus:ring-blue-100 focus:border-blue-500 
            outline-none transition-all duration-200
            ${error 
              ? 'border-red-400 focus:ring-red-100 focus:border-red-500' 
              : 'border-gray-200 hover:border-gray-300'
            }
            ${disabled 
              ? 'bg-gray-100 cursor-not-allowed text-gray-500' 
              : 'bg-white'
            }
          `}
        />
      </div>
      
      {/* Error message - only shown if error prop is provided */}
      {error && (
        <div className="mt-2 flex items-center">
          <svg 
            className="w-4 h-4 text-red-500 mr-1.5 flex-shrink-0" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
            />
          </svg>
          <p className="text-sm text-red-600">
            {error}
          </p>
        </div>
      )}
    </div>
  );
};

export default InputField;
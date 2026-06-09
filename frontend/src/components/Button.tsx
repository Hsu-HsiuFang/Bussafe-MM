/**
 * Button Component
 * 
 * A reusable button component with enhanced 3D styling and multiple variants.
 * Designed for mobile-first touch interactions with large tap targets.
 */

import React from 'react';

// Props interface for the Button component
interface ButtonProps {
  children: React.ReactNode;    // Button text or content
  onClick?: () => void;         // Click handler
  variant?: 'primary' | 'secondary' | 'danger';  // Button style variant
  disabled?: boolean;           // Whether button is disabled
  fullWidth?: boolean;          // Whether button should take full width
  type?: 'button' | 'submit';  // Button type - defaults to 'button'
  icon?: React.ReactNode;       // Optional icon to display
}

/**
 * Button Component
 * 
 * Features:
 * - Enhanced 3D shadow effect for depth
 * - Multiple style variants (primary, secondary, danger)
 * - Large tap targets for mobile (py-4)
 * - Gradient backgrounds for visual appeal
 * - Smooth hover and active state animations
 * - Disabled state with visual feedback
 * - Optional icon support
 * - Full-width layout option
 */
const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  fullWidth = false,
  type = 'button',
  icon,
}) => {
  // Base styles applied to all buttons
  const baseStyles = `
    font-semibold text-base
    py-4 px-6 rounded-xl
    transition-all duration-200
    flex items-center justify-center
    active:scale-[0.98]
    disabled:active:scale-100
  `;

  // Variant-specific styles
  const variantStyles = {
    primary: `
      bg-gradient-to-r from-blue-600 to-blue-700 
      hover:from-blue-700 hover:to-blue-800 
      text-white 
      shadow-lg shadow-blue-500/30
      hover:shadow-xl hover:shadow-blue-500/40
      disabled:from-gray-300 disabled:to-gray-400 
      disabled:text-gray-500
      disabled:shadow-none
    `,
    secondary: `
      bg-white 
      hover:bg-gray-50 
      text-gray-700 
      border-2 border-gray-200
      hover:border-gray-300
      shadow-md
      hover:shadow-lg
      disabled:bg-gray-100 
      disabled:text-gray-400
      disabled:border-gray-200
      disabled:shadow-none
    `,
    danger: `
      bg-gradient-to-r from-red-500 to-red-600 
      hover:from-red-600 hover:to-red-700 
      text-white 
      shadow-lg shadow-red-500/30
      hover:shadow-xl hover:shadow-red-500/40
      disabled:from-gray-300 disabled:to-gray-400 
      disabled:text-gray-500
      disabled:shadow-none
    `,
  };

  // Width style
  const widthStyle = fullWidth ? 'w-full' : '';

  // Cursor style
  const cursorStyle = disabled ? 'cursor-not-allowed' : 'cursor-pointer';

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseStyles}
        ${variantStyles[variant]}
        ${widthStyle}
        ${cursorStyle}
      `}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {children}
    </button>
  );
};

export default Button;
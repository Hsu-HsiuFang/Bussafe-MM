/**
 * Toast Component
 * 
 * A notification component that displays temporary success/error messages.
 * Designed to provide clear feedback for user actions.
 */

import React, { useEffect, useState } from 'react';

// Props interface for Toast component
interface ToastProps {
  message: string;                    // The message to display
  type?: 'success' | 'error' | 'info'; // Toast type for styling
  duration?: number;                  // Duration in ms before auto-dismiss
  onClose: () => void;               // Handler when toast is closed
}

/**
 * Toast Component
 * 
 * Features:
 * - Slide-in animation from top
 * - Auto-dismiss after specified duration
 * - Different styles for success/error/info
 * - Close button for manual dismissal
 * - Accessible with proper ARIA attributes
 */
const Toast: React.FC<ToastProps> = ({
  message,
  type = 'success',
  duration = 3000,
  onClose,
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);

  // Show toast on mount
  useEffect(() => {
    // Trigger entrance animation
    requestAnimationFrame(() => {
      setIsVisible(true);
    });

    // Auto-dismiss after duration
    const timer = setTimeout(() => {
      handleClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration]);

  // Handle close with exit animation
  const handleClose = () => {
    setIsLeaving(true);
    setTimeout(() => {
      onClose();
    }, 300); // Match animation duration
  };

  // Type-specific styles
  const typeStyles = {
    success: {
      bg: 'bg-green-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ),
    },
    error: {
      bg: 'bg-red-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      ),
    },
    info: {
      bg: 'bg-blue-500',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
  };

  const { bg, icon } = typeStyles[type];

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`
        fixed top-4 left-1/2 transform -translate-x-1/2 z-50
        ${bg} text-white px-4 py-3 rounded-xl shadow-lg
        flex items-center space-x-3 min-w-[280px] max-w-[90vw]
        transition-all duration-300 ease-out
        ${isVisible && !isLeaving ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}
      `}
    >
      {/* Icon */}
      <div className="flex-shrink-0">
        {icon}
      </div>
      
      {/* Message */}
      <p className="flex-1 font-medium text-sm">
        {message}
      </p>
      
      {/* Close button */}
      <button
        onClick={handleClose}
        className="flex-shrink-0 p-1 rounded-full hover:bg-white/20 transition-colors"
        aria-label="Close notification"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

export default Toast;
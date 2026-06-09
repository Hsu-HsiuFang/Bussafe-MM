/**
 * PageLayout Component
 * 
 * A reusable layout wrapper component that provides consistent styling
 * across all pages. Implements mobile-first design with centered container.
 */

import React, { useEffect, useState } from 'react';

// Props interface for the PageLayout component
interface PageLayoutProps {
  children: React.ReactNode;    // Page content to render
  showBackButton?: boolean;     // Whether to show back navigation button
  onBack?: () => void;          // Back button click handler
  title?: string;               // Optional page title
}

/**
 * PageLayout Component
 * 
 * Features:
 * - Mobile-first responsive design (max-width 400px)
 * - Centered container with soft gradient background
 * - Rounded card-style sections with soft shadows
 * - Consistent padding and spacing
 * - Optional back button navigation
 * - Optional page title
 * - Calming blue/white safety theme
 */
const PageLayout: React.FC<PageLayoutProps> = ({
  children,
  showBackButton = false,
  onBack,
  title,
}) => {
  // Page transition animation state
  const [isVisible, setIsVisible] = useState(false);

  // Trigger entrance animation on mount
  useEffect(() => {
    requestAnimationFrame(() => {
      setIsVisible(true);
    });
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 safe-area-top safe-area-bottom">
      {/* Container with mobile-first max-width */}
      <div 
        className={`max-w-[400px] mx-auto px-5 py-6 transition-all duration-500 ease-out ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
        }`}
      >
        {/* Header section with optional back button and title */}
        {(showBackButton || title) && (
          <div className="mb-6">
            {/* Back button */}
            {showBackButton && onBack && (
              <button
                onClick={onBack}
                className="flex items-center text-blue-600 hover:text-blue-700 mb-4 transition-colors group"
              >
                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3 group-hover:bg-blue-200 transition-colors">
                  <svg 
                    className="w-5 h-5" 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path 
                      strokeLinecap="round" 
                      strokeLinejoin="round" 
                      strokeWidth={2} 
                      d="M15 19l-7-7 7-7" 
                    />
                  </svg>
                </div>
                <span className="font-medium">Back</span>
              </button>
            )}
            
            {/* Page title */}
            {title && (
              <h1 className="heading-2 text-gray-800">
                {title}
              </h1>
            )}
          </div>
        )}
        
        {/* Main content area with card styling */}
        <div className="card-elevated animate-slide-up">
          {children}
        </div>
        
        {/* Footer with app branding */}
        <div className="mt-8 text-center">
          <div className="flex items-center justify-center space-x-2 mb-2">
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <svg 
                className="w-4 h-4 text-white" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" 
                />
              </svg>
            </div>
            <span className="text-sm font-semibold text-gray-700">BusSafe MM</span>
          </div>
          <p className="caption-text">
            Your Safety Companion
          </p>
        </div>
      </div>
    </div>
  );
};

export default PageLayout;
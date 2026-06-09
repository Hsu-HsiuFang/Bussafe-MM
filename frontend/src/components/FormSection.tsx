/**
 * FormSection Component
 * 
 * A reusable container component for grouping related form fields.
 * Provides consistent styling and optional title/description for form sections.
 */

import React from 'react';

// Props interface for the FormSection component
interface FormSectionProps {
  title?: string;          // Optional section title
  description?: string;    // Optional description text below title
  children: React.ReactNode;  // Form fields to render inside this section
}

/**
 * FormSection Component
 * 
 * Used to organize form fields into logical groups with consistent styling.
 * Helps maintain visual hierarchy and improves form readability.
 */
const FormSection: React.FC<FormSectionProps> = ({
  title,
  description,
  children,
}) => {
  return (
    <div className="mb-6">
      {/* Section title - only shown if provided */}
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-2">
          {title}
        </h3>
      )}
      
      {/* Section description - only shown if provided */}
      {description && (
        <p className="text-sm text-gray-600 mb-4">
          {description}
        </p>
      )}
      
      {/* Form fields container */}
      <div className="space-y-1">
        {children}
      </div>
    </div>
  );
};

export default FormSection;
/**
 * RiskReportPage Component
 * 
 * Allows users to submit a risk report about a bus route or location.
 * Also displays the user's past risk reports fetched from the backend.
 * 
 * Beginner notes:
 *   - This page calls submitRiskReport() from AuthContext
 *   - AuthContext calls the FastAPI backend POST /risk-reports endpoint
 *   - Past reports are fetched via GET /risk-reports and displayed below the form
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { RiskReport } from '../types';
import PageLayout from '../components/PageLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';

interface RiskReportPageProps {
  riskReports: RiskReport[];
  onSubmitReport: (routeName: string, location: string, riskType: string, description?: string) => Promise<{ success: boolean; message: string }>;
}

/** Risk type options shown in the dropdown */
const RISK_TYPES = [
  { value: '', label: 'Select risk type...' },
  { value: 'theft', label: 'Theft / Pickpocketing' },
  { value: 'harassment', label: 'Harassment' },
  { value: 'unsafe_road', label: 'Unsafe Road / Driving' },
  { value: 'accident', label: 'Accident' },
  { value: 'overcrowding', label: 'Overcrowding' },
  { value: 'other', label: 'Other' },
];

const RiskReportPage: React.FC<RiskReportPageProps> = ({
  riskReports,
  onSubmitReport,
}) => {
  const navigate = useNavigate();

  // Form state
  const [routeName, setRouteName] = useState('');
  const [location, setLocation] = useState('');
  const [riskType, setRiskType] = useState('');
  const [description, setDescription] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);

  // Validate form fields
  const getErrors = () => {
    const errors: Record<string, string> = {};

    if (!routeName.trim()) {
      errors.routeName = 'Route name is required';
    }

    if (!location.trim()) {
      errors.location = 'Location is required';
    }

    if (!riskType) {
      errors.riskType = 'Please select a risk type';
    }

    return errors;
  };

  const isFormValid = () => Object.keys(getErrors()).length === 0;

  /**
   * Handle form submission.
   * Calls the backend API via AuthContext to save the risk report in Supabase.
   */
  const handleSubmit = async () => {
    setShowErrors(true);
    if (!isFormValid()) return;

    setIsSubmitting(true);
    setSubmitSuccess(false);

    try {
      const result = await onSubmitReport(
        routeName.trim(),
        location.trim(),
        riskType,
        description.trim() || undefined
      );

      if (result.success) {
        // Clear form on success
        setRouteName('');
        setLocation('');
        setRiskType('');
        setDescription('');
        setShowErrors(false);
        setSubmitSuccess(true);
        // Auto-hide success message after 5 seconds
        setTimeout(() => setSubmitSuccess(false), 5000);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Format an ISO date string into a human-readable format.
   */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  /**
   * Return a human-readable label for a risk type value.
   */
  const getRiskTypeLabel = (value: string) => {
    const found = RISK_TYPES.find((t) => t.value === value);
    return found ? found.label : value;
  };

  /**
   * Return a colour class based on the risk type.
   */
  const getRiskTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      theft: 'bg-orange-100 text-orange-700 border-orange-200',
      harassment: 'bg-red-100 text-red-700 border-red-200',
      unsafe_road: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      accident: 'bg-red-100 text-red-700 border-red-200',
      overcrowding: 'bg-purple-100 text-purple-700 border-purple-200',
      other: 'bg-gray-100 text-gray-700 border-gray-200',
    };
    return colors[type] || colors.other;
  };

  const errors = showErrors ? getErrors() : {};

  return (
    <PageLayout showBackButton onBack={() => navigate('/dashboard')} title="Risk Report">
      {/* Info banner */}
      <div className="mb-6">
        <div className="flex items-center p-4 bg-orange-50 rounded-xl border border-orange-100">
          <svg className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p className="body-text text-orange-800">
            Report unsafe situations to help keep the Myanmar bus community safe.
          </p>
        </div>
      </div>

      {/* Success message */}
      {submitSuccess && (
        <div className="mb-6 p-4 bg-green-50 rounded-xl border border-green-200 animate-slide-up">
          <div className="flex items-center">
            <svg className="w-5 h-5 text-green-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <p className="body-text text-green-800 font-medium">
              Risk report submitted. Thank you for helping keep others safe!
            </p>
          </div>
        </div>
      )}

      {/* Report form */}
      <div className="bg-gradient-to-br from-orange-50 to-orange-100/50 rounded-2xl p-5 mb-6 border border-orange-100">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 text-orange-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Submit New Report
        </h3>

        <div className="space-y-3">
          <InputField
            label="Route Name"
            value={routeName}
            onChange={setRouteName}
            placeholder="e.g., Yangon Circular, Mandalay Express"
            error={errors.routeName}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
              </svg>
            }
          />

          <InputField
            label="Location"
            value={location}
            onChange={setLocation}
            placeholder="e.g., Hledan junction bus stop"
            error={errors.location}
            icon={
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            }
          />

          {/* Risk type dropdown */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Risk Type
            </label>
            <div className="relative">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <select
                value={riskType}
                onChange={(e) => setRiskType(e.target.value)}
                className={`w-full pl-10 pr-4 py-3 rounded-xl border-2 text-sm font-medium transition-colors
                  focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                  ${errors.riskType ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white hover:border-gray-300'}
                `}
                aria-label="Risk Type"
              >
                {RISK_TYPES.map((type) => (
                  <option key={type.value} value={type.value}>
                    {type.label}
                  </option>
                ))}
              </select>
            </div>
            {errors.riskType && (
              <p className="mt-1.5 text-sm text-red-600 flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {errors.riskType}
              </p>
            )}
          </div>

          {/* Description textarea */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-1.5">
              Description <span className="font-normal text-gray-400">(optional)</span>
            </label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the risk situation in detail..."
              rows={3}
              maxLength={1000}
              className="w-full px-4 py-3 rounded-xl border-2 border-gray-200 bg-white text-sm font-medium
                transition-colors hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                resize-none"
              aria-label="Description"
            />
            <p className="text-right text-xs text-gray-400 mt-1">{description.length}/1000</p>
          </div>

          <Button
            onClick={handleSubmit}
            variant="secondary"
            fullWidth
            disabled={!isFormValid() || isSubmitting}
            icon={
              isSubmitting ? (
                <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              )
            }
          >
            {isSubmitting ? 'Submitting Report...' : 'Submit Risk Report'}
          </Button>
        </div>
      </div>

      {/* Past reports section */}
      <div className="mb-6">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          Your Reports ({riskReports.length})
        </h3>

        {riskReports.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="body-text text-gray-500 mb-1">No reports submitted yet</p>
            <p className="caption-text text-gray-400">Your submitted reports will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {riskReports.map((report) => (
              <div
                key={report.id}
                className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-orange-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-orange-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <span className="font-semibold text-gray-800">{report.route_name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full border ${getRiskTypeColor(report.risk_type)}`}>
                    {getRiskTypeLabel(report.risk_type)}
                  </span>
                </div>

                <div className="flex items-center text-sm text-gray-600 mb-1">
                  <svg className="w-4 h-4 mr-1.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                  {report.location}
                </div>

                {report.description && (
                  <p className="text-sm text-gray-500 mt-2 bg-gray-50 rounded-lg p-3">
                    {report.description}
                  </p>
                )}

                {report.created_at && (
                  <p className="text-xs text-gray-400 mt-2">
                    {formatDate(report.created_at)}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Back to dashboard */}
      <Button
        onClick={() => navigate('/dashboard')}
        variant="secondary"
        fullWidth
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
          </svg>
        }
      >
        Back to Dashboard
      </Button>
    </PageLayout>
  );
};

export default RiskReportPage;
/**
 * DashboardPage Component
 * 
 * The main hub of the BusSafe MM application.
 * Displays user info, trusted contacts, recent alerts,
 * recent risk reports, and the Silent Alert button.
 * 
 * Beginner notes:
 *   - All data (contacts, alerts, reports) comes from AuthContext
 *   - AuthContext fetches data from the FastAPI backend on login
 *   - No Supabase keys are exposed here — everything goes through the backend
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { User, Contact, Alert, RiskReport } from '../types';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

interface DashboardPageProps {
  user: User | null;
  contacts: Contact[];
  alerts: Alert[];
  riskReports: RiskReport[];
  onLogout: () => void;
}

const DashboardPage: React.FC<DashboardPageProps> = ({
  user,
  contacts,
  alerts,
  riskReports,
  onLogout,
}) => {
  const navigate = useNavigate();

  // Track which sections are expanded (for mobile-friendly toggling)
  const [showAllAlerts, setShowAllAlerts] = useState(false);
  const [showAllReports, setShowAllReports] = useState(false);

  const handleActivateAlert = () => {
    navigate('/alert');
  };

  const handleLogout = () => {
    onLogout();
    navigate('/');
  };

  /**
   * Format an ISO date string into a compact human-readable format.
   */
  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '';
    try {
      const date = new Date(dateStr);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
    } catch {
      return dateStr;
    }
  };

  /**
   * Return a colour class for alert type badges.
   */
  const getAlertTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      emergency: 'bg-red-100 text-red-700',
      unsafe: 'bg-orange-100 text-orange-700',
      harassment: 'bg-pink-100 text-pink-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  /**
   * Return a colour class for risk type badges.
   */
  const getRiskTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      theft: 'bg-orange-100 text-orange-700',
      harassment: 'bg-red-100 text-red-700',
      unsafe_road: 'bg-yellow-100 text-yellow-700',
      accident: 'bg-red-100 text-red-700',
      overcrowding: 'bg-purple-100 text-purple-700',
      other: 'bg-gray-100 text-gray-700',
    };
    return colors[type] || 'bg-gray-100 text-gray-700';
  };

  // Only show the most recent items by default
  const displayedAlerts = showAllAlerts ? alerts : alerts.slice(0, 3);
  const displayedReports = showAllReports ? riskReports : riskReports.slice(0, 3);

  return (
    <PageLayout title="Dashboard">
      {/* Welcome section */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-4 shadow-lg shadow-blue-200/50">
          <span className="text-3xl font-bold text-blue-700">
            {user?.name.charAt(0).toUpperCase() || 'U'}
          </span>
        </div>
        
        <h2 className="heading-2 text-gray-800 mb-1">
          Welcome, {user?.name || 'User'}!
        </h2>
        <p className="body-text text-gray-600">
          You're protected with BusSafe MM
        </p>
      </div>

      {/* Status cards — 2x2 grid showing key counts */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 text-center border border-blue-100 shadow-sm">
          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-blue-700 mb-1">
            {contacts.length}
          </div>
          <div className="caption-text text-gray-600 font-medium">
            Trusted Contacts
          </div>
        </div>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-5 text-center border border-green-100 shadow-sm">
          <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <div className="text-lg font-bold text-green-700 mb-1">
            Active
          </div>
          <div className="caption-text text-gray-600 font-medium">
            Protection Status
          </div>
        </div>

        <div className="bg-gradient-to-br from-red-50 to-red-100 rounded-2xl p-5 text-center border border-red-100 shadow-sm">
          <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-red-700 mb-1">
            {alerts.length}
          </div>
          <div className="caption-text text-gray-600 font-medium">
            Safety Alerts
          </div>
        </div>

        <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl p-5 text-center border border-orange-100 shadow-sm">
          <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mx-auto mb-3 shadow-md">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <div className="text-3xl font-bold text-orange-700 mb-1">
            {riskReports.length}
          </div>
          <div className="caption-text text-gray-600 font-medium">
            Risk Reports
          </div>
        </div>
      </div>

      {/* Silent Alert section */}
      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-red-50 rounded-2xl p-6 mb-8 border-2 border-red-100 shadow-lg">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-4 shadow-md animate-pulse-soft">
            <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          
          <h3 className="heading-3 text-gray-800 mb-2">
            Silent Alert
          </h3>
          <p className="body-text text-gray-600 mb-5">
            Press the button below if you feel unsafe. 
            Your trusted contacts will be notified immediately with your location.
          </p>
          
          <Button
            onClick={handleActivateAlert}
            variant="danger"
            fullWidth
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            }
          >
            Activate Silent Alert
          </Button>
        </div>
      </div>

      {/* Quick Actions — navigation buttons */}
      <div className="grid grid-cols-2 gap-4 mb-8">
        <button
          onClick={() => navigate('/contacts')}
          className="flex flex-col items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all"
        >
          <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-700 text-sm">Manage Contacts</span>
        </button>

        <button
          onClick={() => navigate('/risk-report')}
          className="flex flex-col items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-orange-200 hover:bg-orange-50 transition-all"
        >
          <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center mb-3">
            <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <span className="font-semibold text-gray-700 text-sm">Report Risk</span>
        </button>
      </div>

      {/* Trusted contacts list */}
      <div className="mb-6">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          Your Trusted Contacts
        </h3>
        
        {contacts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <p className="body-text text-gray-500">No contacts added yet</p>
            <button
              onClick={() => navigate('/contacts')}
              className="mt-3 text-sm text-blue-600 font-medium hover:underline"
            >
              Add your first contact →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div 
                key={contact.id}
                className="flex items-center p-4 bg-white border-2 border-gray-100 rounded-xl hover:border-blue-200 transition-colors"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <span className="text-blue-700 font-bold text-lg">
                    {contact.name.charAt(0).toUpperCase()}
                  </span>
                </div>
                
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="caption-text text-gray-500 flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                    {contact.phone}
                  </p>
                </div>
                
                <div className="w-3 h-3 bg-green-500 rounded-full shadow-sm"></div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Recent Alerts section — fetched from backend */}
      <div className="mb-6">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
          Recent Alerts
        </h3>

        {alerts.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            <p className="body-text text-gray-500">No alerts sent yet</p>
            <p className="caption-text text-gray-400">Your safety alerts will appear here</p>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedAlerts.map((alert) => (
              <div
                key={alert.id}
                className="bg-white border-2 border-gray-100 rounded-xl p-4 hover:border-red-200 transition-colors"
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center">
                    <svg className="w-5 h-5 text-red-500 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                    </svg>
                    <span className="font-semibold text-gray-800">{alert.route_name}</span>
                  </div>
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getAlertTypeColor(alert.alert_type)}`}>
                    {alert.alert_type}
                  </span>
                </div>

                {alert.bus_number && (
                  <p className="text-sm text-gray-600 mb-1">Bus: {alert.bus_number}</p>
                )}
                {alert.current_location && (
                  <p className="text-sm text-gray-600 mb-1">📍 {alert.current_location}</p>
                )}
                {alert.message && (
                  <p className="text-sm text-gray-500 mt-1 bg-gray-50 rounded-lg p-2">{alert.message}</p>
                )}
                <div className="flex items-center justify-between mt-2">
                  <p className="text-xs text-gray-400">{formatDate(alert.created_at)}</p>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    alert.status === 'sent' ? 'bg-blue-100 text-blue-700' :
                    alert.status === 'acknowledged' ? 'bg-yellow-100 text-yellow-700' :
                    'bg-green-100 text-green-700'
                  }`}>
                    {alert.status}
                  </span>
                </div>
              </div>
            ))}

            {alerts.length > 3 && (
              <button
                onClick={() => setShowAllAlerts(!showAllAlerts)}
                className="w-full text-center py-3 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-xl transition-colors"
              >
                {showAllAlerts ? 'Show Less' : `View All ${alerts.length} Alerts`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Recent Risk Reports section — fetched from backend */}
      <div className="mb-6">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 mr-2 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          Recent Risk Reports
        </h3>

        {riskReports.length === 0 ? (
          <div className="text-center py-8 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <svg className="w-12 h-12 text-gray-300 mx-auto mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
            <p className="body-text text-gray-500">No reports submitted yet</p>
            <button
              onClick={() => navigate('/risk-report')}
              className="mt-3 text-sm text-orange-600 font-medium hover:underline"
            >
              Submit a risk report →
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {displayedReports.map((report) => (
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
                  <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${getRiskTypeColor(report.risk_type)}`}>
                    {report.risk_type.replace('_', ' ')}
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
                  <p className="text-sm text-gray-500 mt-1 bg-gray-50 rounded-lg p-2">{report.description}</p>
                )}

                {report.created_at && (
                  <p className="text-xs text-gray-400 mt-2">{formatDate(report.created_at)}</p>
                )}
              </div>
            ))}

            {riskReports.length > 3 && (
              <button
                onClick={() => setShowAllReports(!showAllReports)}
                className="w-full text-center py-3 text-sm text-orange-600 font-medium hover:bg-orange-50 rounded-xl transition-colors"
              >
                {showAllReports ? 'Show Less' : `View All ${riskReports.length} Reports`}
              </button>
            )}
          </div>
        )}
      </div>

      {/* Safety tips */}
      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 border border-blue-100 mb-6">
        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
          <svg className="w-5 h-5 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Safety Tips
        </h4>
        <ul className="space-y-2">
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="caption-text text-gray-700">Stay aware of your surroundings</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="caption-text text-gray-700">Keep your phone accessible</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="caption-text text-gray-700">Trust your instincts</span>
          </li>
          <li className="flex items-start">
            <svg className="w-4 h-4 text-blue-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="caption-text text-gray-700">Know your emergency exits</span>
          </li>
        </ul>
      </div>

      {/* Data stored notice */}
      <div className="bg-green-50 rounded-xl p-4 border border-green-100 mb-4">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-green-600 mr-2 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
          <p className="caption-text text-green-700">
            Your data is securely stored in our database and synced across sessions.
          </p>
        </div>
      </div>

      {/* Logout button */}
      <Button
        onClick={handleLogout}
        variant="secondary"
        fullWidth
        icon={
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        }
      >
        Log Out
      </Button>
    </PageLayout>
  );
};

export default DashboardPage;
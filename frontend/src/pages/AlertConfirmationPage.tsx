/**
 * AlertConfirmationPage Component
 * 
 * Displays confirmation after Silent Alert is activated.
 * Now sends route/alert data to the backend.
 */

import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../types';
import PageLayout from '../components/PageLayout';
import Button from '../components/Button';

interface AlertConfirmationPageProps {
  contacts: Contact[];
  onActivateAlert: (routeName: string, alertType: string, busNumber?: string, currentLocation?: string, message?: string) => Promise<{ success: boolean; message: string }>;
}

const AlertConfirmationPage: React.FC<AlertConfirmationPageProps> = ({
  contacts,
  onActivateAlert,
}) => {
  const navigate = useNavigate();
  
  const [showContent, setShowContent] = useState(false);
  const [locationShared, setLocationShared] = useState(false);
  const [alertTimestamp, setAlertTimestamp] = useState('');
  const [alertStatus, setAlertStatus] = useState<'sending' | 'sent' | 'error'>('sending');

  const hasActivatedRef = useRef(false);

useEffect(() => {
  if (hasActivatedRef.current) return;
  hasActivatedRef.current = true;

  const now = new Date();

  setAlertTimestamp(
    now.toLocaleString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true,
    })
  );

  const activate = async () => {
    const result = await onActivateAlert(
      'Emergency Route',
      'emergency',
      undefined,
      undefined,
      'Silent alert activated from app'
    );

    setAlertStatus(result.success ? 'sent' : 'error');
  };

  const contentTimer = setTimeout(() => setShowContent(true), 500);
  const locationTimer = setTimeout(() => setLocationShared(true), 1500);

  activate();

  return () => {
    clearTimeout(contentTimer);
    clearTimeout(locationTimer);
  };
}, [onActivateAlert]);

  return (
    <PageLayout title="Alert Activated">
      <div className="text-center mb-8">
        <div className={`inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-red-100 to-red-200 rounded-full mb-5 shadow-lg shadow-red-200/50 ${showContent ? 'animate-pulse-soft' : ''}`}>
          <svg className="w-14 h-14 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
          </svg>
        </div>
        <h2 className="heading-1 text-gray-800 mb-2">
          {alertStatus === 'sending' ? 'Activating Alert...' : alertStatus === 'sent' ? 'Silent Alert Sent!' : 'Alert Activated Locally'}
        </h2>
        <p className="body-text text-gray-600">
          {alertStatus === 'sent' ? 'Your trusted contacts have been notified' : 'Processing your alert...'}
        </p>
        {alertTimestamp && <p className="caption-text text-gray-500 mt-2">Alert triggered at {alertTimestamp}</p>}
      </div>

      {showContent && (
        <div className="space-y-4 mb-8 animate-slide-up">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-5 border border-blue-100">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <span className="font-semibold text-gray-800">Alert sent to {contacts.length} contact{contacts.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="space-y-2">
              {contacts.map((contact) => (
                <div key={contact.id} className="flex items-center text-sm text-gray-700 bg-white rounded-lg p-3">
                  <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center mr-3">
                    <span className="text-blue-700 text-xs font-bold">{contact.name.charAt(0).toUpperCase()}</span>
                  </div>
                  <span className="font-medium">{contact.name}</span>
                  <span className="text-gray-500 ml-auto">{contact.phone}</span>
                </div>
              ))}
            </div>
          </div>

          <div className={`rounded-2xl p-5 border ${locationShared ? 'bg-gradient-to-br from-green-50 to-green-100 border-green-100' : 'bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-100'}`}>
            <div className="flex items-center">
              {locationShared ? (
                <>
                  <div className="w-10 h-10 bg-green-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-green-800 block">Location Shared Successfully</span>
                    <span className="caption-text text-green-700">Your contacts can see your current location</span>
                  </div>
                </>
              ) : (
                <>
                  <div className="w-10 h-10 bg-yellow-600 rounded-full flex items-center justify-center mr-3 shadow-md animate-spin">
                    <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
                  </div>
                  <div>
                    <span className="font-semibold text-yellow-800 block">Sharing Location...</span>
                    <span className="caption-text text-yellow-700">Please wait while we share your location</span>
                  </div>
                </>
              )}
            </div>
          </div>

          {alertStatus === 'sent' && (
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-4 border border-green-100">
              <div className="flex items-center">
                <div className="w-8 h-8 bg-green-600 rounded-full flex items-center justify-center mr-3 shadow-md">
                  <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                </div>
                <span className="text-sm font-medium text-green-800">Alert logged to database successfully</span>
              </div>
            </div>
          )}
        </div>
      )}

      {showContent && (
        <div className="mb-8 animate-slide-up">
          <h3 className="heading-3 text-gray-800 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 gap-4">
            <button className="flex flex-col items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
              </div>
              <span className="font-semibold text-gray-700">Add Quick Note</span>
              <span className="caption-text text-gray-500 mt-1">(Simulated)</span>
            </button>
            <button className="flex flex-col items-center p-5 bg-white border-2 border-gray-100 rounded-2xl hover:border-blue-200 hover:bg-blue-50 transition-all">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" /></svg>
              </div>
              <span className="font-semibold text-gray-700">Record Audio</span>
              <span className="caption-text text-gray-500 mt-1">(Simulated)</span>
            </button>
          </div>
        </div>
      )}

      {showContent && (
        <div className="bg-gradient-to-br from-red-50 to-orange-50 rounded-2xl p-5 mb-8 border border-red-100 animate-slide-up">
          <h3 className="font-semibold text-red-800 mb-4 flex items-center">
            <div className="w-8 h-8 bg-red-600 rounded-full flex items-center justify-center mr-3">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
            </div>
            Safety Guidance
          </h3>
          <ul className="space-y-3">
            <li className="flex items-start"><svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-sm text-red-700">Move closer to the driver</span></li>
            <li className="flex items-start"><svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-sm text-red-700">Stay near crowded areas</span></li>
            <li className="flex items-start"><svg className="w-5 h-5 text-red-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg><span className="text-sm text-red-700">Be alert and protect your belongings</span></li>
          </ul>
        </div>
      )}

      {showContent && (
        <div className="animate-slide-up">
          <Button onClick={() => navigate('/dashboard')} fullWidth
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>}>
            Return to Dashboard
          </Button>
        </div>
      )}

      {showContent && (
        <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100 text-center animate-slide-up">
          <p className="caption-text text-gray-600">In case of emergency, call local emergency services immediately.</p>
        </div>
      )}
    </PageLayout>
  );
};

export default AlertConfirmationPage;
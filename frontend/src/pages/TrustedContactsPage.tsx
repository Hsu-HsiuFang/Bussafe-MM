/**
 * TrustedContactsPage Component
 * 
 * Allows users to add and manage their trusted contacts.
 * Now includes relationship field for the new backend schema.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import type { Contact } from '../types';
import PageLayout from '../components/PageLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { validateMyanmarPhone } from '../utils/phoneValidation';

interface TrustedContactsPageProps {
  contacts: Contact[];
  onAddContact: (contactName: string, contactPhone: string, relationship: string) => Promise<{ success: boolean; message: string }>;
}

const TrustedContactsPage: React.FC<TrustedContactsPageProps> = ({
  contacts,
  onAddContact,
}) => {
  const navigate = useNavigate();
  
  const [contactName, setContactName] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [hasConsented, setHasConsented] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const handleAddContact = async () => {
    setShowErrors(true);
    if (!contactName.trim() || !relationship.trim()) return;
    const phoneValidation = validateMyanmarPhone(contactPhone);
    if (!phoneValidation.isValid) return;
    
    setIsAdding(true);
    try {
      const result = await onAddContact(contactName.trim(), contactPhone.trim(), relationship.trim());
      if (result.success) {
        setContactName('');
        setContactPhone('');
        setRelationship('');
        setShowErrors(false);
      }
    } finally {
      setIsAdding(false);
    }
  };

  const canContinue = contacts.length > 0;

  return (
    <PageLayout showBackButton onBack={() => navigate('/create-account')} title="Add Trusted Contacts">
      <div className="mb-6">
        <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="body-text text-blue-800">
            Add people you trust who will be notified in case of an emergency.
          </p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-2xl p-5 mb-6 border border-blue-100">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          Add New Contact
        </h3>
        
        <div className="space-y-3">
          <InputField label="Contact Name" value={contactName} onChange={setContactName} placeholder="e.g., Mom, Dad, Friend"
            error={showErrors && !contactName.trim() ? 'Contact name is required' : undefined}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />

          <InputField label="Contact Phone" type="tel" value={contactPhone} onChange={setContactPhone} placeholder="Enter phone number"
            error={showErrors ? validateMyanmarPhone(contactPhone).error : undefined}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />

          <InputField label="Relationship" value={relationship} onChange={setRelationship} placeholder="e.g., Mother, Friend, Sibling"
            error={showErrors && !relationship.trim() ? 'Relationship is required' : undefined}
            icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>} />

          <div className="bg-white rounded-xl p-4 border border-gray-200">
            <div className="flex items-start">
              <input type="checkbox" id="consent" checked={hasConsented} onChange={(e) => setHasConsented(e.target.checked)}
                className="mt-1 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500" />
              <label htmlFor="consent" className="ml-3 text-sm text-gray-700">
                <span className="font-medium">I consent</span> to storing my contact's information for emergency alert purposes only.
              </label>
            </div>
          </div>

          <Button onClick={handleAddContact} variant="secondary" fullWidth
            disabled={!contactName.trim() || !validateMyanmarPhone(contactPhone).isValid || !relationship.trim() || !hasConsented || isAdding}
            icon={isAdding ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
            )}>
            {isAdding ? 'Adding...' : 'Add Contact'}
          </Button>
        </div>
      </div>

      {/* Contacts list */}
      <div className="mb-6">
        <h3 className="heading-3 text-gray-800 mb-4 flex items-center">
          Your Trusted Contacts ({contacts.length})
        </h3>
        
        {contacts.length === 0 ? (
          <div className="text-center py-10 bg-gray-50 rounded-2xl border-2 border-dashed border-gray-200">
            <p className="body-text text-gray-500 mb-1">No contacts added yet</p>
            <p className="caption-text text-gray-400">Add at least one contact to continue</p>
          </div>
        ) : (
          <div className="space-y-3">
            {contacts.map((contact) => (
              <div key={contact.id} className="flex items-center p-4 bg-white border-2 border-gray-100 rounded-xl">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full flex items-center justify-center mr-4 shadow-sm">
                  <span className="text-blue-700 font-bold text-lg">{contact.name.charAt(0).toUpperCase()}</span>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-gray-800">{contact.name}</p>
                  <p className="caption-text text-gray-500">{contact.phone}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Button onClick={() => navigate('/dashboard')} disabled={!canContinue} fullWidth
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>}>
        {canContinue ? 'Continue to Dashboard' : 'Add at least one contact'}
      </Button>
    </PageLayout>
  );
};

export default TrustedContactsPage;
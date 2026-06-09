/**
 * CreateAccountPage Component
 * 
 * Collects user information to create a new BusSafe MM account.
 * Now includes email field for the new backend schema.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';
import { validateMyanmarPhone } from '../utils/phoneValidation';

interface CreateAccountPageProps {
  onRegister: (email: string, fullName: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
}

const CreateAccountPage: React.FC<CreateAccountPageProps> = ({ onRegister }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const getErrors = () => {
    const errors: Record<string, string> = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!email.includes('@')) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!fullName.trim()) {
      errors.fullName = 'Full name is required';
    }
    
    const phoneValidation = validateMyanmarPhone(phone);
    if (!phoneValidation.isValid) {
      errors.phone = phoneValidation.error || 'Please enter a valid Myanmar mobile number.';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    } else if (password.length < 6) {
      errors.password = 'Password must be at least 6 characters';
    }
    
    if (!confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    return errors;
  };

  const isFormValid = () => Object.keys(getErrors()).length === 0;

  const handleSubmit = async () => {
    setShowErrors(true);
    if (!isFormValid()) return;

    setIsLoading(true);
    try {
      const result = await onRegister(email.trim(), fullName.trim(), phone.trim(), password);
      if (result.success) navigate('/contacts');
    } finally {
      setIsLoading(false);
    }
  };

  const errors = showErrors ? getErrors() : {};

  return (
    <PageLayout showBackButton onBack={() => navigate('/')} title="Create Account">
      <div className="mb-6">
        <div className="flex items-center p-4 bg-blue-50 rounded-xl border border-blue-100">
          <svg className="w-6 h-6 text-blue-600 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <p className="body-text text-blue-800">
            Join BusSafe MM to stay protected during your daily commute.
          </p>
        </div>
      </div>

      <div className="space-y-2">
        <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="Enter your email" error={errors.email}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />

        <InputField label="Full Name" value={fullName} onChange={setFullName} placeholder="Enter your full name" error={errors.fullName}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>} />

        <InputField label="Phone Number" type="tel" value={phone} onChange={setPhone} placeholder="Enter your phone number" error={errors.phone}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>} />

        <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Create a password (min. 6 characters)" error={errors.password}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />

        <InputField label="Confirm Password" type="password" value={confirmPassword} onChange={setConfirmPassword} placeholder="Confirm your password" error={errors.confirmPassword}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>} />

        <div className="pt-4">
          <Button onClick={handleSubmit} disabled={!isFormValid() || isLoading} fullWidth
            icon={isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
            )}>
            {isLoading ? 'Creating Account...' : 'Continue'}
          </Button>
        </div>
      </div>

      <div className="mt-6 p-4 bg-gray-50 rounded-xl border border-gray-100">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-gray-500 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
          <p className="caption-text text-gray-600">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
            Your data is stored securely and never shared without your consent.
          </p>
        </div>
      </div>
    </PageLayout>
  );
};

export default CreateAccountPage;
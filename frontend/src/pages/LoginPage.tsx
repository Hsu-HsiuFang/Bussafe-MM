/**
 * LoginPage Component
 * 
 * Entry point of BusSafe MM. Users log in with email + password.
 */

import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import InputField from '../components/InputField';
import Button from '../components/Button';

interface LoginPageProps {
  onLogin: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  onCreateAccount: () => void;
}

const LoginPage: React.FC<LoginPageProps> = ({ onLogin, onCreateAccount }) => {
  const navigate = useNavigate();
  
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showErrors, setShowErrors] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    setShowErrors(true);
    if (!email.trim() || !password.trim()) return;

    setIsLoading(true);
    try {
      const result = await onLogin(email.trim(), password);
      if (result.success) navigate('/dashboard');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoToCreateAccount = () => {
    onCreateAccount();
    navigate('/create-account');
  };

  const isFormValid = email.trim() !== '' && password.trim() !== '';

  return (
    <PageLayout>
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-blue-200 rounded-full mb-5 shadow-lg shadow-blue-200/50">
          <svg className="w-14 h-14 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="heading-1 text-gray-800 mb-2">BusSafe MM</h1>
        <p className="body-text text-gray-600">Your Safety Companion on Myanmar Buses</p>
      </div>

      <div className="space-y-2">
        <InputField label="Email" type="email" value={email} onChange={setEmail} placeholder="Enter your email"
          error={showErrors && !email.trim() ? 'Email is required' : undefined}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>} />

        <InputField label="Password" type="password" value={password} onChange={setPassword} placeholder="Enter your password"
          error={showErrors && !password.trim() ? 'Password is required' : undefined}
          icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>} />

        <div className="pt-4">
          <Button onClick={handleLogin} disabled={!isFormValid || isLoading} fullWidth
            icon={isLoading ? (
              <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" /></svg>
            )}>
            {isLoading ? 'Logging in...' : 'Log In'}
          </Button>
        </div>
      </div>

      <div className="relative my-8">
        <div className="absolute inset-0 flex items-center"><div className="w-full border-t-2 border-gray-100"></div></div>
        <div className="relative flex justify-center text-sm"><span className="px-4 bg-white text-gray-500 font-medium">New to BusSafe?</span></div>
      </div>

      <Button onClick={handleGoToCreateAccount} variant="secondary" fullWidth
        icon={<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>}>
        Create New Account
      </Button>

      <div className="mt-8 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <div className="flex items-start">
          <svg className="w-5 h-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p className="caption-text text-blue-800">Stay safe during your daily commute with real-time alerts and trusted contacts.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default LoginPage;
/**
 * BusSafe MM - Main Application Component
 * 
 * Root component with React Router and AuthContext.
 */

import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import LoginPage from './pages/LoginPage';
import CreateAccountPage from './pages/CreateAccountPage';
import TrustedContactsPage from './pages/TrustedContactsPage';
import DashboardPage from './pages/DashboardPage';
import AlertConfirmationPage from './pages/AlertConfirmationPage';
import RiskReportPage from './pages/RiskReportPage';
import Toast from './components/Toast';
import { useState } from 'react';

function AppContent() {
  const {
    user,
    contacts,
    alerts,
    riskReports,
    isAuthenticated,
    isLoading,
    signup,
    login,
    logout,
    addContact,
    activateAlert,
    submitRiskReport,
  } = useAuth();

  const [toast, setToast] = useState<{
    message: string;
    type: 'success' | 'error' | 'info';
  } | null>(null);

  const showToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
  };

  const hideToast = () => {
    setToast(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-50 via-white to-blue-50/30 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse-soft">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
          </div>
          <p className="text-gray-600 font-medium">Loading BusSafe MM...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      {toast && (
        <Toast message={toast.message} type={toast.type} onClose={hideToast} />
      )}
      
      <Routes>
        <Route 
          path="/" 
          element={
            isAuthenticated ? (
              <Navigate to="/dashboard" replace />
            ) : (
              <LoginPage
                onLogin={async (email, password) => {
                  const result = await login(email, password);
                  showToast(result.message, result.success ? 'success' : 'error');
                  return result;
                }}
                onCreateAccount={() => {}}
              />
            )
          } 
        />
        
        <Route 
          path="/create-account" 
          element={
            isAuthenticated ? (
              <Navigate to="/contacts" replace />
            ) : (
              <CreateAccountPage 
                onRegister={async (email, fullName, phone, password) => {
                  const result = await signup(email, fullName, phone, password);
                  showToast(result.message, result.success ? 'success' : 'error');
                  return result;
                }}
              />
            )
          } 
        />
        
        <Route 
          path="/contacts" 
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <TrustedContactsPage 
                contacts={contacts}
                onAddContact={async (contactName, contactPhone, relationship) => {
                  const result = await addContact(contactName, contactPhone, relationship);
                  showToast(result.message, result.success ? 'success' : 'error');
                  return result;
                }}
              />
            )
          } 
        />
        
        <Route 
          path="/dashboard" 
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <DashboardPage 
                user={user}
                contacts={contacts}
                alerts={alerts}
                riskReports={riskReports}
                onLogout={logout}
              />
            )
          } 
        />
        
        <Route 
          path="/alert" 
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <AlertConfirmationPage 
                contacts={contacts}
                onActivateAlert={activateAlert}
              />
            )
          } 
        />

        <Route 
          path="/risk-report" 
          element={
            !isAuthenticated ? (
              <Navigate to="/" replace />
            ) : (
              <RiskReportPage
                riskReports={riskReports}
                onSubmitReport={async (routeName, location, riskType, description) => {
                  const result = await submitRiskReport(routeName, location, riskType, description);
                  showToast(result.message, result.success ? 'success' : 'error');
                  return result;
                }}
              />
            )
          } 
        />
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
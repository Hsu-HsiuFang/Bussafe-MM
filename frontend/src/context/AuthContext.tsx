/**
 * BusSafe MM - Authentication Context
 * 
 * Provides authentication state and methods to the entire application.
 * Stores user data in localStorage for persistence across page refreshes.
 */

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { User, Contact, Alert, RiskReport } from '../types';
import * as api from '../services/api';

// ============================================
// TYPES
// ============================================

interface AuthContextType {
  user: User | null;
  contacts: Contact[];
  alerts: Alert[];
  riskReports: RiskReport[];
  isAuthenticated: boolean;
  isLoading: boolean;
  
  signup: (email: string, fullName: string, phone: string, password: string) => Promise<{ success: boolean; message: string }>;
  login: (email: string, password: string) => Promise<{ success: boolean; message: string }>;
  logout: () => void;
  
  fetchContacts: () => Promise<void>;
  addContact: (contactName: string, contactPhone: string, relationship: string) => Promise<{ success: boolean; message: string }>;
  
  activateAlert: (routeName: string, alertType: string, busNumber?: string, currentLocation?: string, message?: string) => Promise<{ success: boolean; message: string }>;
  fetchAlerts: () => Promise<void>;
  
  submitRiskReport: (routeName: string, location: string, riskType: string, description?: string) => Promise<{ success: boolean; message: string }>;
  fetchRiskReports: () => Promise<void>;
}

// ============================================
// CONTEXT
// ============================================

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================================
// PROVIDER COMPONENT
// ============================================

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [riskReports, setRiskReports] = useState<RiskReport[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('bussafe_user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
      } catch {
        localStorage.removeItem('bussafe_user');
      }
    }
    setIsLoading(false);
  }, []);

  // Fetch contacts, alerts, and risk reports whenever user changes
  useEffect(() => {
    if (user?.id) {
      fetchContacts();
      fetchAlerts();
      fetchRiskReports();
    } else {
      setContacts([]);
      setAlerts([]);
      setRiskReports([]);
    }
  }, [user?.id]);

  // ============================================
  // AUTH METHODS
  // ============================================

  const signup = useCallback(async (email: string, fullName: string, phone: string, password: string) => {
    try {
      const response = await api.signupUser(email, fullName, phone, password);
      
      if (response.success && response.user) {
        const userData: User = {
          id: response.user.id,
          name: response.user.full_name,
          phone: response.user.phone,
          email: response.user.email,
          password: '',
        };
        setUser(userData);
        localStorage.setItem('bussafe_user', JSON.stringify(userData));
      }
      
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Signup failed' };
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const response = await api.loginUser(email, password);
      
      if (response.success && response.user) {
        const userData: User = {
          id: response.user.id,
          name: response.user.full_name,
          phone: response.user.phone,
          email: response.user.email,
          password: '',
        };
        setUser(userData);
        localStorage.setItem('bussafe_user', JSON.stringify(userData));
      }
      
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Login failed' };
    }
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    setContacts([]);
    localStorage.removeItem('bussafe_user');
  }, []);

  // ============================================
  // CONTACT METHODS
  // ============================================

  const fetchContacts = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await api.getContacts(user.id);
      if (response.success && response.contacts) {
        const mappedContacts: Contact[] = response.contacts.map((c) => ({
          id: c.id,
          name: c.contact_name,
          phone: c.contact_phone,
        }));
        setContacts(mappedContacts);
      }
    } catch (error) {
      console.error('Failed to fetch contacts:', error);
    }
  }, [user?.id]);

  const addContact = useCallback(async (contactName: string, contactPhone: string, relationship: string) => {
    if (!user?.id) {
      return { success: false, message: 'Please log in first.' };
    }

    try {
      const response = await api.addContact(user.id, contactName, contactPhone, relationship);
      
      if (response.success) {
        await fetchContacts();
      }
      
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to add contact' };
    }
  }, [user?.id, fetchContacts]);

  // ============================================
  // ALERT METHODS
  // ============================================

  /**
   * Fetch all alerts for the current user from the backend.
   * Called automatically when the user logs in.
   */
  const fetchAlerts = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await api.getAlerts(user.id);
      if (response.success && response.alerts) {
        const mappedAlerts: Alert[] = response.alerts.map((a) => ({
          id: a.id,
          user_id: a.user_id,
          route_name: a.route_name,
          bus_number: a.bus_number,
          current_location: a.current_location,
          alert_type: a.alert_type,
          message: a.message,
          status: a.status,
          created_at: a.created_at,
        }));
        setAlerts(mappedAlerts);
      }
    } catch (error) {
      console.error('Failed to fetch alerts:', error);
    }
  }, [user?.id]);

  /**
   * Create a new safety alert and refresh the alerts list.
   */
  const activateAlert = useCallback(async (routeName: string, alertType: string, busNumber?: string, currentLocation?: string, message?: string) => {
    if (!user?.id) {
      return { success: false, message: 'Please log in first.' };
    }

    try {
      const response = await api.createAlert(user.id, routeName, alertType, busNumber, currentLocation, message);
      // Refresh alerts list after creating a new one
      if (response.success) {
        await fetchAlerts();
      }
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to activate alert' };
    }
  }, [user?.id, fetchAlerts]);

  // ============================================
  // RISK REPORT METHODS
  // ============================================

  /**
   * Fetch all risk reports for the current user from the backend.
   * Called automatically when the user logs in.
   */
  const fetchRiskReports = useCallback(async () => {
    if (!user?.id) return;
    
    try {
      const response = await api.getRiskReports(user.id);
      if (response.success && response.reports) {
        const mappedReports: RiskReport[] = response.reports.map((r) => ({
          id: r.id,
          user_id: r.user_id,
          route_name: r.route_name,
          location: r.location,
          risk_type: r.risk_type,
          description: r.description,
          created_at: r.created_at,
        }));
        setRiskReports(mappedReports);
      }
    } catch (error) {
      console.error('Failed to fetch risk reports:', error);
    }
  }, [user?.id]);

  /**
   * Submit a new risk report and refresh the reports list.
   */
  const submitRiskReport = useCallback(async (routeName: string, location: string, riskType: string, description?: string) => {
    if (!user?.id) {
      return { success: false, message: 'Please log in first.' };
    }

    try {
      const response = await api.createRiskReport(user.id, routeName, location, riskType, description);
      // Refresh reports list after submitting a new one
      if (response.success) {
        await fetchRiskReports();
      }
      return { success: response.success, message: response.message };
    } catch (error) {
      return { success: false, message: error instanceof Error ? error.message : 'Failed to submit report' };
    }
  }, [user?.id, fetchRiskReports]);

  // ============================================
  // CONTEXT VALUE
  // ============================================

  const value: AuthContextType = {
    user,
    contacts,
    alerts,
    riskReports,
    isAuthenticated: !!user,
    isLoading,
    signup,
    login,
    logout,
    fetchContacts,
    addContact,
    activateAlert,
    fetchAlerts,
    submitRiskReport,
    fetchRiskReports,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ============================================
// HOOK
// ============================================

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
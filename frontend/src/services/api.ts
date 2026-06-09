/**
 * BusSafe MM - API Service Layer
 * 
 * Centralized API client for communicating with the FastAPI backend.
 * All HTTP requests to the backend go through this module.
 * 
 * Uses the native fetch API with proper error handling.
 */

// API base URL - defaults to localhost:8000 for local development
const API_BASE = import.meta.env.VITE_API_URL || 'http://127.0.0.1:8000';

// ============================================
// TYPES
// ============================================

interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
  user?: UserData;
  contacts?: ContactData[];
  alerts?: AlertData[];
  reports?: RiskReportData[];
}

interface UserData {
  id: string;
  email: string;
  full_name: string;
  phone: string;
  created_at?: string;
}

interface ContactData {
  id: string;
  user_id: string;
  contact_name: string;
  contact_phone: string;
  relationship: string;
  created_at?: string;
}

interface AlertData {
  id: string;
  user_id: string;
  route_name: string;
  bus_number?: string;
  current_location?: string;
  alert_type: string;
  message?: string;
  status: string;
  created_at?: string;
}

interface RiskReportData {
  id: string;
  user_id: string;
  route_name: string;
  location: string;
  risk_type: string;
  description?: string;
  created_at?: string;
}

// ============================================
// GENERIC FETCH HELPER
// ============================================

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers,
    },
    ...options,
  };

  try {
    const response = await fetch(url, config);
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(
        errorData.detail || errorData.message || `API error: ${response.status}`
      );
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      throw error;
    }
    throw new Error('An unexpected error occurred');
  }
}

// ============================================
// AUTH API
// ============================================

export async function signupUser(
  email: string,
  full_name: string,
  phone: string,
  password: string
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>('/auth/signup', {
    method: 'POST',
    body: JSON.stringify({ email, full_name, phone, password }),
  });
}

export async function loginUser(
  email: string,
  password: string
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

// ============================================
// CONTACTS API
// ============================================

export async function getContacts(userId: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/contacts?user_id=${userId}`, {
    method: 'GET',
  });
}

export async function addContact(
  userId: string,
  contact_name: string,
  contact_phone: string,
  relationship: string
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/contacts?user_id=${userId}`, {
    method: 'POST',
    body: JSON.stringify({ contact_name, contact_phone, relationship }),
  });
}

// ============================================
// ALERTS API
// ============================================

export async function getAlerts(userId: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/alerts?user_id=${userId}`, {
    method: 'GET',
  });
}

export async function createAlert(
  userId: string,
  route_name: string,
  alert_type: string,
  bus_number?: string,
  current_location?: string,
  message?: string
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/alerts?user_id=${userId}`, {
    method: 'POST',
    body: JSON.stringify({ route_name, alert_type, bus_number, current_location, message }),
  });
}

// ============================================
// RISK REPORTS API
// ============================================

export async function getRiskReports(userId: string): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/risk-reports?user_id=${userId}`, {
    method: 'GET',
  });
}

export async function createRiskReport(
  userId: string,
  route_name: string,
  location: string,
  risk_type: string,
  description?: string
): Promise<ApiResponse> {
  return apiRequest<ApiResponse>(`/risk-reports?user_id=${userId}`, {
    method: 'POST',
    body: JSON.stringify({ route_name, location, risk_type, description }),
  });
}

// ============================================
// HEALTH CHECK
// ============================================

export async function healthCheck(): Promise<{ status: string; service: string }> {
  return apiRequest<{ status: string; service: string }>('/health');
}
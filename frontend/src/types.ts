/**
 * BusSafe MM - TypeScript Type Definitions
 * 
 * This file contains all the TypeScript interfaces used throughout the application.
 * These types ensure type safety and help catch errors during development.
 */

/**
 * User interface - represents the user account information
 * Collected during the Create Account flow
 */
export interface User {
  id?: string;         // Unique identifier (from Supabase)
  email?: string;      // User's email address
  name: string;        // User's full name
  phone: string;       // Phone number (primary identifier)
  password: string;    // Account password (empty string when stored locally)
}

/**
 * Contact interface - represents a trusted contact
 * Users can add multiple trusted contacts who will receive alerts
 */
export interface Contact {
  id: string;          // Unique identifier for the contact
  name: string;        // Contact's name
  phone: string;       // Contact's phone number
}

/**
 * Alert interface - represents a safety alert sent by the user
 * Alerts are created when a user feels unsafe and triggers Silent Alert
 */
export interface Alert {
  id: string;                  // Unique identifier for the alert
  user_id: string;             // ID of the user who sent the alert
  route_name: string;          // Bus route name (e.g., "Yangon-Mandalay Express")
  bus_number?: string;         // Bus number/plate (optional)
  current_location?: string;   // User's current location description
  alert_type: string;          // Type of alert (emergency, unsafe, harassment)
  message?: string;            // Additional details about the alert
  status: string;              // Alert status (sent, acknowledged, resolved)
  created_at?: string;         // When the alert was created
}

/**
 * RiskReport interface - represents a risk report submitted by the user
 * Users report unsafe routes, locations, or situations to help others
 */
export interface RiskReport {
  id: string;                  // Unique identifier for the report
  user_id: string;             // ID of the user who submitted the report
  route_name: string;          // Bus route name
  location: string;            // Specific location of the risk
  risk_type: string;           // Type of risk (theft, harassment, unsafe road, etc.)
  description?: string;        // Detailed description of the risk
  created_at?: string;         // When the report was submitted
}

/**
 * AppState interface - represents the central application state
 * This state is managed in App.tsx and shared across all pages
 */
export interface AppState {
  user: User | null;           // Current user information (null if not created)
  contacts: Contact[];         // Array of trusted contacts
  isAuthenticated: boolean;    // Whether user has completed account creation
}

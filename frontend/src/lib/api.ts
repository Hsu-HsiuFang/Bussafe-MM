/**
 * BusSafe MM - API Helper (lib)
 * ================================
 * This file is the public-facing API import path.
 * It re-exports everything from the actual service implementation
 * located at ../services/api.ts
 *
 * Beginner notes:
 *   - This "barrel file" lets other parts of the app import from
 *     "@/lib/api" instead of remembering the deeper path.
 *   - All real logic lives in services/api.ts — nothing is duplicated here.
 *   - The frontend NEVER talks to Supabase directly. Every request
 *     goes through the FastAPI backend (http://localhost:8000).
 */

// Re-export every named export from the real API service
export {
  signupUser,
  loginUser,
  getContacts,
  addContact,
  getAlerts,
  createAlert,
  getRiskReports,
  createRiskReport,
  healthCheck,
} from '../services/api';
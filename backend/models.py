"""
BusSafe MM - Data Models
=========================
Pydantic models define the "shape" of data coming into and out of the API.
They automatically validate that the data is correct before we use it.

Beginner notes:
  - Each class below represents one type of API request or response
  - "Field()" adds validation rules (min length, max length, etc.)
  - "Optional" means the field can be None (not required)
  - FastAPI uses these models to auto-validate all incoming JSON data
"""

from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import datetime


# ============================================
# AUTHENTICATION MODELS
# ============================================

class SignupRequest(BaseModel):
    """
    Data needed when a user creates an account.
    Sent from the frontend when the signup form is submitted.
    """
    email: str = Field(..., min_length=3, max_length=255, description="User's email address")
    full_name: str = Field(..., min_length=1, max_length=100, description="User's full name")
    phone: str = Field(..., min_length=8, max_length=20, description="User's phone number")
    password: str = Field(..., min_length=6, max_length=100, description="Account password (min 6 chars)")


class LoginRequest(BaseModel):
    """
    Data needed when a user logs in.
    Uses email + password for authentication.
    """
    email: str = Field(..., description="User's email address")
    password: str = Field(..., description="Account password")


class UserResponse(BaseModel):
    """
    User data returned by the API (never includes password).
    """
    id: str
    email: str
    full_name: str
    phone: str
    created_at: Optional[str] = None


class AuthResponse(BaseModel):
    """
    Response wrapper for authentication endpoints.
    Includes success status, a message, and optionally user data.
    """
    success: bool
    message: str
    user: Optional[UserResponse] = None


# ============================================
# TRUSTED CONTACTS MODELS
# ============================================

class ContactCreateRequest(BaseModel):
    """
    Data needed to add a new trusted contact.
    The relationship field helps identify who this person is (e.g., "Mother", "Friend").
    """
    contact_name: str = Field(..., min_length=1, max_length=100, description="Contact's name")
    contact_phone: str = Field(..., min_length=8, max_length=20, description="Contact's phone number")
    relationship: str = Field(..., min_length=1, max_length=50, description="Relationship to user (e.g., Mother, Friend)")


class ContactResponse(BaseModel):
    """
    Contact data returned by the API.
    """
    id: str
    user_id: str
    contact_name: str
    contact_phone: str
    relationship: str
    created_at: Optional[str] = None


class ContactsListResponse(BaseModel):
    """
    Response containing a list of contacts.
    """
    success: bool
    contacts: List[ContactResponse] = []


# ============================================
# SAFETY ALERTS MODELS
# ============================================

class AlertCreateRequest(BaseModel):
    """
    Data needed to send a safety alert.
    Includes bus route info and the user's current location.
    """
    route_name: str = Field(..., min_length=1, max_length=100, description="Bus route name (e.g., Yangon-Mandalay)")
    bus_number: Optional[str] = Field(None, max_length=50, description="Bus number/plate (optional)")
    current_location: Optional[str] = Field(None, max_length=255, description="User's current location description")
    alert_type: str = Field(..., min_length=1, max_length=50, description="Type of alert (e.g., emergency, unsafe, harassment)")
    message: Optional[str] = Field(None, max_length=500, description="Additional details about the alert")


class AlertResponse(BaseModel):
    """
    Alert data returned by the API.
    """
    id: str
    user_id: str
    route_name: str
    bus_number: Optional[str] = None
    current_location: Optional[str] = None
    alert_type: str
    message: Optional[str] = None
    status: str = "sent"
    created_at: Optional[str] = None


class AlertsListResponse(BaseModel):
    """
    Response containing a list of alerts.
    """
    success: bool
    alerts: List[AlertResponse] = []


# ============================================
# RISK REPORTS MODELS
# ============================================

class RiskReportCreateRequest(BaseModel):
    """
    Data needed to submit a risk report.
    Users report unsafe routes, locations, or situations.
    """
    route_name: str = Field(..., min_length=1, max_length=100, description="Bus route name")
    location: str = Field(..., min_length=1, max_length=255, description="Specific location of the risk")
    risk_type: str = Field(..., min_length=1, max_length=50, description="Type of risk (e.g., theft, unsafe road, harassment)")
    description: Optional[str] = Field(None, max_length=1000, description="Detailed description of the risk")


class RiskReportResponse(BaseModel):
    """
    Risk report data returned by the API.
    """
    id: str
    user_id: str
    route_name: str
    location: str
    risk_type: str
    description: Optional[str] = None
    created_at: Optional[str] = None


class RiskReportsListResponse(BaseModel):
    """
    Response containing a list of risk reports.
    """
    success: bool
    reports: List[RiskReportResponse] = []


# ============================================
# GENERIC RESPONSE MODEL
# ============================================

class ApiResponse(BaseModel):
    """
    A simple response for operations that just need success/failure + message.
    Used for delete operations and other simple confirmations.
    """
    success: bool
    message: str
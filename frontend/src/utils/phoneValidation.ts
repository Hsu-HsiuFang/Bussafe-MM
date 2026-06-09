/**
 * Phone Validation Utility for BusSafe MM
 * 
 * This module provides strong validation for Myanmar mobile phone numbers.
 * Valid formats:
 * - International: +95XXXXXXXXXX (12 characters total)
 * - Local: 09XXXXXXXXX (11 digits total)
 * 
 * This validation improves data quality and ensures emergency contacts
 * are usable when alerts are sent during critical situations.
 */

/**
 * Validates if a phone number is a valid Myanmar mobile number
 * 
 * @param phone - The phone number to validate
 * @returns An object with isValid boolean and error message if invalid
 */
export const validateMyanmarPhone = (phone: string): { isValid: boolean; error?: string } => {
  // Remove whitespace for validation
  const cleanPhone = phone.trim();
  
  // Check if empty
  if (!cleanPhone) {
    return { isValid: false, error: 'Phone number is required' };
  }
  
  // Check for international format (+95XXXXXXXXXX)
  if (cleanPhone.startsWith('+95')) {
    // International format should be +95 followed by 9 digits
    if (cleanPhone.length !== 12) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    // Extract the number after +95
    const numberAfterCode = cleanPhone.substring(3);
    
    // Check if all characters are digits
    if (!/^\d{9}$/.test(numberAfterCode)) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    // Check valid Myanmar mobile prefixes (first 2 digits after country code)
    const prefix = numberAfterCode.substring(0, 2);
    const validPrefixes = ['09', '07', '06', '05', '99', '97', '96', '95'];
    
    if (!validPrefixes.includes(prefix)) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    return { isValid: true };
  }
  
  // Check for local format (09XXXXXXXXX)
  if (cleanPhone.startsWith('09')) {
    // Local format should be 11 digits
    if (cleanPhone.length !== 11) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    // Check if all characters are digits
    if (!/^\d{11}$/.test(cleanPhone)) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    // Check valid Myanmar mobile prefixes (first 2 digits)
    const prefix = cleanPhone.substring(0, 2);
    const validPrefixes = ['09', '07', '06', '05'];
    
    if (!validPrefixes.includes(prefix)) {
      return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
    }
    
    return { isValid: true };
  }
  
  // If it doesn't start with +95 or 09, it's invalid
  return { isValid: false, error: 'Please enter a valid Myanmar mobile number.' };
};

/**
 * Helper function to check if a phone number is valid
 * 
 * @param phone - The phone number to check
 * @returns boolean indicating if the phone is valid
 */
export const isValidMyanmarPhone = (phone: string): boolean => {
  return validateMyanmarPhone(phone).isValid;
};
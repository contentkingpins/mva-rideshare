/**
 * API Integration Utilities
 * This file handles the integration with the AWS API Gateway endpoint
 */

import { v4 as uuidv4 } from 'uuid';
import { getTrustedFormCertUrl } from './trustforms';

interface ApiConfig {
  baseUrl: string;
  path: string;
  useApiKey: boolean;
  apiKey?: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  lead_id?: string;
  error?: string;
}

/**
 * Get API configuration
 */
function getApiConfig(): ApiConfig {
  // Use the API endpoint from the AWS API Gateway screenshot
  const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com';
  const path = process.env.NEXT_PUBLIC_API_PATH || '/commercial-mva-lead-processor';
  
  // API key is not required as per the screenshot
  const useApiKey = false;
  const apiKey = process.env.NEXT_PUBLIC_API_KEY || '';

  return {
    baseUrl,
    path,
    useApiKey,
    apiKey
  };
}

/**
 * Prepare form data for API submission
 */
export function prepareApiData(formData: any): any {
  // Get TrustedForm certificate URL if available
  const trustedFormCertUrl = getTrustedFormCertUrl();
  
  // Generate a unique lead ID
  const lead_id = uuidv4();
  
  // Get current page URL
  const pageUrl = typeof window !== 'undefined' ? window.location.href : '';
  
  // Prepare data object with all required fields
  return {
    // Lead identification
    lead_id,
    
    // Source identification
    source: 'MVA-Rideshare-Website',
    
    // Basic contact information
    firstName: formData.firstName,
    lastName: formData.lastName,
    email: formData.email,
    phone: formData.phone,
    
    // MVA-specific information
    role: formData.role,
    rideshareCompany: formData.rideshareCompany,
    filedComplaint: formData.filedComplaint,
    hasPoliceReport: formData.hasPoliceReport,
    accidentDate: formData.accidentDate,
    wasAmbulanceCalled: formData.wasAmbulanceCalled,
    receivedMedicalTreatment48Hours: formData.receivedMedicalTreatment48Hours,
    receivedMedicalTreatment7Days: formData.receivedMedicalTreatment7Days,
    
    // Lead tracking information
    trustedFormCertUrl,
    pageUrl,
    submitted_at: new Date().toISOString(),
    
    // Additional information
    ...formData
  };
}

/**
 * Submit form data to the AWS API
 */
export async function submitToApi(data: any): Promise<ApiResponse> {
  const config = getApiConfig();
  
  try {
    console.log('[API] Submitting data to API');
    
    // Prepare API request URL
    const apiUrl = `${config.baseUrl}${config.path}`;
    
    // Prepare headers
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    };
    
    // Add API key to headers if required
    if (config.useApiKey && config.apiKey) {
      headers['x-api-key'] = config.apiKey;
    }
    
    // Make the API request
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(data)
    });
    
    // Handle response
    let responseData;
    try {
      responseData = await response.json();
    } catch (err) {
      // Handle case where response is not JSON
      responseData = {
        success: response.ok,
        message: response.ok ? 'Submission successful' : 'Submission failed'
      };
    }
    
    if (!response.ok) {
      console.error('[API] Error submitting to API:', responseData);
      return {
        success: false,
        error: responseData.message || responseData.error || 'Error submitting to API'
      };
    }
    
    console.log('[API] Successfully submitted to API:', responseData);
    return {
      success: true,
      lead_id: responseData.lead_id || data.lead_id,
      message: responseData.message || 'Successfully submitted to API'
    };
  } catch (error) {
    console.error('[API] Exception while submitting to API:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 
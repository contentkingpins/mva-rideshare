/**
 * ActiveProsper TrustForms Integration
 * This file handles the integration with ActiveProsper TrustForms API
 */

interface TrustFormsConfig {
  apiKey: string;
  formId: string;
  endpoint: string;
  certField: string;
}

interface TrustFormsFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  [key: string]: any;
}

interface TrustFormsResponse {
  success: boolean;
  id?: string;
  message?: string;
  error?: string;
}

/**
 * Get ActiveProsper TrustForms configuration
 */
function getTrustFormsConfig(): TrustFormsConfig {
  // Use environment variables for API credentials
  const apiKey = process.env.ACTIVEPROSPER_API_KEY || '';
  const formId = process.env.ACTIVEPROSPER_FORM_ID || '';
  const endpoint = process.env.ACTIVEPROSPER_ENDPOINT || 'https://api.activeprosper.com/v1/forms/submit';
  
  // The TrustedForm certificate field name
  const certField = process.env.TRUSTEDFORM_FIELD || 'xxTrustedFormCertUrl';

  if (!apiKey) {
    console.warn('[TrustForms] Missing API key. Please set ACTIVEPROSPER_API_KEY environment variable.');
  }

  return {
    apiKey,
    formId,
    endpoint,
    certField
  };
}

/**
 * Get TrustedForm certificate URL from the page
 */
export function getTrustedFormCertUrl(): string | null {
  if (typeof window === 'undefined') return null;
  
  try {
    // Look for the TrustedForm certificate URL in the DOM
    const certField = document.querySelector('[name="xxTrustedFormCertUrl"]');
    if (certField && certField instanceof HTMLInputElement) {
      return certField.value;
    }
    
    // Fallback to window property if it exists
    if (window.hasOwnProperty('xxTrustedFormCertUrl')) {
      return (window as any).xxTrustedFormCertUrl;
    }
    
    return null;
  } catch (error) {
    console.error('[TrustForms] Error getting TrustedForm certificate URL:', error);
    return null;
  }
}

/**
 * Submit form data to ActiveProsper TrustForms
 */
export async function submitToTrustForms(data: TrustFormsFormData): Promise<TrustFormsResponse> {
  const config = getTrustFormsConfig();
  
  // Check if we have the required configuration
  if (!config.apiKey) {
    console.error('[TrustForms] Missing required configuration for TrustForms submission.');
    return { 
      success: false, 
      error: 'Missing TrustForms configuration.'
    };
  }

  try {
    console.log('[TrustForms] Submitting data to TrustForms');

    // Get TrustedForm certificate URL if available
    const certUrl = getTrustedFormCertUrl();
    if (certUrl) {
      console.log('[TrustForms] TrustedForm certificate URL:', certUrl);
    }

    // Prepare the form data for the TrustForms API
    const formData = {
      apiKey: config.apiKey,
      formId: config.formId,
      data: {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        phone: data.phone,
        // Map other relevant fields
        role: data.role,
        rideshareCompany: data.rideshareCompany,
        filedComplaint: data.filedComplaint,
        hasPoliceReport: data.hasPoliceReport,
        accidentDate: data.accidentDate,
        receivedMedicalTreatment: data.receivedMedicalTreatment48Hours || data.receivedMedicalTreatment7Days,
        // Include TrustedForm certificate URL if available
        [config.certField]: certUrl || '',
        // Include source identification
        source: 'MVA-Rideshare-Website',
        pageUrl: data.pageUrl || 'claim form',
        submittedAt: new Date().toISOString()
      }
    };

    // Make the API request to TrustForms
    const response = await fetch(config.endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(formData)
    });

    // Parse the response
    const responseData = await response.json();
    
    if (!response.ok) {
      console.error('[TrustForms] Error submitting to TrustForms:', responseData);
      return {
        success: false,
        error: responseData.message || 'Error submitting to TrustForms'
      };
    }

    console.log('[TrustForms] Successfully submitted to TrustForms:', responseData);
    return {
      success: true,
      id: responseData.id || '',
      message: 'Successfully submitted to TrustForms'
    };
  } catch (error) {
    console.error('[TrustForms] Exception while submitting to TrustForms:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 
/**
 * API utilities for AWS API Gateway integration
 */

// Types for the API request
export interface LeadData {
  firstName: string;
  lastName: string;
  email?: string;
  phone: string;
  role?: string;
  rideshareCompany?: string;
  accidentDate?: string;
  source?: string;
  pageUrl?: string;
  submittedAt?: string;
  [key: string]: any;
}

// Prepare the API data in the format expected by the AWS API
export function prepareApiData(formData: LeadData): Record<string, any> {
  // Start with any additional fields from the form data
  const result = { ...formData };
  
  // Ensure required fields are present
  result.firstName = formData.firstName;
  result.lastName = formData.lastName;
  result.email = formData.email || 'not-provided@example.com';
  result.phone = formData.phone;
  
  // Add metadata fields
  result.source = formData.source || 'MVA-Rideshare-Website';
  result.pageUrl = formData.pageUrl || '';
  result.submittedAt = formData.submittedAt || new Date().toISOString();
  
  return result;
}

// Submit data to AWS API
export async function submitToApi(data: Record<string, any>): Promise<{success: boolean; error?: string}> {
  try {
    console.log("[API] Submitting data to API");
    
    // For debugging in development
    if (process.env.NODE_ENV === 'development') {
      console.log("[API] Development mode - simulating success");
      return { success: true };
    }
    
    // AWS API endpoint from environment or use default
    const apiEndpoint = 'https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor';
    
    // Submit data to API
    const response = await fetch(apiEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    
    // Check for success
    if (!response.ok) {
      console.error(`[API] Error: ${response.status} ${response.statusText}`);
      let errorText;
      try {
        errorText = await response.text();
        console.error('[API] Error details:', errorText);
      } catch (e) {
        errorText = 'Unable to read error details';
      }
      
      return { 
        success: false, 
        error: `API error: ${response.status} ${response.statusText}. ${errorText}`
      };
    }
    
    // Success
    console.log("[API] Successfully submitted data to API");
    return { success: true };
  } catch (error) {
    console.error("[API] Exception while submitting to API:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 
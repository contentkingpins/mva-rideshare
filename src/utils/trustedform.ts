import fetch from 'node-fetch';
import { v4 as uuidv4 } from 'uuid';

// TrustedForm API Key
const TRUSTEDFORM_API_KEY = 'ccdd54f8fb4dc3b495d85dd504abd5f3';

/**
 * Claims a TrustedForm certificate by calling the TrustedForm API
 */
export async function claimTrustedFormCertificate(certUrl: string, leadData: any) {
  try {
    console.log('[TrustedForm] Claiming certificate:', certUrl);
    
    if (!certUrl) {
      console.error('[TrustedForm] No certificate URL provided');
      return { success: false, message: 'No certificate URL provided' };
    }
    
    // Extract the certificate ID from the URL
    const certMatch = certUrl.match(/([a-f0-9]{32})/i);
    if (!certMatch) {
      console.error('[TrustedForm] Invalid certificate URL format');
      return { success: false, message: 'Invalid certificate URL format' };
    }
    
    const certId = certMatch[0];
    const claimUrl = `https://cert.trustedform.com/certificates/${certId}/claim`;
    
    const response = await fetch(claimUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Basic ${Buffer.from(TRUSTEDFORM_API_KEY + ':').toString('base64')}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'reference': leadData.lead_id || uuidv4(),
        'vendor': 'MVA-rideshare',
        'email': leadData.email || '',
        'phone_1': leadData.phone || '',
        'first_name': leadData.firstName || '',
        'last_name': leadData.lastName || '',
        'tc_policy_url': 'https://mva-rideshare.com/terms',
      }).toString()
    });
    
    if (!response.ok) {
      const errorData = await response.text();
      console.error('[TrustedForm] API error:', errorData);
      return { 
        success: false, 
        message: `Failed to claim certificate: ${response.status}`,
        details: errorData
      };
    }
    
    const claimData = await response.json();
    console.log('[TrustedForm] Claim successful:', claimData);
    
    return { 
      success: true, 
      data: claimData,
      // Add the certificate URL to the returned data for easy reference
      certificateUrl: certUrl
    };
  } catch (error) {
    console.error('[TrustedForm] Error claiming certificate:', error);
    return { 
      success: false, 
      message: 'Error claiming certificate',
      error: error instanceof Error ? error.message : String(error)
    };
  }
}

/**
 * Client-side helper to load the TrustedForm script
 */
export function loadTrustedFormScript() {
  if (typeof window === 'undefined') return null;
  
  // Check if script already exists to avoid duplication
  if (!document.getElementById('trustedform-script')) {
    const script = document.createElement('script');
    script.id = 'trustedform-script';
    script.type = 'text/javascript';
    // Use the exact TrustedForm script URL with parameters from the dashboard
    script.src = '//api.trustedform.com/trustedform.js?field=xxTrustedFormCertUrl&use_tagged_consent=true&1';
    script.async = true;
    
    document.body.appendChild(script);
    return script;
  }
  
  return null;
}

/**
 * Client-side helper to get the TrustedForm certificate URL from the page
 */
export function getTrustedFormCertUrl() {
  if (typeof window === 'undefined') return null;
  
  const input = document.querySelector('[name="xxTrustedFormCertUrl"]') as HTMLInputElement;
  return input?.value || null;
} 
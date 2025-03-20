import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy to handle API calls securely
 * This avoids CORS issues and keeps API keys server-side only
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log("[PROXY] Received form data:", formData);
    
    // Log environment variables (masked for security)
    console.log("[PROXY] Environment check:");
    console.log("[PROXY] API Key present:", process.env.ACTIVEPROSPER_API_KEY ? "Yes (masked)" : "No");
    console.log("[PROXY] Form ID:", process.env.ACTIVEPROSPER_FORM_ID || "Not set");
    console.log("[PROXY] TrustedForm field:", process.env.TRUSTEDFORM_FIELD || "Not set");
    
    // Results object
    const results: any = {
      success: false,
      trustForms: null,
      aws: null
    };

    // 1. TrustForms API request
    try {
      console.log("[PROXY] Submitting to TrustForms");
      
      // If API key is missing, log and return error
      if (!process.env.ACTIVEPROSPER_API_KEY) {
        console.error("[PROXY] ActiveProsper API key is missing!");
        results.trustForms = { 
          success: false, 
          error: 'API key not configured on server' 
        };
      } else {
        const trustFormsData = {
          apiKey: process.env.ACTIVEPROSPER_API_KEY,
          formId: process.env.ACTIVEPROSPER_FORM_ID || 'mva-rideshare-form',
          data: {
            ...formData,
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || 'not-provided@example.com',
            phone: formData.phone,
            [process.env.TRUSTEDFORM_FIELD || 'xxTrustedFormCertUrl']: formData.xxTrustedFormCertUrl || '',
            source: 'MVA-Rideshare-Website-Proxy',
            pageUrl: formData.pageUrl || 'https://www.ridesharerights.com',
            submittedAt: new Date().toISOString()
          }
        };
        
        const trustFormsEndpoint = process.env.ACTIVEPROSPER_ENDPOINT || 'https://api.activeprosper.com/v1/forms/submit';
        console.log("[PROXY] TrustForms endpoint:", trustFormsEndpoint);
        console.log("[PROXY] TrustForms payload structure:", Object.keys(trustFormsData));
        
        try {
          const trustFormsResponse = await fetch(trustFormsEndpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify(trustFormsData)
          });
          
          if (!trustFormsResponse.ok) {
            // If we get a non-200 response
            console.error("[PROXY] TrustForms API error response:", trustFormsResponse.status, trustFormsResponse.statusText);
            const errorText = await trustFormsResponse.text();
            console.error("[PROXY] TrustForms error details:", errorText);
            
            results.trustForms = { 
              success: false, 
              error: `API error: ${trustFormsResponse.status} ${trustFormsResponse.statusText}`,
              details: errorText
            };
          } else {
            results.trustForms = await trustFormsResponse.json();
            console.log("[PROXY] TrustForms response:", results.trustForms);
          
            // Add TrustForms ID to results if available
            if (results.trustForms && results.trustForms.id) {
              formData.trustFormsId = results.trustForms.id;
            }
          }
        } catch (fetchError) {
          console.error("[PROXY] TrustForms fetch error:", fetchError);
          results.trustForms = { 
            success: false, 
            error: 'Network error connecting to TrustForms',
            details: fetchError instanceof Error ? fetchError.message : String(fetchError)
          };
        }
      }
    } catch (trustFormsError) {
      console.error("[PROXY] TrustForms error:", trustFormsError);
      results.trustForms = { 
        success: false, 
        error: trustFormsError instanceof Error ? trustFormsError.message : 'Unknown TrustForms error' 
      };
    }
    
    // 2. AWS API request
    try {
      console.log("[PROXY] Submitting to AWS API");
      
      // Add some additional headers that might help with authorization
      const awsResponse = await fetch('https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Origin': 'https://www.ridesharerights.com',
          'Referer': 'https://www.ridesharerights.com/'
        },
        body: JSON.stringify(formData)
      });
      
      console.log("[PROXY] AWS API response status:", awsResponse.status, awsResponse.statusText);
      
      if (awsResponse.ok) {
        results.aws = { success: true };
        if (awsResponse.headers.get('content-type')?.includes('application/json')) {
          try {
            results.aws = await awsResponse.json();
          } catch (e) {
            // If it's not valid JSON, we just continue with the success response
            console.log("[PROXY] AWS API returned non-JSON response but status OK");
          }
        }
      } else {
        // Try to get more details about the error
        let errorDetails = '';
        try {
          errorDetails = await awsResponse.text();
          console.error("[PROXY] AWS API error details:", errorDetails);
        } catch (e) {
          console.error("[PROXY] Could not read AWS error response");
        }
        
        // Attempt with a simplified payload as a fallback
        if (awsResponse.status === 403 || awsResponse.status === 400) {
          console.log("[PROXY] Attempting fallback AWS API call with simplified payload");
          
          // Create a simplified payload with just the essential fields
          const simplifiedPayload = {
            lead_id: formData.lead_id || `lead_${Date.now()}`,
            source: "MVA-Rideshare-Website",
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email || "not-provided@example.com",
            phone: formData.phone,
            role: formData.role,
            rideshareCompany: formData.rideshareCompany,
            accidentDate: formData.accidentDate,
            xxTrustedFormCertUrl: formData.xxTrustedFormCertUrl || ""
          };
          
          try {
            const fallbackResponse = await fetch('https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json'
              },
              body: JSON.stringify(simplifiedPayload)
            });
            
            console.log("[PROXY] AWS API fallback response status:", fallbackResponse.status);
            
            if (fallbackResponse.ok) {
              results.aws = { success: true, fallback: true };
              // Attempt to parse JSON if present
              if (fallbackResponse.headers.get('content-type')?.includes('application/json')) {
                try {
                  const jsonResult = await fallbackResponse.json();
                  results.aws = { ...jsonResult, fallback: true };
                } catch (e) {
                  // Continue with simple success if JSON parsing fails
                }
              }
            } else {
              results.aws = { 
                success: false, 
                error: `AWS API failed with both approaches: ${awsResponse.status} and ${fallbackResponse.status}`,
                details: errorDetails
              };
            }
          } catch (fallbackError) {
            console.error("[PROXY] AWS API fallback error:", fallbackError);
            results.aws = { 
              success: false, 
              error: `Initial attempt failed with ${awsResponse.status}, fallback attempt failed with network error`,
              details: fallbackError instanceof Error ? fallbackError.message : String(fallbackError)
            };
          }
        } else {
          results.aws = { 
            success: false, 
            error: `AWS API returned status ${awsResponse.status}`,
            details: errorDetails
          };
        }
      }
      
      console.log("[PROXY] AWS response:", results.aws);
    } catch (awsError) {
      console.error("[PROXY] AWS API error:", awsError);
      results.aws = { 
        success: false, 
        error: awsError instanceof Error ? awsError.message : 'Unknown AWS API error' 
      };
    }
    
    // Consider success if either API call succeeded
    results.success = results.trustForms?.success || results.aws?.success;
    
    // If both failed but at least attempted, still return a 200 so client can display errors gracefully
    return NextResponse.json(results);
  } catch (error) {
    console.error("[PROXY] Unhandled error:", error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing form data'
    }, { status: 500 });
  }
} 
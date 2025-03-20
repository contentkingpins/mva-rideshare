import { NextRequest, NextResponse } from 'next/server';

/**
 * Server-side proxy to handle API calls securely
 * This avoids CORS issues and keeps API keys server-side only
 */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.json();
    console.log("[PROXY] Received form data:", formData);
    
    // Results object
    const results: any = {
      success: false,
      trustForms: null,
      aws: null
    };

    // 1. TrustForms API request
    try {
      console.log("[PROXY] Submitting to TrustForms");
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
      
      const trustFormsResponse = await fetch(trustFormsEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(trustFormsData)
      });
      
      results.trustForms = await trustFormsResponse.json();
      console.log("[PROXY] TrustForms response:", results.trustForms);
      
      // Add TrustForms ID to results if available
      if (results.trustForms && results.trustForms.id) {
        formData.trustFormsId = results.trustForms.id;
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
      const awsResponse = await fetch('https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });
      
      if (awsResponse.ok) {
        results.aws = { success: true };
        if (awsResponse.headers.get('content-type')?.includes('application/json')) {
          try {
            results.aws = await awsResponse.json();
          } catch (e) {
            // If it's not valid JSON, we just continue with the success response
          }
        }
      } else {
        results.aws = { 
          success: false, 
          error: `AWS API returned status ${awsResponse.status}` 
        };
      }
      
      console.log("[PROXY] AWS response:", results.aws);
    } catch (awsError) {
      console.error("[PROXY] AWS API error:", awsError);
      results.aws = { 
        success: false, 
        error: awsError instanceof Error ? awsError.message : 'Unknown AWS API error' 
      };
    }
    
    // Overall success if either API call succeeded
    results.success = results.trustForms?.success || results.aws?.success;
    
    return NextResponse.json(results);
  } catch (error) {
    console.error("[PROXY] Unhandled error:", error);
    return NextResponse.json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error processing form data'
    }, { status: 500 });
  }
} 
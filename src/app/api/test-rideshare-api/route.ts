import { NextResponse } from 'next/server';

/**
 * API endpoint for testing Rideshare Leads API connectivity
 * Returns detailed diagnostics about the connection and response
 */
export async function GET() {
  const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
  const apiPath = process.env.API_PATH || process.env.NEXT_PUBLIC_API_PATH || '';
  const apiEndpoint = apiBaseUrl + apiPath;
  
  return NextResponse.json({
    message: 'This endpoint is for testing the Rideshare Leads API',
    apiEndpoint: apiEndpoint || 'Not configured',
    testUrl: 'Use POST method with test data'
  });
}

export async function POST(request: Request) {
  try {
    // Parse request data
    let data;
    try {
      data = await request.json();
      console.log('[TEST-RIDESHARE-API] Received data:', data);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON data'
      }, { status: 400 });
    }

    // Get API endpoint from environment variables
    const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
    const apiPath = process.env.API_PATH || process.env.NEXT_PUBLIC_API_PATH || '';
    const apiEndpoint = apiBaseUrl + apiPath;
    
    if (!apiEndpoint) {
      return NextResponse.json({
        success: false,
        error: 'API endpoint not configured in environment variables'
      }, { status: 500 });
    }

    console.log('[TEST-RIDESHARE-API] Testing connection to:', apiEndpoint);

    // Add lead_id if not provided
    if (!data.lead_id) {
      data.lead_id = `test_${Date.now()}`;
    }
    
    // Add source if not provided
    if (!data.source) {
      data.source = 'MVA-Rideshare-Website-Test';
    }

    try {
      // Diagnostic pre-flight - log all request details
      console.log('[TEST-RIDESHARE-API] Making API request with:');
      console.log('- URL:', apiEndpoint);
      console.log('- Method: POST');
      console.log('- Headers: Content-Type: application/json');
      console.log('- Body:', JSON.stringify(data, null, 2));

      // Make the request
      const startTime = Date.now();
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      const endTime = Date.now();

      // Parse response data
      let responseBody;
      const responseText = await response.text();
      try {
        responseBody = JSON.parse(responseText);
      } catch (e) {
        responseBody = { text: responseText };
      }

      // Get all response headers
      const responseHeaders: Record<string, string> = {};
      response.headers.forEach((value, key) => {
        responseHeaders[key] = value;
      });

      // Return detailed diagnostics
      return NextResponse.json({
        success: response.ok,
        status: response.status,
        statusText: response.statusText,
        headers: responseHeaders,
        body: responseBody,
        requestData: data,
        timing: {
          duration: endTime - startTime,
          startTime: new Date(startTime).toISOString(),
          endTime: new Date(endTime).toISOString()
        },
        environment: {
          apiEndpoint,
          nodeEnv: process.env.NODE_ENV
        }
      });
    } catch (error) {
      console.error('[TEST-RIDESHARE-API] Error making request:', error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        requestData: data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[TEST-RIDESHARE-API] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
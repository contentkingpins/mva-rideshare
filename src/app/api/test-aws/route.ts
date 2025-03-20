import { NextRequest, NextResponse } from 'next/server';

/**
 * API endpoint for testing AWS API connectivity
 * Returns detailed diagnostics about the connection and response
 */
export async function GET() {
  return NextResponse.json({
    message: 'This endpoint is for testing AWS API connection',
    testUrl: 'Use POST method with test data'
  });
}

export async function POST(request: NextRequest) {
  try {
    // Parse request data
    let data;
    try {
      data = await request.json();
      console.log('[TEST-AWS] Received data:', data);
    } catch (parseError) {
      return NextResponse.json({
        success: false,
        error: 'Invalid JSON data'
      }, { status: 400 });
    }

    // Endpoint for testing
    const awsEndpoint = 'https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor';
    console.log('[TEST-AWS] Testing connection to:', awsEndpoint);

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
      console.log('[TEST-AWS] Making AWS API request with:');
      console.log('- URL:', awsEndpoint);
      console.log('- Method: POST');
      console.log('- Headers: Content-Type: application/json');
      console.log('- Body:', JSON.stringify(data, null, 2));

      // Make the request
      const startTime = Date.now();
      const response = await fetch(awsEndpoint, {
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
          nodeEnv: process.env.NODE_ENV,
          hasAwsConfig: !!process.env.AWS_ACCESS_KEY_ID,
          hasRegion: !!process.env.AWS_REGION,
        }
      });
    } catch (error) {
      console.error('[TEST-AWS] Error making request:', error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
        errorType: error instanceof Error ? error.constructor.name : typeof error,
        requestData: data
      }, { status: 500 });
    }
  } catch (error) {
    console.error('[TEST-AWS] Unexpected error:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
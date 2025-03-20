import { NextRequest, NextResponse } from 'next/server';

/**
 * Simple test endpoint to verify AWS API connection
 */
export async function GET(request: NextRequest) {
  // Log all environment variables for debugging
  console.log("[TEST-AWS] Environment variables:", Object.keys(process.env));
  
  return NextResponse.json({
    message: "This endpoint is for testing AWS API connection",
    testUrl: "Use POST method with test data"
  });
}

export async function POST(request: NextRequest) {
  try {
    // Get test data from request or use defaults
    let testData;
    try {
      testData = await request.json();
    } catch (e) {
      testData = {
        firstName: "Test",
        lastName: "User",
        email: "test@example.com",
        phone: "1234567890",
        source: "Test",
        accidentDate: new Date().toISOString()
      };
    }
    
    console.log("[TEST-AWS] Testing AWS API with data:", testData);
    
    // AWS API endpoint
    const awsEndpoint = 'https://bnmcip8xp5.execute-api.us-east-1.amazonaws.com/commercial-mva-lead-processor';
    
    // Try the API call
    const response = await fetch(awsEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(testData)
    });
    
    console.log("[TEST-AWS] Response status:", response.status, response.statusText);
    
    // Get response body
    let responseBody;
    const contentType = response.headers.get('content-type');
    
    if (contentType && contentType.includes('application/json')) {
      responseBody = await response.json();
    } else {
      responseBody = await response.text();
    }
    
    // Return test results
    return NextResponse.json({
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      body: responseBody,
      testData: testData
    });
  } catch (error) {
    console.error("[TEST-AWS] Error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    }, { status: 500 });
  }
} 
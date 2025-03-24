import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { submitToTrustForms } from '@/utils/trustforms';

/**
 * API route for Rideshare lead submissions
 * Uses the dedicated Rideshare AWS API Gateway
 */
export async function POST(request: Request) {
  console.log('=== [Rideshare] Lead Submission API ===');
  
  try {
    // Parse the request body
    let data;
    try {
      data = await request.json();
      console.log('1. Received data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request data:', parseError);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Generate a unique lead_id if not provided
    const lead_id = data.lead_id || uuidv4();
    console.log('2. Lead ID:', lead_id);
    
    // Add metadata
    const enhancedData = {
      ...data,
      lead_id,
      source: data.source || 'MVA-Rideshare-Website',
      submittedAt: data.submittedAt || new Date().toISOString()
    };
    
    // Results object to track processing
    const results: any = {
      success: false,
      lead_id,
      trustForms: null,
      aws: null
    };
    
    try {
      // 1. Submit to TrustedForm (if certificate URL is available)
      if (data.xxTrustedFormCertUrl) {
        console.log('3. Submitting to TrustedForms');
        const trustFormsResult = await submitToTrustForms(enhancedData);
        results.trustForms = trustFormsResult;
        console.log('4. TrustedForms result:', trustFormsResult);
        
        // Add TrustedForm ID to the data if available
        if (trustFormsResult.id) {
          enhancedData.trustFormsId = trustFormsResult.id;
        }
      } else {
        console.log('3. No TrustedForm certificate URL available, skipping');
      }
      
      // 2. Submit to AWS API Gateway
      console.log('5. Submitting to Rideshare AWS API');
      
      // Get API endpoint from environment variables
      const apiBaseUrl = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || '';
      const apiPath = process.env.API_PATH || process.env.NEXT_PUBLIC_API_PATH || '';
      const apiEndpoint = apiBaseUrl + apiPath;
      if (!apiEndpoint) {
        throw new Error('API endpoint not configured in environment variables');
      }
      
      // Make the request to AWS API
      const apiResponse = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(enhancedData)
      });
      
      // Parse the response
      let apiResult;
      try {
        apiResult = await apiResponse.json();
      } catch (e) {
        apiResult = { 
          success: apiResponse.ok,
          statusCode: apiResponse.status,
          statusText: apiResponse.statusText
        };
      }
      
      results.aws = {
        success: apiResponse.ok,
        status: apiResponse.status,
        ...apiResult
      };
      
      console.log('6. AWS API result:', results.aws);
      
      // Consider success if either API succeeded
      results.success = (results.trustForms?.success || !data.xxTrustedFormCertUrl) && results.aws.success;
      
      // Return the results
      return NextResponse.json(results, { 
        status: results.success ? 201 : (apiResponse.status || 500)
      });
      
    } catch (error) {
      console.error('Error submitting lead:', error);
      return NextResponse.json({
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      }, { status: 500 });
    }
  } catch (error) {
    console.error('=== Lead Submission Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    
    return NextResponse.json(
      { 
        success: false,
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({ 
    success: false, 
    message: 'GET requests are not supported. Use POST to submit form data.'
  }, { status: 405 });
} 
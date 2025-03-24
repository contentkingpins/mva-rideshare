import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { prepareApiData, submitToApi } from '@/utils/api';
import { submitToTrustForms } from '@/utils/trustforms';

/**
 * This API route is a fallback for local development
 * In production, the form will submit directly to the AWS API Gateway endpoint
 */
export async function POST(request: Request) {
  console.log('=== [Fallback] Lead Submission API ===');
  console.log('Note: This is a fallback for local development. In production, use direct AWS API Gateway integration.');
  
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
    
    // Results object to track both integrations
    const results: any = {
      success: false,
      lead_id,
      trustForms: null,
      aws: null
    };
    
    try {
      // 1. Submit to TrustedForms
      console.log('3. Submitting to TrustedForms');
      const trustFormsResult = await submitToTrustForms({
        ...data,
        lead_id
      });
      results.trustForms = trustFormsResult;
      console.log('4. TrustedForms result:', trustFormsResult);
      
      // 2. Prepare and submit to AWS API Gateway
      console.log('5. Preparing data for AWS API Gateway');
      const apiData = prepareApiData({
        ...data,
        lead_id,
        // Add TrustForms ID if available
        trustFormsId: trustFormsResult.id || ''
      });
      
      console.log('6. Submitting to AWS API Gateway');
      const apiResult = await submitToApi(apiData);
      results.aws = apiResult;
      console.log('7. AWS API result:', apiResult);
      
      // Consider the submission successful if either API succeeded
      results.success = trustFormsResult.success || apiResult.success;
      
      // Return the combined results
      return NextResponse.json(results, { 
        status: results.success ? 201 : 500 
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
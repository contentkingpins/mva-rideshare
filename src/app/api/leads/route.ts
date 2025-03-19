import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLeadSubmission, docClient, TABLE_NAME } from '@/utils/dynamodb';
import { submitToTrustForms } from '@/utils/trustforms';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { prepareApiData, submitToApi } from '@/utils/api';

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
    
    try {
      // Prepare API data
      const apiData = prepareApiData({
        ...data,
        lead_id
      });
      
      // 1. Submit to TrustForms
      console.log('3. Submitting to TrustForms');
      const trustFormsResult = await submitToTrustForms(apiData);
      console.log('4. TrustForms result:', trustFormsResult);
      
      // 2. Submit to AWS API Gateway
      console.log('5. Submitting to AWS API Gateway');
      const apiResult = await submitToApi(apiData);
      console.log('6. API result:', apiResult);
      
      // Combine results
      return NextResponse.json({
        success: apiResult.success,
        lead_id: apiResult.lead_id || lead_id,
        message: 'Lead submitted successfully',
        trustforms_success: trustFormsResult.success
      }, { status: apiResult.success ? 201 : 500 });
      
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
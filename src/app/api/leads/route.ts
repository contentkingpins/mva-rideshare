import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLeadSubmission, docClient, TABLE_NAME } from '@/utils/dynamodb';
import { QueryCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { claimTrustedFormCertificate } from '@/utils/trustedform';

export async function POST(request: Request) {
  console.log('=== Lead Submission API ===');
  
  try {
    console.log('1. Starting lead submission process');
    
    // Parse the request body
    let data;
    try {
      data = await request.json();
      console.log('2. Received data:', JSON.stringify(data, null, 2));
    } catch (parseError) {
      console.error('Failed to parse request data:', parseError);
      return NextResponse.json(
        { error: 'Invalid request data' },
        { status: 400 }
      );
    }
    
    // Generate a unique lead_id
    const lead_id = uuidv4();
    console.log('3. Generated lead_id:', lead_id);
    
    // Log DynamoDB configuration
    console.log('4. DynamoDB Configuration:');
    console.log('- Table Name:', TABLE_NAME);
    console.log('- Region:', process.env['region'] || 'not set');
    console.log('- Has Credentials:', !!process.env['key_id'] && !!process.env['secret']);
    
    // Check for TrustedForm certificate URL and claim it if available
    if (data.trustedFormCertUrl) {
      console.log('5. TrustedForm certificate URL found, claiming certificate');
      const claimResult = await claimTrustedFormCertificate(data.trustedFormCertUrl, {
        ...data,
        lead_id
      });
      
      // Store claim result data with the lead
      if (claimResult.success && claimResult.data) {
        data.trustedFormClaimResult = claimResult.data;
      } else {
        console.warn('TrustedForm claim was not successful:', claimResult.message);
        data.trustedFormClaimError = claimResult.message;
      }
    } else {
      console.warn('5. No TrustedForm certificate URL provided');
    }
    
    // Try the most direct approach possible
    try {
      console.log('6. Attempting direct PutCommand...');
      const command = new PutCommand({
        TableName: TABLE_NAME,
        Item: {
          lead_id,
          ...data,
          submitted_at: new Date().toISOString()
        }
      });
      
      await docClient.send(command);
      console.log('7. Direct PutCommand successful');
      
      return NextResponse.json(
        { 
          message: 'Lead submission created successfully', 
          lead_id,
          success: true 
        },
        { status: 201 }
      );
    } catch (directError) {
      console.error('Direct PutCommand failed:', directError);
      
      // Try alternative method as fallback
      console.log('6b. Falling back to createLeadSubmission helper...');
      const result = await createLeadSubmission({
        lead_id,
        ...data,
        submitted_at: new Date().toISOString(),
      });

      console.log('7. Submission result:', result);

      if (!result.success) {
        console.error('8. Failed to create lead submission:', result.message);
        return NextResponse.json(
          { 
            error: 'Failed to create lead submission', 
            details: result.message,
            success: false
          },
          { status: 500 }
        );
      }

      console.log('8. Lead submission created successfully');
      return NextResponse.json(
        { message: 'Lead submission created successfully', lead_id, success: true },
        { status: 201 }
      );
    }
  } catch (error) {
    console.error('=== Lead Submission Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error,
        success: false
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const command = new QueryCommand({
      TableName: TABLE_NAME,
      KeyConditionExpression: 'status = :status',
      ExpressionAttributeValues: {
        ':status': 'new',
      },
    });

    const result = await docClient.send(command);

    return NextResponse.json({ 
      success: true, 
      leads: result.Items 
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { success: false, message: 'Error fetching leads' },
      { status: 500 }
    );
  }
} 
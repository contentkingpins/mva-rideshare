import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLeadSubmission, docClient, TABLE_NAME } from '@/utils/dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(request: Request) {
  try {
    console.log('=== Lead Submission API ===');
    console.log('1. Starting lead submission process');
    
    const data = await request.json();
    console.log('2. Received data:', JSON.stringify(data, null, 2));
    
    // Generate a unique lead_id
    const lead_id = uuidv4();
    console.log('3. Generated lead_id:', lead_id);
    
    // Log DynamoDB configuration
    console.log('4. DynamoDB Configuration:');
    console.log('- Table Name:', TABLE_NAME);
    console.log('- Region:', process.env['region']);
    console.log('- Has Credentials:', !!process.env['key_id'] && !!process.env['secret']);
    
    // Create the lead submission with the generated ID
    console.log('5. Attempting to create lead submission...');
    const result = await createLeadSubmission({
      lead_id,
      ...data,
      submitted_at: new Date().toISOString(),
    });

    console.log('6. Submission result:', result);

    if (!result.success) {
      console.error('7. Failed to create lead submission:', result.message);
      return NextResponse.json(
        { error: 'Failed to create lead submission', details: result.message },
        { status: 500 }
      );
    }

    console.log('7. Lead submission created successfully');
    return NextResponse.json(
      { message: 'Lead submission created successfully', lead_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('=== Lead Submission Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    console.error('Request data:', await request.json().catch(() => 'Could not parse request data'));
    
    return NextResponse.json(
      { 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error',
        type: error instanceof Error ? error.constructor.name : typeof error
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
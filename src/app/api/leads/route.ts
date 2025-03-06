import { NextResponse } from 'next/server';
import { v4 as uuidv4 } from 'uuid';
import { createLeadSubmission, docClient, TABLE_NAME } from '@/utils/dynamodb';
import { QueryCommand } from '@aws-sdk/lib-dynamodb';

export async function POST(request: Request) {
  try {
    const data = await request.json();
    
    // Generate a unique lead_id
    const lead_id = uuidv4();
    
    // Create the lead submission with the generated ID
    const result = await createLeadSubmission({
      lead_id,
      ...data,
      submitted_at: new Date().toISOString(),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: 'Failed to create lead submission' },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: 'Lead submission created successfully', lead_id },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error processing lead submission:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
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
import { NextResponse } from 'next/server';
import { docClient, TABLE_NAME } from '@/utils/dynamodb';
import { PutCommand, GetCommand } from '@aws-sdk/lib-dynamodb';

export async function GET() {
  try {
    console.log('=== DynamoDB Test API ===');
    console.log('1. Starting DynamoDB connectivity test');
    
    // Log configuration
    console.log('2. Configuration:');
    console.log('- Table Name:', TABLE_NAME);
    console.log('- Region:', process.env.AWS_REGION);
    console.log('- Has Credentials:', !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY);
    
    // Test write operation
    console.log('3. Testing write operation...');
    const testId = `test-${Date.now()}`;
    const writeCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        lead_id: testId,
        test: true,
        timestamp: new Date().toISOString()
      }
    });
    
    await docClient.send(writeCommand);
    console.log('4. Write operation successful');
    
    // Test read operation
    console.log('5. Testing read operation...');
    const readCommand = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        lead_id: testId
      }
    });
    
    const result = await docClient.send(readCommand);
    console.log('6. Read operation successful');
    
    // Clean up test data
    console.log('7. Cleaning up test data...');
    const deleteCommand = new PutCommand({
      TableName: TABLE_NAME,
      Item: {
        lead_id: testId,
        deleted: true
      }
    });
    
    await docClient.send(deleteCommand);
    console.log('8. Cleanup successful');
    
    return NextResponse.json({
      success: true,
      message: 'DynamoDB connectivity test successful',
      details: {
        tableName: TABLE_NAME,
        region: process.env.AWS_REGION,
        hasCredentials: !!process.env.AWS_ACCESS_KEY_ID && !!process.env.AWS_SECRET_ACCESS_KEY,
        testData: result.Item
      }
    });
  } catch (error) {
    console.error('=== DynamoDB Test Error ===');
    console.error('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.error('Error message:', error instanceof Error ? error.message : String(error));
    console.error('Error stack:', error instanceof Error ? error.stack : 'No stack trace');
    
    return NextResponse.json({
      success: false,
      error: 'DynamoDB connectivity test failed',
      details: {
        message: error instanceof Error ? error.message : String(error),
        type: error instanceof Error ? error.constructor.name : typeof error
      }
    }, { status: 500 });
  }
} 
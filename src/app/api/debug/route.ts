import { NextResponse } from 'next/server';
import { DynamoDBClient, DescribeTableCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand } from "@aws-sdk/lib-dynamodb";

export async function GET() {
  try {
    // Gather all environment variables
    const envVars = {
      'key_id': !!process.env['key_id'] ? '✅ Present' : '❌ Missing',
      'secret': !!process.env['secret'] ? '✅ Present' : '❌ Missing',
      'region': process.env['region'] || 'Not set',
      'table name': process.env['table name'] || 'Not set',
      // For comparison, also check the standard AWS names
      'AWS_ACCESS_KEY_ID': !!process.env.AWS_ACCESS_KEY_ID ? '✅ Present' : '❌ Missing',
      'AWS_SECRET_ACCESS_KEY': !!process.env.AWS_SECRET_ACCESS_KEY ? '✅ Present' : '❌ Missing',
      'AWS_REGION': process.env.AWS_REGION || 'Not set',
      'DYNAMODB_TABLE_NAME': process.env.DYNAMODB_TABLE_NAME || 'Not set',
      'NODE_ENV': process.env.NODE_ENV || 'Not set',
    };

    // Try to create a DynamoDB client with the environment variables
    const tableName = process.env['table name'] || "rideshare-mva";
    const clientConfig = {
      region: process.env['region'] || "us-east-1",
    } as const;

    if (process.env['key_id'] && process.env['secret']) {
      Object.assign(clientConfig, {
        credentials: {
          accessKeyId: process.env['key_id']!,
          secretAccessKey: process.env['secret']!
        }
      });
    }

    // Test creating a client
    let clientCreationSuccess = false;
    let clientError = null;
    let tableInfo = null;

    try {
      const client = new DynamoDBClient(clientConfig);
      const docClient = DynamoDBDocumentClient.from(client);
      clientCreationSuccess = true;
      
      // Try to describe the table
      try {
        const describeCommand = new DescribeTableCommand({
          TableName: tableName
        });
        const tableDescription = await client.send(describeCommand);
        tableInfo = {
          status: tableDescription.Table?.TableStatus,
          keySchema: tableDescription.Table?.KeySchema,
          attributeDefinitions: tableDescription.Table?.AttributeDefinitions,
          itemCount: tableDescription.Table?.ItemCount,
          size: tableDescription.Table?.TableSizeBytes
        };
      } catch (tableError) {
        tableInfo = {
          error: tableError instanceof Error ? tableError.message : String(tableError)
        };
      }
      
      // Try a very simple write operation
      const testId = `debug-${Date.now()}`;
      const writeCommand = new PutCommand({
        TableName: tableName,
        Item: {
          lead_id: testId,
          debug: true,
          timestamp: new Date().toISOString()
        }
      });
      
      // Attempt to write but with a timeout
      const writePromise = docClient.send(writeCommand);
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('DynamoDB write operation timed out')), 5000)
      );
      
      const writeResult = await Promise.race([writePromise, timeoutPromise]);
      
      return NextResponse.json({
        success: true,
        environment: envVars,
        clientCreation: 'Success',
        dbOperation: 'Success',
        tableName,
        region: clientConfig.region,
        testId,
        tableInfo
      });
    } catch (error) {
      return NextResponse.json({
        success: false,
        environment: envVars,
        clientCreation: clientCreationSuccess ? 'Success' : 'Failed',
        error: error instanceof Error ? {
          name: error.name,
          message: error.message,
          stack: error.stack
        } : String(error),
        tableName,
        region: clientConfig.region,
        tableInfo
      });
    }
  } catch (error) {
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : String(error)
    });
  }
} 
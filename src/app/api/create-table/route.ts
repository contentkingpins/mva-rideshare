import { NextResponse } from 'next/server';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ResourceNotFoundException } from "@aws-sdk/client-dynamodb";

export async function GET() {
  const results: any = {
    success: false,
    diagnostics: [],
    tableDetails: null,
    errors: [],
  };
  
  try {
    // Get AWS configuration from environment variables
    const accessKey = process.env.key_id || process.env.AWS_ACCESS_KEY_ID;
    const secretKey = process.env.secret || process.env.AWS_SECRET_ACCESS_KEY;
    const region = process.env.region || process.env.AWS_REGION || 'us-east-1';
    const tableName = process.env['table name'] || process.env.DYNAMODB_TABLE_NAME || 'rideshare-mva';
    
    results.config = {
      region,
      tableName,
      hasCredentials: !!(accessKey && secretKey)
    };
    
    if (!accessKey || !secretKey) {
      results.errors.push('AWS credentials not found in environment variables');
      return NextResponse.json(results);
    }
    
    // Create DynamoDB client with explicit credentials
    const client = new DynamoDBClient({
      region,
      credentials: {
        accessKeyId: accessKey,
        secretAccessKey: secretKey
      }
    });
    
    // Step 1: Check if table exists
    results.diagnostics.push(`Checking if table '${tableName}' exists`);
    let tableExists = false;
    let tableDetails = null;
    
    try {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const response = await client.send(describeCommand);
      
      tableExists = true;
      tableDetails = {
        status: response.Table?.TableStatus,
        keySchema: response.Table?.KeySchema,
        itemCount: response.Table?.ItemCount,
        creationTime: response.Table?.CreationDateTime,
        sizeBytes: response.Table?.TableSizeBytes
      };
      
      results.tableDetails = tableDetails;
      results.diagnostics.push(`Table exists with status: ${tableDetails.status}`);
    } catch (error: any) {
      if (error instanceof ResourceNotFoundException || error.name === 'ResourceNotFoundException') {
        results.diagnostics.push(`Table '${tableName}' does not exist, will create it`);
        tableExists = false;
      } else {
        results.errors.push(`Error checking table: ${error.message}`);
        return NextResponse.json(results);
      }
    }
    
    // Step 2: Create table if it doesn't exist
    if (!tableExists) {
      results.diagnostics.push(`Creating table '${tableName}'`);
      
      try {
        const createCommand = new CreateTableCommand({
          TableName: tableName,
          AttributeDefinitions: [
            { AttributeName: 'lead_id', AttributeType: 'S' }
          ],
          KeySchema: [
            { AttributeName: 'lead_id', KeyType: 'HASH' }
          ],
          BillingMode: 'PAY_PER_REQUEST'
        });
        
        const createResult = await client.send(createCommand);
        
        results.tableDetails = {
          status: createResult.TableDescription?.TableStatus,
          keySchema: createResult.TableDescription?.KeySchema,
          created: true
        };
        
        results.diagnostics.push(`Table created with status: ${results.tableDetails.status}`);
        results.success = true;
        results.message = `Table '${tableName}' created successfully! It may take a minute to become active.`;
      } catch (error: any) {
        results.errors.push(`Failed to create table: ${error.message}`);
        
        // Special error handling for common AWS errors
        if (error.name === 'AccessDeniedException') {
          results.errors.push('PERMISSION ERROR: Your IAM user does not have permission to create DynamoDB tables.');
        }
        
        return NextResponse.json(results);
      }
    } else {
      results.success = true;
      results.message = `Table '${tableName}' already exists and is ${tableDetails?.status?.toLowerCase()}.`;
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    results.errors.push(`Unexpected error: ${error.message}`);
    return NextResponse.json(results);
  }
} 
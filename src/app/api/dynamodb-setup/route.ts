import { NextResponse } from 'next/server';
import { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ListTablesCommand } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

export async function GET() {
  const results: any = {
    success: false,
    steps: [],
    environment: {},
    errors: [],
    recommendations: []
  };

  try {
    // Step 1: Check environment variables
    results.steps.push('Checking environment variables');
    const envVars = {
      'key_id': !!process.env['key_id'],
      'secret': !!process.env['secret'],
      'region': process.env['region'] || 'us-east-1',
      'table name': process.env['table name'] || 'rideshare-mva',
      'NODE_ENV': process.env.NODE_ENV || 'Not set',
    };
    
    results.environment = envVars;
    
    if (!envVars['key_id'] || !envVars['secret']) {
      results.errors.push('Missing AWS credentials in environment variables');
      results.recommendations.push(
        'Set key_id and secret environment variables in your AWS Amplify console'
      );
    }

    // Step 2: Create DynamoDB client
    results.steps.push('Creating DynamoDB client');
    const tableName = process.env['table name'] || 'rideshare-mva';
    const region = process.env['region'] || 'us-east-1';
    
    const clientConfig: any = { region };
    
    if (envVars['key_id'] && envVars['secret']) {
      clientConfig.credentials = {
        accessKeyId: process.env['key_id']!,
        secretAccessKey: process.env['secret']!
      };
    }
    
    let client;
    try {
      client = new DynamoDBClient(clientConfig);
      results.clientCreated = true;
    } catch (error: any) {
      results.errors.push(`Failed to create DynamoDB client: ${error.message}`);
      results.recommendations.push(
        'Check that your AWS credentials are valid and have the necessary permissions'
      );
      return NextResponse.json(results);
    }
    
    const docClient = DynamoDBDocumentClient.from(client);

    // Step 3: List tables to verify connection
    results.steps.push('Listing DynamoDB tables to verify connection');
    try {
      const listCommand = new ListTablesCommand({});
      const listResult = await client.send(listCommand);
      results.tables = listResult.TableNames;
      results.hasConnection = true;
    } catch (error: any) {
      results.errors.push(`Failed to list tables: ${error.message}`);
      results.recommendations.push(
        'Check your network connectivity and IAM permissions for DynamoDB:ListTables'
      );
      return NextResponse.json(results);
    }

    // Step 4: Check if table exists
    results.steps.push(`Checking if table "${tableName}" exists`);
    let tableExists = false;
    try {
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const tableInfo = await client.send(describeCommand);
      
      results.tableInfo = {
        status: tableInfo.Table?.TableStatus,
        keySchema: tableInfo.Table?.KeySchema,
        attributes: tableInfo.Table?.AttributeDefinitions,
        count: tableInfo.Table?.ItemCount,
      };
      
      tableExists = true;
      results.tableExists = true;
    } catch (error: any) {
      if (error.name === 'ResourceNotFoundException') {
        results.tableExists = false;
      } else {
        results.errors.push(`Failed to check if table exists: ${error.message}`);
        results.recommendations.push(
          'Verify your IAM user has dynamodb:DescribeTable permission'
        );
      }
    }

    // Step 5: Create table if it doesn't exist
    if (!tableExists) {
      results.steps.push(`Creating table "${tableName}"`);
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
        results.tableCreated = true;
        results.tableInfo = {
          status: createResult.TableDescription?.TableStatus,
        };
        
        results.recommendations.push(
          'Table is being created. It may take a minute to become active.'
        );
      } catch (error: any) {
        results.errors.push(`Failed to create table: ${error.message}`);
        results.recommendations.push(
          'Check that your IAM user has dynamodb:CreateTable permission'
        );
      }
    }

    // Step 6: Test write operation
    if (tableExists || results.tableCreated) {
      results.steps.push('Testing write operation');
      const testId = `test-${uuidv4().substring(0, 8)}`;
      
      try {
        const writeCommand = new PutCommand({
          TableName: tableName,
          Item: {
            lead_id: testId,
            test: true,
            timestamp: new Date().toISOString()
          }
        });
        
        await docClient.send(writeCommand);
        results.writeSuccess = true;
        
        // Step 7: Test read operation
        results.steps.push('Testing read operation');
        const readCommand = new GetCommand({
          TableName: tableName,
          Key: {
            lead_id: testId
          }
        });
        
        const readResult = await docClient.send(readCommand);
        results.readSuccess = !!readResult.Item;
        results.readItem = readResult.Item;
      } catch (error: any) {
        results.errors.push(`Failed to test write/read operations: ${error.message}`);
        results.recommendations.push(
          'Verify your IAM user has dynamodb:PutItem and dynamodb:GetItem permissions'
        );
      }
    }

    // Final result
    results.success = results.hasConnection && 
                     (results.tableExists || results.tableCreated) && 
                     (results.errors.length === 0);

    if (results.success) {
      results.recommendations.push(
        'Your DynamoDB setup is working correctly. You can now use the form to submit leads.'
      );
    }

    return NextResponse.json(results);
  } catch (error: any) {
    results.errors.push(`Unexpected error: ${error.message}`);
    return NextResponse.json(results);
  }
} 
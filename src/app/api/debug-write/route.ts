import { NextResponse } from 'next/server';
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, ScanCommand } from "@aws-sdk/lib-dynamodb";
import { v4 as uuidv4 } from 'uuid';

// Function to safely mask credentials
function maskString(str: string | undefined): string {
  if (!str) return 'not set';
  if (str.length <= 8) return '****';
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

export async function GET() {
  const results: any = {
    success: false,
    diagnostics: [],
    credentials: {},
    testItem: null,
    errors: [],
  };

  try {
    // Step 1: Check environment variables
    results.diagnostics.push('Checking credentials');
    
    // Check different naming conventions for credentials
    const accessKeyOptions = [
      { name: 'key_id', value: process.env.key_id },
      { name: 'KEY_ID', value: process.env.KEY_ID },
      { name: 'AWS_ACCESS_KEY_ID', value: process.env.AWS_ACCESS_KEY_ID },
    ];

    const secretOptions = [
      { name: 'secret', value: process.env.secret },
      { name: 'SECRET', value: process.env.SECRET },
      { name: 'AWS_SECRET_ACCESS_KEY', value: process.env.AWS_SECRET_ACCESS_KEY },
    ];
    
    // Find first valid credentials
    const accessKeyInfo = accessKeyOptions.find(opt => !!opt.value) || accessKeyOptions[0];
    const secretKeyInfo = secretOptions.find(opt => !!opt.value) || secretOptions[0];
    
    // Mask credentials for safe display
    results.credentials = {
      accessKeySource: accessKeyInfo.name,
      accessKeyPresent: !!accessKeyInfo.value,
      accessKeyValid: accessKeyInfo.value?.startsWith('AKIA'),
      accessKeyMasked: maskString(accessKeyInfo.value),
      
      secretSource: secretKeyInfo.name,
      secretPresent: !!secretKeyInfo.value,
      secretLength: secretKeyInfo.value?.length || 0,
    };
    
    // Get table and region
    const tableName = process.env['table name'] || process.env.DYNAMODB_TABLE_NAME || 'rideshare-mva';
    const region = process.env.region || process.env.AWS_REGION || 'us-east-1';
    
    results.config = {
      tableName,
      region,
      env: process.env.NODE_ENV
    };
    
    // Step 2: Initialize DynamoDB with explicit credentials
    results.diagnostics.push('Creating DynamoDB client');
    
    if (!accessKeyInfo.value || !secretKeyInfo.value) {
      return NextResponse.json({
        ...results,
        errors: ['AWS credentials not found in environment variables'],
      });
    }
    
    const clientConfig: any = {
      region,
      credentials: {
        accessKeyId: accessKeyInfo.value,
        secretAccessKey: secretKeyInfo.value
      }
    };
    
    // Create DynamoDB clients
    const client = new DynamoDBClient(clientConfig);
    const docClient = DynamoDBDocumentClient.from(client);
    
    // Step 3: Try to write a test item with all details logged
    results.diagnostics.push('Creating test item');
    const testId = `debug-${uuidv4().substring(0,8)}`;
    const timestamp = new Date().toISOString();
    
    const testItem = {
      lead_id: testId,
      name: 'Debug Test',
      email: 'debug@test.com',
      timestamp,
      debug: true
    };
    
    results.testItem = testItem;
    
    // Step 4: Write the item with direct command
    results.diagnostics.push('Writing test item to DynamoDB');
    try {
      const command = new PutCommand({
        TableName: tableName,
        Item: testItem
      });
      
      const startTime = Date.now();
      const result = await docClient.send(command);
      const endTime = Date.now();
      
      results.writeResult = {
        success: true,
        duration: `${endTime - startTime}ms`,
        response: result
      };
    } catch (error: any) {
      results.errors.push(`Failed to write item: ${error.message}`);
      results.writeResult = {
        success: false,
        error: {
          name: error.name,
          message: error.message,
          code: error.code
        }
      };
      
      // Special error handling for common AWS errors
      if (error.name === 'UnrecognizedClientException') {
        results.errors.push('CRITICAL: Invalid AWS credentials. Your access key or secret key is invalid.');
      } else if (error.name === 'AccessDeniedException') {
        results.errors.push('PERMISSION ERROR: Your IAM user does not have permission to write to DynamoDB.');
      } else if (error.name === 'ResourceNotFoundException') {
        results.errors.push(`TABLE ERROR: The table "${tableName}" does not exist in the ${region} region.`);
      }
      
      return NextResponse.json(results);
    }
    
    // Step 5: Verify the item exists
    results.diagnostics.push('Verifying item was written');
    try {
      const command = new GetCommand({
        TableName: tableName,
        Key: {
          lead_id: testId
        }
      });
      
      const result = await docClient.send(command);
      
      if (result.Item) {
        results.readResult = {
          success: true,
          found: true,
          item: result.Item
        };
      } else {
        results.readResult = {
          success: true,
          found: false
        };
        results.errors.push('Item was not found after writing. This suggests a table configuration issue.');
      }
    } catch (error: any) {
      results.errors.push(`Failed to read item: ${error.message}`);
      results.readResult = {
        success: false,
        error: {
          name: error.name,
          message: error.message
        }
      };
    }
    
    // Step 6: Count all items in the table
    results.diagnostics.push('Counting all items in table');
    try {
      const command = new ScanCommand({
        TableName: tableName,
        Select: 'COUNT'
      });
      
      const result = await docClient.send(command);
      
      results.tableStats = {
        count: result.Count || 0,
        scannedCount: result.ScannedCount || 0
      };
    } catch (error: any) {
      results.errors.push(`Failed to count items: ${error.message}`);
      results.tableStats = {
        error: error.message
      };
    }
    
    // Final assessment
    results.success = 
      results.writeResult?.success && 
      results.readResult?.success && 
      results.readResult?.found;
    
    // Provide specific guidance based on diagnostic results
    if (results.success) {
      results.message = "DynamoDB write and read operations successful! Your configuration is working.";
    } else if (results.writeResult?.success && !results.readResult?.found) {
      results.message = "Write succeeded but read failed. Check your table's partition key configuration.";
    } else if (results.errors.length > 0) {
      results.message = "One or more operations failed. See the errors list for details.";
    }
    
    return NextResponse.json(results);
  } catch (error: any) {
    results.errors.push(`Unexpected error: ${error.message}`);
    return NextResponse.json(results);
  }
} 
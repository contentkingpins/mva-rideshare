import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Function to get available credentials from various environment variable formats
function getAwsCredentials() {
  // Check different naming conventions for credentials
  const accessKeyOptions = [
    process.env.key_id,         // Our custom env var
    process.env.KEY_ID,         // Uppercase variant
    process.env.AWS_ACCESS_KEY_ID, // Standard AWS SDK env var
    process.env.aws_access_key_id  // Lowercase variant
  ];

  const secretOptions = [
    process.env.secret,         // Our custom env var
    process.env.SECRET,         // Uppercase variant
    process.env.AWS_SECRET_ACCESS_KEY, // Standard AWS SDK env var
    process.env.aws_secret_access_key  // Lowercase variant
  ];

  // Find first valid credential
  const accessKey = accessKeyOptions.find(key => !!key);
  const secretKey = secretOptions.find(key => !!key);

  return { accessKey, secretKey };
}

// Function to get table name from various environment variable formats
function getTableName() {
  return process.env['table name'] || 
         process.env.TABLE_NAME || 
         process.env.DYNAMODB_TABLE_NAME || 
         "rideshare-mva";
}

// Function to get region from various environment variable formats
function getRegion() {
  return process.env.region || 
         process.env.REGION || 
         process.env.AWS_REGION || 
         "us-east-1";
}

// Get credentials, table name and region
const { accessKey, secretKey } = getAwsCredentials();
const TABLE_NAME = getTableName();
const REGION = getRegion();
const HAS_CREDENTIALS = !!(accessKey && secretKey);

// Log configuration details (without exposing sensitive values)
console.log('[DynamoDB Config]', {
  tableName: TABLE_NAME,
  region: REGION,
  hasCredentials: HAS_CREDENTIALS,
  accessKeyPrefix: accessKey ? accessKey.substring(0, 4) : 'missing',
  usedCustomEnvVars: !!(process.env.key_id && process.env.secret),
  usedStandardEnvVars: !!(process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY),
  environment: process.env.NODE_ENV
});

// Create the client config
const clientConfig = {
  region: REGION,
} as const;

// Only add credentials if they exist
if (HAS_CREDENTIALS) {
  Object.assign(clientConfig, {
    credentials: {
      accessKeyId: accessKey!,
      secretAccessKey: secretKey!
    }
  });
} else {
  console.warn('[DynamoDB] No AWS credentials found. Please check environment variables.');
  console.warn('[DynamoDB] Attempted to find credentials in: key_id, KEY_ID, AWS_ACCESS_KEY_ID, aws_access_key_id');
}

// Create the DynamoDB client
let client: DynamoDBClient;
let docClient: DynamoDBDocumentClient;

try {
  client = new DynamoDBClient(clientConfig);
  docClient = DynamoDBDocumentClient.from(client, {
    marshallOptions: {
      removeUndefinedValues: true, // This helps with empty values
    }
  });
  console.log('[DynamoDB] Client created successfully');
} catch (error) {
  console.error('[DynamoDB] Failed to create client:', error);
  
  // Create dummy clients to prevent application crashes
  client = new DynamoDBClient(clientConfig);
  docClient = DynamoDBDocumentClient.from(client);
}

export { TABLE_NAME, docClient };

export interface LeadSubmission {
  lead_id: string;
  [key: string]: any;
}

export async function createLeadSubmission(lead: LeadSubmission) {
  try {
    if (!lead.lead_id) {
      console.error('[DynamoDB] Error: lead_id is required');
      return { 
        success: false, 
        message: "lead_id is required"
      };
    }
    
    console.log('[DynamoDB] Creating lead submission:', { 
      leadId: lead.lead_id,
      tableName: TABLE_NAME
    });
    
    // Add timestamp if not provided
    if (!lead.submitted_at) {
      lead.submitted_at = new Date().toISOString();
    }
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: lead
    });
    
    const result = await docClient.send(command);
    console.log('[DynamoDB] Lead submission created successfully');
    return { success: true, message: "Lead submission created successfully" };
  } catch (error) {
    console.error("[DynamoDB] Error creating lead submission:", error);
    
    // Provide more specific error details
    let errorDetails = "Unknown error";
    if (error instanceof Error) {
      errorDetails = error.message;
      
      // Check for specific AWS errors
      if (error.name === 'UnrecognizedClientException') {
        errorDetails = "Invalid AWS credentials. Please check your access key and secret.";
      } else if (error.name === 'ResourceNotFoundException') {
        errorDetails = `DynamoDB table '${TABLE_NAME}' not found. You may need to create it first.`;
      }
    }
    
    return { 
      success: false, 
      message: "Failed to create lead submission",
      details: errorDetails,
      errorType: error instanceof Error ? error.name : typeof error
    };
  }
}

export async function getLeadSubmission(leadId: string) {
  try {
    const command = new GetCommand({
      TableName: TABLE_NAME,
      Key: {
        lead_id: leadId
      }
    });
    
    const result = await docClient.send(command);
    return { success: true, data: result.Item };
  } catch (error) {
    console.error("[DynamoDB] Error getting lead submission:", error);
    return { 
      success: false, 
      message: "Failed to get lead submission",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
}

export async function updateLeadSubmission(leadId: string, updates: Partial<LeadSubmission>) {
  try {
    const updateExpressions: string[] = [];
    const expressionAttributeNames: Record<string, string> = {};
    const expressionAttributeValues: Record<string, any> = {};

    Object.entries(updates).forEach(([key, value]) => {
      if (key !== 'lead_id') {
        updateExpressions.push(`#${key} = :${key}`);
        expressionAttributeNames[`#${key}`] = key;
        expressionAttributeValues[`:${key}`] = value;
      }
    });

    // Always update the updated_at timestamp
    updateExpressions.push('#updated_at = :updated_at');
    expressionAttributeNames['#updated_at'] = 'updated_at';
    expressionAttributeValues[':updated_at'] = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        lead_id: leadId
      },
      UpdateExpression: `SET ${updateExpressions.join(', ')}`,
      ExpressionAttributeNames: expressionAttributeNames,
      ExpressionAttributeValues: expressionAttributeValues
    });

    await docClient.send(command);
    return { success: true, message: "Lead submission updated successfully" };
  } catch (error) {
    console.error("[DynamoDB] Error updating lead submission:", error);
    return { 
      success: false, 
      message: "Failed to update lead submission",
      details: error instanceof Error ? error.message : "Unknown error"
    };
  }
} 
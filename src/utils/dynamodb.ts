import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Fixed values for key variables for reliability
const TABLE_NAME = process.env['table name'] || "rideshare-mva";
const REGION = process.env['region'] || "us-east-1";
const HAS_CREDENTIALS = !!(process.env['key_id'] && process.env['secret']);

// Log configuration details (without exposing sensitive values)
console.log('[DynamoDB Config]', {
  tableName: TABLE_NAME,
  region: REGION,
  hasCredentials: HAS_CREDENTIALS
});

// Create the client config
const clientConfig = {
  region: REGION,
} as const;

// Only add credentials if they exist
if (HAS_CREDENTIALS) {
  Object.assign(clientConfig, {
    credentials: {
      accessKeyId: process.env['key_id']!,
      secretAccessKey: process.env['secret']!
    }
  });
} else {
  console.warn('[DynamoDB] No AWS credentials found. Please check environment variables.');
}

// Create the DynamoDB client
const client = new DynamoDBClient(clientConfig);
export const docClient = DynamoDBDocumentClient.from(client, {
  marshallOptions: {
    removeUndefinedValues: true, // This helps with empty values
  }
});

export { TABLE_NAME };

export interface LeadSubmission {
  lead_id: string;
  [key: string]: any;
}

export async function createLeadSubmission(lead: LeadSubmission) {
  try {
    console.log('[DynamoDB] Creating lead submission:', { 
      leadId: lead.lead_id,
      tableName: TABLE_NAME
    });
    
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: lead
    });
    
    const result = await docClient.send(command);
    console.log('[DynamoDB] Lead submission created successfully');
    return { success: true, message: "Lead submission created successfully" };
  } catch (error) {
    console.error("[DynamoDB] Error creating lead submission:", error);
    return { 
      success: false, 
      message: error instanceof Error ? error.message : "Failed to create lead submission",
      error: error
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
    console.error("Error getting lead submission:", error);
    return { success: false, message: "Failed to get lead submission" };
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
    console.error("Error updating lead submission:", error);
    return { 
      success: false, 
      message: "Failed to update lead submission",
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
} 
import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";

// Check for AWS credentials in environment
const hasAwsCredentials = process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY;

// Log configuration details (without exposing sensitive values)
console.log('DynamoDB Configuration:');
console.log('- Region:', process.env.AWS_REGION || "us-east-1");
console.log('- Table Name:', process.env.DYNAMODB_TABLE_NAME || "rideshare-mva");
console.log('- Credentials:', hasAwsCredentials ? '✅ Configured' : '❌ Missing');

// Only warn about missing credentials if we're not in a build environment
if (!hasAwsCredentials && !process.env.NEXT_PHASE) {
  console.warn('AWS credentials are not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
}

const clientConfig = {
  region: process.env.AWS_REGION || "us-east-1",
} as const;

if (hasAwsCredentials) {
  Object.assign(clientConfig, {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!
    }
  });
}

const client = new DynamoDBClient(clientConfig);

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = process.env.DYNAMODB_TABLE_NAME || "rideshare-mva";

export interface LeadSubmission {
  lead_id: string;
  [key: string]: any;
}

export async function createLeadSubmission(lead: LeadSubmission) {
  try {
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: lead
    });
    
    await docClient.send(command);
    return { success: true, message: "Lead submission created successfully" };
  } catch (error) {
    console.error("Error creating lead submission:", error);
    return { success: false, message: "Failed to create lead submission" };
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
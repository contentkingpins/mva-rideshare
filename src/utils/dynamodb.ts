import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import { DynamoDBDocumentClient, PutCommand, GetCommand } from "@aws-sdk/lib-dynamodb";

if (!process.env.AWS_ACCESS_KEY_ID || !process.env.AWS_SECRET_ACCESS_KEY) {
  throw new Error('AWS credentials are not configured. Please set AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY environment variables.');
}

const client = new DynamoDBClient({
  region: "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
  }
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = "rideshare-mva";

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
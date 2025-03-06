import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';

const client = new DynamoDBClient({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

export const docClient = DynamoDBDocumentClient.from(client);

export const TABLE_NAME = 'claim-connectors-leads';

export interface Lead {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  role: 'driver' | 'passenger' | 'guest' | 'other_vehicle';
  atFault?: 'yes' | 'no' | 'unknown';
  guestInfo?: string;
  rideshareComplaint: 'yes' | 'no';
  policeReport: 'yes' | 'no';
  status: 'new' | 'qualified' | 'denied' | 'contacted';
  createdAt: string;
  updatedAt: string;
  source: 'hero' | 'claim-form' | 'contact';
  notes?: string;
} 
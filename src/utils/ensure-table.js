// Run this script with Node.js to ensure the DynamoDB table exists
// Usage: node src/utils/ensure-table.js

const { DynamoDBClient, CreateTableCommand, DescribeTableCommand, ListTablesCommand } = require('@aws-sdk/client-dynamodb');

async function ensureTable() {
  console.log('🔍 Checking DynamoDB table...');
  
  // Get credentials from environment variables or .env file
  const region = process.env.region || 'us-east-1';
  const tableName = process.env['table name'] || 'rideshare-mva';
  const accessKeyId = process.env.key_id;
  const secretAccessKey = process.env.secret;
  
  if (!accessKeyId || !secretAccessKey) {
    console.error('❌ AWS credentials not found in environment variables');
    console.log('Please set key_id and secret environment variables');
    process.exit(1);
  }
  
  console.log(`- Using region: ${region}`);
  console.log(`- Table name: ${tableName}`);
  
  // Create DynamoDB client
  const client = new DynamoDBClient({
    region,
    credentials: {
      accessKeyId,
      secretAccessKey
    }
  });
  
  try {
    // First, check if table exists
    try {
      console.log(`- Checking if table '${tableName}' exists...`);
      const describeCommand = new DescribeTableCommand({ TableName: tableName });
      const result = await client.send(describeCommand);
      
      console.log(`✅ Table exists! Status: ${result.Table.TableStatus}`);
      console.log(`- Primary key: ${result.Table.KeySchema[0].AttributeName}`);
      console.log(`- Item count: ${result.Table.ItemCount}`);
      return;
    } catch (error) {
      if (error.name === 'ResourceNotFoundException') {
        console.log(`- Table '${tableName}' not found, creating it...`);
      } else {
        throw error;
      }
    }
    
    // Create the table
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
    console.log(`✅ Table created successfully!`);
    console.log(`- Status: ${createResult.TableDescription.TableStatus}`);
    console.log(`- Wait a few minutes for the table to become active`);
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.name === 'AccessDeniedException') {
      console.log('Possible solutions:');
      console.log('1. Check your AWS credentials');
      console.log('2. Ensure your IAM user has DynamoDB permissions');
    }
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  ensureTable();
} 
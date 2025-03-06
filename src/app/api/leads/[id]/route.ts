import { NextResponse } from 'next/server';
import { UpdateCommand } from '@aws-sdk/lib-dynamodb';
import { docClient, TABLE_NAME } from '@/lib/aws-config';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const now = new Date().toISOString();

    const command = new UpdateCommand({
      TableName: TABLE_NAME,
      Key: {
        id: params.id,
      },
      UpdateExpression: 'SET #status = :status, updatedAt = :updatedAt',
      ExpressionAttributeNames: {
        '#status': 'status',
      },
      ExpressionAttributeValues: {
        ':status': data.status,
        ':updatedAt': now,
      },
    });

    await docClient.send(command);

    return NextResponse.json({ 
      success: true, 
      message: 'Lead status updated successfully' 
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { success: false, message: 'Error updating lead status' },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';
import { updateLeadSubmission } from '@/utils/dynamodb';

export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const data = await request.json();
    const result = await updateLeadSubmission(params.id, data);

    if (!result.success) {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message,
          error: result.error
        },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      message: result.message
    });
  } catch (error) {
    console.error('Error updating lead status:', error);
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error updating lead status',
        error: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
} 
import { NextResponse } from 'next/server';

// Helper to safely display credentials - only shows first 4 and last 4 chars
function maskString(str: string | undefined): string {
  if (!str) return 'not set';
  if (str.length <= 8) return '****';
  return `${str.slice(0, 4)}...${str.slice(-4)}`;
}

export async function GET() {
  try {
    // Check both direct env vars and AWS SDK style env vars
    const credentialInfo = {
      // Our custom env vars
      key_id: {
        set: !!process.env.key_id,
        format: process.env.key_id ? 
          (process.env.key_id.startsWith('AKIA') ? '✅ Valid format' : '❌ Invalid format') : 
          'Not set',
        masked: maskString(process.env.key_id),
        length: process.env.key_id?.length || 0
      },
      secret: {
        set: !!process.env.secret,
        format: process.env.secret ? 
          (process.env.secret.length >= 16 ? '✅ Likely valid length' : '❌ Too short') : 
          'Not set',
        masked: maskString(process.env.secret),
        length: process.env.secret?.length || 0
      },
      
      // Standard AWS SDK env vars
      AWS_ACCESS_KEY_ID: {
        set: !!process.env.AWS_ACCESS_KEY_ID,
        format: process.env.AWS_ACCESS_KEY_ID ? 
          (process.env.AWS_ACCESS_KEY_ID.startsWith('AKIA') ? '✅ Valid format' : '❌ Invalid format') : 
          'Not set',
        masked: maskString(process.env.AWS_ACCESS_KEY_ID),
        length: process.env.AWS_ACCESS_KEY_ID?.length || 0
      },
      AWS_SECRET_ACCESS_KEY: {
        set: !!process.env.AWS_SECRET_ACCESS_KEY,
        format: process.env.AWS_SECRET_ACCESS_KEY ? 
          (process.env.AWS_SECRET_ACCESS_KEY.length >= 16 ? '✅ Likely valid length' : '❌ Too short') : 
          'Not set',
        masked: maskString(process.env.AWS_SECRET_ACCESS_KEY),
        length: process.env.AWS_SECRET_ACCESS_KEY?.length || 0
      },
      
      // Region info
      region: process.env.region || 'not set',
      AWS_REGION: process.env.AWS_REGION || 'not set',
      
      // Table name
      table: process.env['table name'] || 'not set',
      DYNAMODB_TABLE_NAME: process.env.DYNAMODB_TABLE_NAME || 'not set',
      
      // Environment and other context
      NODE_ENV: process.env.NODE_ENV || 'not set',
      vercel: !!process.env.VERCEL ? 'yes' : 'no',
      amplify: !!process.env.AWS_AMPLIFY_APP_ID ? 'yes' : 'no',
    };

    // Check if credentials are being properly mapped in the build process
    const mappingOk = (
      (credentialInfo.key_id.set || credentialInfo.AWS_ACCESS_KEY_ID.set) && 
      (credentialInfo.secret.set || credentialInfo.AWS_SECRET_ACCESS_KEY.set)
    );

    return NextResponse.json({
      success: true,
      credentials: credentialInfo,
      mappingOk,
      suggestions: !mappingOk ? [
        "Environment variables may not be properly set or mapped",
        "Check the build settings in AWS Amplify"
      ] : [],
      notes: [
        "This endpoint securely masks credentials for debugging",
        "Access keys normally start with 'AKIA' and are 20 characters",
        "Secret keys are usually longer than 40 characters"
      ]
    });
  } catch (error: any) {
    return NextResponse.json({
      success: false,
      error: error.message
    }, { status: 500 });
  }
} 
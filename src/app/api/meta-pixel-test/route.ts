import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    status: 'ok',
    message: 'Meta Pixel test endpoint is working',
    timestamp: new Date().toISOString()
  });
}

export async function POST(request: Request) {
  try {
    // Parse request body
    const data = await request.json();
    
    // Log the received data
    console.log('Meta Pixel Test Data:', JSON.stringify(data, null, 2));
    
    // Manually send event to Facebook using server-side API
    // This is a diagnostic test only, not for production use
    const eventData = {
      data: [{
        event_name: 'PageView',
        event_time: Math.floor(Date.now() / 1000),
        action_source: 'website',
        user_data: {
          client_user_agent: request.headers.get('user-agent') || '',
          client_ip_address: '127.0.0.1' // Placeholder for test
        },
        custom_data: {
          test_mode: true
        }
      }],
      test_event_code: 'TEST12345' // Replace with your test event code if available
    };
    
    // Log what we would send
    console.log('Would send to Meta API:', JSON.stringify(eventData, null, 2));
    
    return NextResponse.json({
      success: true,
      received: data,
      serverEvent: eventData
    });
  } catch (error) {
    console.error('Error in Meta Pixel test endpoint:', error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
} 
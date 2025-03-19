import { NextRequest, NextResponse } from 'next/server';
import crypto from 'crypto';

// Meta Conversions API endpoint
const META_API_URL = 'https://graph.facebook.com/v17.0';
const PIXEL_ID = '1718356202366164';
// In production, store this in environment variables
const ACCESS_TOKEN = process.env.META_API_ACCESS_TOKEN || '';

// Hash user data for privacy
function hashData(data: string): string {
  if (!data) return '';
  return crypto.createHash('sha256').update(data.trim().toLowerCase()).digest('hex');
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      eventName, 
      eventTime = Math.floor(Date.now() / 1000), 
      userData = {}, 
      customData = {},
      eventSourceUrl
    } = body;

    // Validate required fields
    if (!eventName) {
      return NextResponse.json(
        { error: 'Event name is required' },
        { status: 400 }
      );
    }

    // Hash user data for privacy
    const hashedUserData = {
      em: userData.email ? hashData(userData.email) : undefined,
      ph: userData.phone ? hashData(userData.phone) : undefined,
      fn: userData.firstName ? hashData(userData.firstName) : undefined,
      ln: userData.lastName ? hashData(userData.lastName) : undefined,
      external_id: userData.userId || undefined,
      client_ip_address: request.headers.get('x-forwarded-for') || request.ip || '',
      client_user_agent: request.headers.get('user-agent') || '',
    };

    // Prepare the event data
    const eventData = {
      data: [
        {
          event_name: eventName,
          event_time: eventTime,
          action_source: 'website',
          event_source_url: eventSourceUrl || request.headers.get('referer') || '',
          user_data: hashedUserData,
          custom_data: customData,
        },
      ],
      access_token: ACCESS_TOKEN,
    };

    // Skip actual API call if access token is not set (development mode)
    if (!ACCESS_TOKEN) {
      console.log('[Meta Conversions API] Would send event (development mode):', eventData);
      return NextResponse.json({ success: true, development: true });
    }

    // Send the event to Meta Conversions API
    const response = await fetch(`${META_API_URL}/${PIXEL_ID}/events`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(eventData),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[Meta Conversions API] Error:', result);
      return NextResponse.json(
        { error: 'Failed to send event to Meta', details: result },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, result });
  } catch (error) {
    console.error('[Meta Conversions API] Error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
} 
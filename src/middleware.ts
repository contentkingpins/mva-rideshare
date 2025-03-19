import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, number>();

// Rate limit configuration
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 60; // Maximum requests per minute

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Basic bot protection
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.toLowerCase().includes('bot') && !userAgent.includes('googlebot')) {
    return new NextResponse('Not allowed', { status: 403 });
  }

  // Rate limiting
  const ip = request.ip || 'anonymous';
  const now = Date.now();
  const windowStart = now - RATE_LIMIT_WINDOW;

  // Clean up old entries
  Array.from(rateLimit.entries()).forEach(([key, timestamp]) => {
    if (timestamp < windowStart) {
      rateLimit.delete(key);
    }
  });

  // Check rate limit
  const requestCount = Array.from(rateLimit.entries()).filter(
    ([key, timestamp]) => key.startsWith(ip) && timestamp > windowStart
  ).length;

  if (requestCount >= MAX_REQUESTS) {
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Add current request to rate limit tracking
  rateLimit.set(`${ip}:${now}`, now);

  // Add security headers
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-XSS-Protection', '1; mode=block');

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
}; 
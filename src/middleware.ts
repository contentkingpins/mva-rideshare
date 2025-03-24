import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Simple in-memory store for rate limiting
const rateLimit = new Map<string, number>();

// Rate limit configuration - increased limits for ad tracking
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 300; // Increased to 300 requests per minute for ad tracking

export function middleware(request: NextRequest) {
  const response = NextResponse.next();

  // Log request details for debugging
  console.log(`[Middleware] Request to: ${request.nextUrl.pathname}`);
  console.log(`[Middleware] User Agent: ${request.headers.get('user-agent')}`);
  console.log(`[Middleware] IP: ${request.ip}`);

  // Basic bot protection - only block obvious bots
  const userAgent = request.headers.get('user-agent') || '';
  if (userAgent.toLowerCase().includes('crawler') || 
      userAgent.toLowerCase().includes('spider') || 
      userAgent.toLowerCase().includes('bot')) {
    console.log(`[Middleware] Blocked bot: ${userAgent}`);
    return new NextResponse('Not allowed', { status: 403 });
  }

  // Rate limiting with logging
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
    console.log(`[Middleware] Rate limit exceeded for IP: ${ip}`);
    return new NextResponse('Too Many Requests', { status: 429 });
  }

  // Add current request to rate limit tracking
  rateLimit.set(`${ip}:${now}`, now);

  // Add security headers with ad-compatible settings
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'SAMEORIGIN');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  
  // Add CORS headers for ad tracking
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Max-Age', '86400'); // 24 hours

  // Add tracking-friendly headers
  response.headers.set('Cache-Control', 'no-cache, no-store, must-revalidate');
  response.headers.set('Pragma', 'no-cache');
  response.headers.set('Expires', '0');

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
     * - ad-related paths
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public|ads|tracking).*)',
  ],
}; 
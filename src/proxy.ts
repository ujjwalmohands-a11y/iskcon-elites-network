import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextRequest, NextResponse } from 'next/server';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
 url: process.env.UPSTASH_REDIS_REST_URL || '',
 token: process.env.UPSTASH_REDIS_REST_TOKEN || '',
});

// Configure edge rate-limiter: Max 5 actions within a sliding window of 10 seconds
const ratelimit = new Ratelimit({
 redis: redis,
 limiter: Ratelimit.slidingWindow(5, '10 s'),
 analytics: true,
});

const isProtectedRoute = createRouteMatcher(['/admin(.*)', '/api/admin(.*)']);
const isWebhookRoute = createRouteMatcher(['/api/webhooks(.*)']);
const isApiRoute = createRouteMatcher(['/api/(.*)']);

export default clerkMiddleware(async (auth, req: NextRequest) => {
 if (isApiRoute(req) && !isWebhookRoute(req)) {
 const ip = req.headers.get('cf-connecting-ip') ?? req.headers.get('x-forwarded-for') ?? '127.0.0.1';
 const { success, limit, reset, remaining } = await ratelimit.limit(ip);

 if (!success) {
 return new NextResponse('Rate limit exceeded. Request intercepted at Edge.', {
 status: 429,
 headers: {
 'X-RateLimit-Limit': limit.toString(),
 'X-RateLimit-Remaining': remaining.toString(),
 'X-RateLimit-Reset': reset.toString(),
 },
 });
 }
 }

 if (isProtectedRoute(req)) {
 await auth.protect();
 }

 return NextResponse.next();
});

export const config = {
 matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
};

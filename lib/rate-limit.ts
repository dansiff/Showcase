// lib/rate-limit.ts
// Simple in-memory rate limiting for API routes
// For production, consider using Upstash Redis or Vercel KV

type RateLimitConfig = {
  interval: number; // Time window in milliseconds
  maxRequests: number; // Max requests per interval
};

type RateLimitEntry = {
  count: number;
  resetTime: number;
};

// In-memory store (resets on server restart, which is fine for serverless)
const limitStore = new Map<string, RateLimitEntry>();

// Cleanup old entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const [key, entry] of limitStore.entries()) {
    if (entry.resetTime < now) {
      limitStore.delete(key);
    }
  }
}, 5 * 60 * 1000);

export function rateLimit(config: RateLimitConfig) {
  return {
    check: async (identifier: string): Promise<{ success: boolean; remaining: number; resetTime: number }> => {
      const now = Date.now();
      const key = `${identifier}`;
      
      let entry = limitStore.get(key);

      // Create new entry if doesn't exist or window has expired
      if (!entry || entry.resetTime < now) {
        entry = {
          count: 0,
          resetTime: now + config.interval,
        };
        limitStore.set(key, entry);
      }

      // Increment count
      entry.count++;

      const remaining = Math.max(0, config.maxRequests - entry.count);
      const success = entry.count <= config.maxRequests;

      return {
        success,
        remaining,
        resetTime: entry.resetTime,
      };
    },
  };
}

// Helper to get IP address from request
export function getClientIp(request: Request): string {
  // Check headers set by Vercel/CDN
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0].trim();
  }
  
  const realIp = request.headers.get('x-real-ip');
  if (realIp) {
    return realIp;
  }

  // Fallback (may not work in all environments)
  return 'unknown';
}

// Preset configurations for common use cases
export const rateLimits = {
  // Strict: 5 requests per minute (auth endpoints)
  strict: rateLimit({ interval: 60 * 1000, maxRequests: 5 }),
  
  // Standard: 10 requests per minute (most API endpoints)
  standard: rateLimit({ interval: 60 * 1000, maxRequests: 10 }),
  
  // Relaxed: 30 requests per minute (read-only endpoints)
  relaxed: rateLimit({ interval: 60 * 1000, maxRequests: 30 }),
  
  // Webhook: 100 requests per minute (for Stripe webhooks)
  webhook: rateLimit({ interval: 60 * 1000, maxRequests: 100 }),
};

import { useCallback, useRef } from 'react';
import { logger } from '@/utils/logger';

interface RateLimitOptions {
  maxRequests: number;
  windowMs: number;
}

interface RateLimitState {
  timestamps: number[];
  windowMs: number;
  maxRequests: number;
}

export function useRateLimit({ maxRequests = 60, windowMs = 60000 }: RateLimitOptions) {
  const state = useRef<RateLimitState>({
    timestamps: [],
    windowMs,
    maxRequests,
  });

  const isRateLimited = useCallback(() => {
    const now = Date.now();
    const windowStart = now - state.current.windowMs;

    // Remove old timestamps
    state.current.timestamps = state.current.timestamps.filter((timestamp) => timestamp > windowStart);

    // Check if we're over the limit
    if (state.current.timestamps.length >= state.current.maxRequests) {
      logger.warn('Rate limit exceeded', {
        maxRequests: state.current.maxRequests,
        windowMs: state.current.windowMs,
      });
      return true;
    }

    // Add current timestamp
    state.current.timestamps.push(now);
    return false;
  }, []);

  const executeIfNotLimited = useCallback(
    async <T>(fn: () => Promise<T>): Promise<T | null> => {
      if (isRateLimited()) {
        return null;
      }

      try {
        return await fn();
      } catch (error) {
        logger.error('Error executing rate-limited function', { error });
        throw error;
      }
    },
    [isRateLimited]
  );

  return {
    isRateLimited,
    executeIfNotLimited,
  };
} 
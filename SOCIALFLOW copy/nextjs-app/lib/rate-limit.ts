import { LRUCache } from 'lru-cache';

type Options = {
  uniqueTokenPerInterval?: number;
  interval?: number;
};

export default function rateLimit(options?: Options) {
  const tokenCache = new LRUCache<string, number[]>({
    max: options?.uniqueTokenPerInterval || 500, // Max 500 unique IPs per interval
    ttl: options?.interval || 60000, // 1 minute by default
  });

  return {
    check: (limit: number, token: string) => {
      const tokenCount = tokenCache.get(token) || [0];
      if (tokenCount[0] === 0) {
        tokenCache.set(token, tokenCount);
      }
      tokenCount[0] += 1;

      const currentUsage = tokenCount[0];
      const isRateLimited = currentUsage > limit;
      
      return {
        isRateLimited,
        limit,
        current: currentUsage,
        remaining: isRateLimited ? 0 : limit - currentUsage,
      };
    },
  };
}

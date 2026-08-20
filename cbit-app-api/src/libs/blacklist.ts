const blacklistedTokens = new Set<string>();
const tokenExpirations = new Map<string, number>();

export const blacklistToken = (token: string, expiryMs: number) => {
  blacklistedTokens.add(token);
  tokenExpirations.set(token, Date.now() + expiryMs);
};

export const isTokenBlacklisted = (token: string): boolean => {
  return blacklistedTokens.has(token);
};

// Periodically clean up expired records to keep memory clean
setInterval(() => {
  const now = Date.now();
  for (const [token, exp] of tokenExpirations.entries()) {
    if (now > exp) {
      blacklistedTokens.delete(token);
      tokenExpirations.delete(token);
    }
  }
}, 30 * 60 * 1000).unref();

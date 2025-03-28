// A simple in-memory store for temporary tokens
// In a production environment, this should be replaced with a Redis or database solution

import { randomUUID } from 'crypto';

interface TokenData {
  serial: string;
  createdAt: number;
}

// Token expiration time in milliseconds (15 minutes)
const TOKEN_EXPIRY = 15 * 60 * 1000;

// In-memory token store
const tokenStore = new Map<string, TokenData>();

// Clean up expired tokens periodically
setInterval(() => {
  const now = Date.now();
  for (const [token, data] of tokenStore.entries()) {
    if (now - data.createdAt > TOKEN_EXPIRY) {
      tokenStore.delete(token);
    }
  }
}, 60 * 1000); // Run cleanup every minute

export function createSerialToken(serial: string): string {
  // Generate a random token
  const token = randomUUID();
  
  // Store the token with the serial number
  tokenStore.set(token, {
    serial,
    createdAt: Date.now()
  });
  
  return token;
}

export function getSerialFromToken(token: string): string | null {
  const data = tokenStore.get(token);
  
  if (!data) {
    return null;
  }
  
  // Check if token has expired
  if (Date.now() - data.createdAt > TOKEN_EXPIRY) {
    tokenStore.delete(token);
    return null;
  }
  
  return data.serial;
}

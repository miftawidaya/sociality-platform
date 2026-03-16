/**
 * Validates JWT structure (Header.Payload.Signature) to avoid sending
 * malformed or stale tokens to the server.
 */
export function isValidJwtStructure(token: string): boolean {
  // A valid JWT must have 3 parts separated by dots
  const parts = token.split('.');
  if (parts.length !== 3) return false;

  return parts.every((part) => /^[A-Za-z0-9-_=]+$/.test(part));
}

/**
 * Basic expiration check by decoding the JWT payload
 */
export function isJwtExpired(token: string): boolean {
  try {
    const parts = token.split('.');
    if (parts.length < 2) return true;

    // Decode base64url payload (2nd part)
    const base64Url = parts[1];
    const base64 = base64Url.replaceAll('-', '+').replaceAll('_', '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + (c.codePointAt(0) ?? 0).toString(16)).slice(-2))
        .join('')
    );

    const { exp } = JSON.parse(jsonPayload);
    if (!exp) return false;

    // Check if the current time is past the expiration time
    // Subtract 30 seconds as a buffer for network latency
    return Math.floor(Date.now() / 1000) >= exp - 30;
  } catch {
    return true;
  }
}

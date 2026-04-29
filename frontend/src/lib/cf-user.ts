import { createServerFn } from '@tanstack/react-start';
import { getRequest } from '@tanstack/react-start/server';

export type CFUser = {
  id: string;    // CF Access `sub` — stable UUID per user per Access app
  email: string;
  name: string;
};

/**
 * Reads the Cloudflare Access JWT from the `Cf-Access-Jwt-Assertion` request header.
 * CF Access edge infrastructure has already verified the JWT before forwarding it here,
 * so we can safely decode the payload without re-verifying the signature.
 *
 * In local dev (no CF Access): returns a mock user if DEV_USER_EMAIL env var is set,
 * otherwise returns null (unauthenticated).
 *
 * Production setup: configure a Cloudflare Access application in the Zero Trust dashboard
 * pointing at your Workers domain/route. Protect the routes you need (/admin, /profile, etc.)
 */
export const getCFUser = createServerFn({ method: 'GET' }).handler(async (): Promise<CFUser | null> => {
  // ── Local dev fallback ──────────────────────────────────────────
  if (import.meta.env.DEV) {
    const email = process.env['DEV_USER_EMAIL'] ?? '';
    if (email) {
      return { id: 'dev-user-id', email, name: email.split('@')[0] };
    }
    return null;
  }

  // ── Production: read CF Access JWT ─────────────────────────────
  const request = getRequest();
  const jwt = request.headers.get('Cf-Access-Jwt-Assertion');
  if (!jwt) return null;

  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return null;
    // base64url → base64 → JSON
    const payload = JSON.parse(
      atob(parts[1].replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(parts[1].length / 4) * 4, '='))
    );
    if (!payload?.email) return null;
    return {
      id: payload.sub ?? payload.email,
      email: payload.email,
      name: payload.name ?? payload.email.split('@')[0],
    };
  } catch {
    return null;
  }
});

/**
 * Web OAuth client ID (public). Set in frontend/.env:
 * - VITE_GOOGLE_CLIENT_ID, or
 * - GOOGLE_CLIENT_ID (also read at build time via vite.config.js).
 */
export function getGoogleOAuthClientId() {
  const fromVite = String(import.meta.env.VITE_GOOGLE_CLIENT_ID || '').trim()
  // eslint-disable-next-line no-undef -- set in vite.config.js from GOOGLE_CLIENT_ID / VITE_GOOGLE_CLIENT_ID
  const fromBuild = typeof __APP_GOOGLE_CLIENT_ID__ !== 'undefined' ? String(__APP_GOOGLE_CLIENT_ID__).trim() : ''
  return fromVite || fromBuild
}

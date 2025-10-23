import { google } from 'googleapis';
import type { NextRequest } from 'next/server';

export type GoogleAuthConfig = {
  clientId: string;
  clientSecret: string;
  redirectUri: string;
};

export function getOAuth2Client(config?: Partial<GoogleAuthConfig>) {
  const clientId = config?.clientId ?? process.env.GOOGLE_CLIENT_ID ?? '';
  const clientSecret = config?.clientSecret ?? process.env.GOOGLE_CLIENT_SECRET ?? '';
  const redirectUri = config?.redirectUri ?? process.env.GOOGLE_REDIRECT_URI ?? '';
  const oauth2Client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  return oauth2Client;
}

export function makeAuthUrl() {
  const oauth2Client = getOAuth2Client();
  const scopes = [
    'https://www.googleapis.com/auth/blogger',
    'openid',
    'email',
    'profile',
  ];
  const url = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: scopes,
    prompt: 'consent',
  });
  return url;
}

export async function getTokensFromCode(code: string) {
  const oauth2Client = getOAuth2Client();
  const { tokens } = await oauth2Client.getToken(code);
  return tokens;
}

export function setCredentials(tokens: any) {
  const oauth2Client = getOAuth2Client();
  oauth2Client.setCredentials(tokens);
  return oauth2Client;
}

export function getTokenCookieName() {
  return 'gb_tokens';
}

export function setTokenCookies(tokens: any) {
  const cookie = `${getTokenCookieName()}=${encodeURIComponent(JSON.stringify(tokens))}; Path=/; HttpOnly; SameSite=Lax; Secure; Max-Age=${3600 * 24 * 30}`;
  return cookie;
}

export function readTokensFromRequest(req: NextRequest): any | null {
  const cookieHeader = req.headers.get('cookie') || '';
  const name = getTokenCookieName() + '=';
  const parts = cookieHeader.split(';').map((c) => c.trim());
  for (const part of parts) {
    if (part.startsWith(name)) {
      try { return JSON.parse(decodeURIComponent(part.substring(name.length))); }
      catch { return null; }
    }
  }
  return null;
}

export function bloggerClient(oauth2Client: any) {
  return google.blogger({ version: 'v3', auth: oauth2Client });
}

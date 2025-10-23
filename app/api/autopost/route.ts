import { NextRequest, NextResponse } from 'next/server';
import { bloggerClient, getOAuth2Client } from '@/lib/google';
import { generateContent } from '@/lib/generator';

// This endpoint uses a service account or refresh token stored in env to post automatically
// Provide GOOGLE_REFRESH_TOKEN to enable headless autoposts

export async function GET(req: NextRequest) {
  const clientId = process.env.GOOGLE_CLIENT_ID || '';
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET || '';
  const refreshToken = process.env.GOOGLE_REFRESH_TOKEN || '';
  const blogId = process.env.BLOGGER_BLOG_ID || '';

  if (!clientId || !clientSecret || !refreshToken || !blogId) {
    return NextResponse.json({ error: 'Missing env: GOOGLE_CLIENT_ID/SECRET, GOOGLE_REFRESH_TOKEN, BLOGGER_BLOG_ID' }, { status: 400 });
  }

  const oauth2 = getOAuth2Client();
  oauth2.setCredentials({ refresh_token: refreshToken });
  const blogger = bloggerClient(oauth2);
  const { title, body } = generateContent({ topic: process.env.DEFAULT_TOPIC });

  const insert = await blogger.posts.insert({
    blogId,
    isDraft: false,
    requestBody: { title, content: body },
  });

  return NextResponse.json({ ok: true, id: insert.data.id, url: insert.data.url });
}

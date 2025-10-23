import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { bloggerClient, readTokensFromRequest, setCredentials } from '@/lib/google';
import { generateContent } from '@/lib/generator';

const Body = z.object({ blogId: z.string(), topic: z.string().optional() });

export async function POST(req: NextRequest) {
  const tokens = readTokensFromRequest(req);
  if (!tokens) return NextResponse.json({ error: 'Not authenticated with Google' }, { status: 401 });
  const body = await req.json().catch(() => ({}));
  const parsed = Body.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: 'Invalid payload' }, { status: 400 });

  const { blogId, topic } = parsed.data;
  const { title, body: htmlBody } = generateContent({ topic });
  const auth = setCredentials(tokens);
  const blogger = bloggerClient(auth);

  const insert = await blogger.posts.insert({
    blogId,
    isDraft: false,
    requestBody: { title, content: htmlBody },
  });

  return NextResponse.json({ post: { id: insert.data.id, url: insert.data.url } });
}

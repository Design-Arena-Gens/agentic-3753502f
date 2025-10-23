import { NextRequest, NextResponse } from 'next/server';
import { bloggerClient, readTokensFromRequest, setCredentials } from '@/lib/google';

export async function GET(req: NextRequest) {
  const tokens = readTokensFromRequest(req);
  if (!tokens) return NextResponse.json({ blogs: [] }, { status: 200 });
  const auth = setCredentials(tokens);
  const blogger = bloggerClient(auth);
  const resp = await blogger.blogs.listByUser({ userId: 'self' });
  const blogs = (resp.data.items || []).map((b) => ({ id: b.id!, name: b.name! }));
  return NextResponse.json({ blogs });
}

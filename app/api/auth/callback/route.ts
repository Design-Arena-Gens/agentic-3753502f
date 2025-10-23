import { NextResponse, NextRequest } from 'next/server';
import { getTokensFromCode, setTokenCookies } from '@/lib/google';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  if (!code) {
    return NextResponse.redirect(new URL('/', req.url));
  }
  try {
    const tokens = await getTokensFromCode(code);
    const res = NextResponse.redirect(new URL('/', req.url));
    res.headers.set('Set-Cookie', setTokenCookies(tokens));
    return res;
  } catch (e) {
    return NextResponse.redirect(new URL('/', req.url));
  }
}

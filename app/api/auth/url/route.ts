import { NextResponse } from 'next/server';
import { makeAuthUrl } from '@/lib/google';

export async function GET() {
  const url = makeAuthUrl();
  return NextResponse.json({ url });
}

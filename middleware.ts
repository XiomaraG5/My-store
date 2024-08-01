import { NextResponse } from 'next/server';
import { getSession } from '@/lib/getSession';
import { NextRequest } from 'next/server';

export async function middleware(req: NextRequest) {
  const session = await getSession();

  if (!session) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/protected-route'], // Rutas que deseas proteger
};

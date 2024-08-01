import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const sessionToken = req.cookies.get('sessionToken')?.value;

    if (sessionToken) {
      await prisma.session.delete({
        where: { sessionToken },
      });
    }

   
    const serialized = serialize('sessionToken', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: -1, 
      path: '/',
    });

    const response = NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
    response.headers.set('Set-Cookie', serialized);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error logging out user' }, { status: 500 });
  }
}

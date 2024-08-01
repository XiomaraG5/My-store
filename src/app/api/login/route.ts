import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/lib/prisma';
import { v4 as uuidv4 } from 'uuid';
import { serialize } from 'cookie';

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 400 });
    }

    // Crear una sesión
    const sessionToken = uuidv4();
    const expires = new Date();
    expires.setHours(expires.getHours() + 1); // Sesión expira en 1 hora

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires,
      },
    });

    // Configurar la cookie
    const serialized = serialize('sessionToken', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 3600, // 1 hour
      path: '/',
    });

    const response = NextResponse.json({ user }, { status: 200 });
    response.headers.set('Set-Cookie', serialized);
    return response;
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error logging in user' }, { status: 500 });
  }
}

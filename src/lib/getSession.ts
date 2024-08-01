import { cookies } from 'next/headers';
import prisma from '@/lib/prisma';

export async function getSession() {
  const sessionToken = cookies().get('sessionToken')?.value;
  if (sessionToken) {
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true },
    });

    if (session && session.expires > new Date()) {
      return session;
    }
  }
  return null;
}

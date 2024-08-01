
import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  try {
    const sellers = await prisma.user.findMany({
      where: { role: 'seller' },
    });
    return NextResponse.json(sellers);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching sellers' }, { status: 500 });
  }
}

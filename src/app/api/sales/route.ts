import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(req: NextRequest) {
  try {
    const { quantity, productId, userId, sellerId } = await req.json();

    if (!quantity || !productId || !userId || !sellerId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const sale = await prisma.sale.create({
      data: {
        quantity,
        productId,
        userId,
        sellerId,
      },
    });

    return NextResponse.json(sale, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error creating sale' }, { status: 500 });
  }
}

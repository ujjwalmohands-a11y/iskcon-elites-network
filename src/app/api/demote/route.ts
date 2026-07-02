export const runtime = 'edge';
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    await prisma.user.update({
      where: { clerkId: userId },
      data: { role: 'USER' }
    });

    return NextResponse.json({ success: true, message: 'You have been demoted to a standard USER.' });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

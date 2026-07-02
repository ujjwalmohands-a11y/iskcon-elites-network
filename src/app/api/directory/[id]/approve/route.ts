import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const url = new URL(request.url);
    const category = url.searchParams.get('category'); // 'alumni' or 'speaker'

    if (!category) {
      return NextResponse.json({ error: 'Missing category' }, { status: 400 });
    }

    const body = await request.json();
    const { isApproved } = body;

    if (typeof isApproved !== 'boolean') {
      return NextResponse.json({ error: 'Invalid isApproved value' }, { status: 400 });
    }

    const catLower = category.toLowerCase();

    if (catLower === 'alumni') {
      await prisma.alumnus.update({
        where: { id },
        data: { isApproved }
      });
    } else if (catLower === 'speaker') {
      await prisma.speaker.update({
        where: { id },
        data: { isApproved }
      });
    } else {
      return NextResponse.json({ error: 'Invalid category' }, { status: 400 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Directory Approve Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

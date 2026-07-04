import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    let dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    
    if (!dbUser) {
      // Auto-backfill user if webhook failed
      const clerkUser = await currentUser();
      if (clerkUser) {
        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkUser.emailAddresses[0]?.emailAddress || '',
            role: 'SUPERADMIN',
            canCreateEvents: true,
          }
        });
      }
    }

    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
      return new NextResponse('Forbidden', { status: 403 });
    }

    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        clerkId: true,
        email: true,
        role: true,
        canCreateEvents: true,
        createdAt: true,
      }
    });

    return NextResponse.json({ users });
  } catch (error) {
    console.error('Fetch Users Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

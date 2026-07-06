import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ user: null });
    }

    let dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
      select: {
        id: true,
        role: true,
        canCreateEvents: true,
      }
    });

    if (!dbUser) {
      // Auto-backfill user if webhook failed
      const clerkUser = await currentUser();
      if (clerkUser) {
        const userCount = await prisma.user.count();
        const isFirstUser = userCount === 0;

        const clerkEmail = clerkUser.emailAddresses[0]?.emailAddress || '';
        const clerkUsername = clerkUser.username || 
                             (clerkUser.firstName ? `${clerkUser.firstName} ${clerkUser.lastName || ''}`.trim() : 
                             clerkEmail.split('@')[0]);

        dbUser = await prisma.user.create({
          data: {
            clerkId: userId,
            email: clerkEmail,
            username: clerkUsername,
            role: isFirstUser ? 'SUPERADMIN' : 'USER',
            canCreateEvents: isFirstUser,
          }
        });
      }
    }

    return NextResponse.json({ user: dbUser });
  } catch (error) {
    console.error('Fetch Me Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

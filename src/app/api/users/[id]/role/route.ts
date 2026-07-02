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

    const body = await request.json();
    const { role } = body;

    if (role !== 'USER' && role !== 'ADMIN' && role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Invalid role specified' }, { status: 400 });
    }

    // Safety check: Prevent users from modifying their own role, except if they're a SUPERADMIN maybe?
    // Let's just prevent self-modification to avoid accidental lockouts.
    if (dbUser.id === id) {
       return NextResponse.json({ error: 'You cannot change your own role' }, { status: 400 });
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safety check: Don't let an ADMIN demote a SUPERADMIN
    if (targetUser.role === 'SUPERADMIN' && dbUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Only a SuperAdmin can modify another SuperAdmin' }, { status: 403 });
    }

    await prisma.user.update({
      where: { id },
      data: { role }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Update Role Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth, clerkClient } from '@clerk/nextjs/server';

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const targetUserId = params.id;
    
    // Get target user to find clerkId
    const targetUser = await prisma.user.findUnique({ where: { id: targetUserId } });
    
    if (!targetUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Safety check: Prevent users from deleting themselves
    if (targetUser.id === dbUser.id) {
      return NextResponse.json({ error: 'Cannot delete yourself' }, { status: 400 });
    }

    // Safety check: Don't let an ADMIN delete a SUPERADMIN
    if (targetUser.role === 'SUPERADMIN' && dbUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Insufficient permissions' }, { status: 403 });
    }

    // Delete from Prisma
    await prisma.user.delete({ where: { id: targetUserId } });

    // Attempt to delete from Clerk (if configured)
    try {
      const client = await clerkClient();
      await client.users.deleteUser(targetUser.clerkId);
    } catch (clerkErr) {
      console.warn("Could not delete user from Clerk (they may have been manually deleted or API keys are missing):", clerkErr);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting user:", error);
    return NextResponse.json({ error: 'Failed to delete user' }, { status: 500 });
  }
}

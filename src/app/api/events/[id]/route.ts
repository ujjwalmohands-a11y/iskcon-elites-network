import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function DELETE(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN' && !dbUser.canCreateEvents)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    await prisma.event.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting event:", error);
    return NextResponse.json({ error: 'Failed to delete event' }, { status: 500 });
  }
}

export async function PATCH(req: Request, props: { params: Promise<{ id: string }> }) {
  try {
    const params = await props.params;
    const { userId } = await auth();
    if (!userId) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN' && !dbUser.canCreateEvents)) {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const body = await req.json();
    
    if (body.isHighlighted) {
      // Un-highlight all others first to ensure only one is highlighted
      await prisma.event.updateMany({
        data: { isHighlighted: false }
      });
    }

    const dataToUpdate: any = {};
    if (body.title !== undefined) dataToUpdate.title = body.title;
    if (body.location !== undefined) dataToUpdate.location = body.location;
    if (body.date !== undefined) dataToUpdate.date = new Date(body.date);
    if (body.time !== undefined) dataToUpdate.time = body.time;
    if (body.description !== undefined) dataToUpdate.description = body.description;
    if (body.imageUrl !== undefined) dataToUpdate.imageUrl = body.imageUrl;
    if (body.isHighlighted !== undefined) dataToUpdate.isHighlighted = body.isHighlighted;

    const updatedEvent = await prisma.event.update({
      where: { id: params.id },
      data: dataToUpdate
    });

    return NextResponse.json({ success: true, event: updatedEvent });
  } catch (error) {
    console.error("Error updating event:", error);
    return NextResponse.json({ error: 'Failed to update event' }, { status: 500 });
  }
}

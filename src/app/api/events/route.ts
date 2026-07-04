import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { auth } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get('category') || 'all';

    let whereClause: Record<string, boolean> = { isApproved: true };

    const { userId } = await auth();
    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (dbUser && (dbUser.role === 'ADMIN' || dbUser.role === 'SUPERADMIN')) {
        whereClause = {}; // Admins see everything
      }
    }

    const events = await prisma.event.findMany({
      where: whereClause,
      orderBy: { date: 'asc' },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Error fetching events:", error);
    return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user has permission to create events
    if (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN' && !dbUser.canCreateEvents) {
      return NextResponse.json({ error: 'Forbidden: You do not have permission to create events.' }, { status: 403 });
    }

    const body = await req.json();
    const { title, location, date, time, description, imageUrl, isHighlighted } = body;

    if (!title || !location || !date || !time) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newEvent = await prisma.event.create({
      data: {
        title,
        location,
        date: new Date(date),
        time,
        description,
        imageUrl,
        isHighlighted: isHighlighted || false,
        addedById: dbUser.id,
        isApproved: true, // Automatically published per Option A
      }
    });

    if (isHighlighted) {
      await prisma.event.updateMany({
        where: { id: { not: newEvent.id } },
        data: { isHighlighted: false }
      });
    }

    return NextResponse.json({ success: true, event: newEvent });
  } catch (error) {
    console.error("Error creating event:", error);
    return NextResponse.json({ error: 'Failed to create event' }, { status: 500 });
  }
}

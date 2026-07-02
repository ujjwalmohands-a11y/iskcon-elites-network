import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
      return new NextResponse('Forbidden: Admins only', { status: 403 });
    }

    const { id } = await params;
    const body = await request.json();
    const {
      roleType, // 'Alumni' or 'Speaker'
      fullName,
      category,
      profileImage,
      cohort,
      title,
      bio,
      story,
      recommendation,
      email,
    } = body;

    if (!roleType || !fullName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (roleType === 'Alumni') {
      const updated = await prisma.alumnus.update({
        where: { id },
        data: {
          name: fullName,
          category,
          cohort: cohort || '',
          bio,
          story: story || null,
          recommendation: recommendation || null,
          email: email || null,
          avatarUrl: profileImage || null,
        },
      });
      return NextResponse.json({ success: true, data: updated });
    } else if (roleType === 'Speaker') {
      const updated = await prisma.speaker.update({
        where: { id },
        data: {
          name: fullName,
          title: title || '',
          bio,
          email: email || null,
          avatarUrl: profileImage || null,
        },
      });
      return NextResponse.json({ success: true, data: updated });
    }

    return NextResponse.json({ error: 'Invalid roleType' }, { status: 400 });
  } catch (error) {
    console.error('Directory Update API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { userId } = await auth();
    if (!userId) return new NextResponse('Unauthorized', { status: 401 });

    const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!dbUser || (dbUser.role !== 'ADMIN' && dbUser.role !== 'SUPERADMIN')) {
      return new NextResponse('Forbidden: Admins only', { status: 403 });
    }

    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const roleType = searchParams.get('type');

    if (!roleType) {
      return NextResponse.json({ error: 'Type parameter is required' }, { status: 400 });
    }

    if (roleType === 'Alumni') {
      await prisma.alumnus.delete({ where: { id } });
      return NextResponse.json({ success: true });
    } else if (roleType === 'Speaker') {
      await prisma.speaker.delete({ where: { id } });
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ error: 'Invalid type parameter' }, { status: 400 });
  } catch (error) {
    console.error('Directory Delete API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

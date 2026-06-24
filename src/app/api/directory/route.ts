import { NextResponse } from 'next/server';
import { auth, currentUser } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    const user = await currentUser();

    if (!userId || !user) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    // 1. Sync User to Database (Upsert to ensure Foreign Key constraints)
    const email = user.emailAddresses?.[0]?.emailAddress || 'no-email@example.com';
    const dbUser = await prisma.user.upsert({
      where: { clerkId: userId },
      update: {},
      create: {
        clerkId: userId,
        email: email,
        role: 'ADMIN', // Since only admins hit this API
      },
    });

    const body = await request.json();
    const { fullName, category, profileImage, cohort, title, bio } = body;

    if (!fullName || !category || !bio) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 2. Insert into appropriate table based on Category
    if (category === 'Alumni') {
      if (!cohort) return NextResponse.json({ error: 'Cohort required for Alumni' }, { status: 400 });
      
      const newAlumnus = await prisma.alumnus.create({
        data: {
          name: fullName,
          category: category,
          cohort: cohort,
          bio: bio,
          avatarUrl: profileImage || null,
          addedById: dbUser.id,
        }
      });
      return NextResponse.json({ success: true, data: newAlumnus });
    } 
    else if (category === 'Speaker' || category === 'Featured Guest') {
      const actualTitle = category === 'Featured Guest' ? 'Featured Guest' : title;
      if (!actualTitle) return NextResponse.json({ error: 'Title required for Speaker' }, { status: 400 });

      const newSpeaker = await prisma.speaker.create({
        data: {
          name: fullName,
          title: actualTitle,
          bio: bio,
          avatarUrl: profileImage || null,
          addedById: dbUser.id,
        }
      });
      return NextResponse.json({ success: true, data: newSpeaker });
    }

    return NextResponse.json({ error: 'Invalid category' }, { status: 400 });

  } catch (error) {
    console.error('Directory API Error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}

export async function GET() {
  try {
    const alumni = await prisma.alumnus.findMany({ orderBy: { createdAt: 'desc' } });
    const speakers = await prisma.speaker.findMany({ orderBy: { createdAt: 'desc' } });
    
    return NextResponse.json({ alumni, speakers });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch directory' }, { status: 500 });
  }
}

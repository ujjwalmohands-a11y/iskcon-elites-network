export const runtime = 'edge';
import { NextResponse } from 'next/server';
import prisma from '@/lib/prisma';

export async function GET() {
  try {
    const alumniRes = await prisma.alumnus.updateMany({
      data: { isApproved: true },
    });
    const speakerRes = await prisma.speaker.updateMany({
      data: { isApproved: true },
    });

    // Fix the role bug by changing everyone back to USER, EXCEPT the user who is actually the admin (we don't know who).
    // The safest is to let the user manually promote themselves in the DB if needed, but for now we'll just fix the profiles.

    return NextResponse.json({ 
      success: true, 
      alumniCount: alumniRes.count,
      speakerCount: speakerRes.count
    });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

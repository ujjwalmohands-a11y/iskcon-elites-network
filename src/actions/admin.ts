'use server';

import { auth } from '@clerk/nextjs/server';
import prisma from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

// Type definition for the incoming form data
export type ProfileData = {
  name: string;
  category: string;
  cohort?: string; // Optional for Speakers
  title?: string;  // Optional for Alumni
  bio: string;
  avatarUrl?: string;
};

export async function createDirectoryEntry(data: ProfileData) {
  try {
    // 1. Zero-Trust Security: Verify the user is logged in
    const { userId } = await auth();
    
    if (!userId) {
      return { success: false, error: 'Unauthorized: You must be logged in.' };
    }

    // 2. Fetch the internal User ID from our database that matches the Clerk ID
    const dbUser = await prisma.user.findUnique({
      where: { clerkId: userId },
    });

    if (!dbUser) {
      return { success: false, error: 'Unauthorized: Admin record not found in database.' };
    }

    // 3. Route the data to the correct database table based on Category
    if (data.category === 'Alumni') {
      await prisma.alumnus.create({
        data: {
          name: data.name,
          category: data.category,
          cohort: data.cohort || 'Unknown',
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          addedById: dbUser.id, // Audit trail: We know exactly who added this
        },
      });
    } else if (data.category === 'Speaker' || data.category === 'Featured Guest') {
      await prisma.speaker.create({
        data: {
          name: data.name,
          title: data.title || data.category,
          bio: data.bio,
          avatarUrl: data.avatarUrl,
          addedById: dbUser.id,
        },
      });
    }

    // 4. Force Next.js to update the live website immediately so the new profile shows up
    revalidatePath('/directory');
    revalidatePath('/admin');

    return { success: true };

  } catch (error) {
    console.error('Database insertion error:', error);
    return { success: false, error: 'Failed to create record in database.' };
  }
}

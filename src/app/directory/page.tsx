export const runtime = 'edge';
import { Metadata } from "next";
import prisma from "@/lib/prisma";
import DirectoryClient, { DirectoryMember } from "./DirectoryClient";
import { auth } from "@clerk/nextjs/server";

export const metadata: Metadata = {
  title: "Global Alumni Directory | ISKCON Elites Network",
  description: "Browse the ISKCON Elites global directory of alumni from top-tier institutions.",
};

// Force dynamic so it doesn't statically cache empty states during deployment
export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let members: DirectoryMember[] = [];
  let isAdmin = false;

  try {
    const { userId } = await auth();
    if (userId) {
      const dbUser = await prisma.user.findUnique({ where: { clerkId: userId } });
      if (dbUser && (dbUser.role === 'ADMIN' || dbUser.role === 'SUPERADMIN')) {
        isAdmin = true;
      }
    }

    const whereClause = isAdmin ? {} : { isApproved: true };

    const alumni = await prisma.alumnus.findMany({ 
      where: whereClause,
      orderBy: { name: 'asc' } 
    });
    const speakers = await prisma.speaker.findMany({ 
      where: whereClause,
      orderBy: { name: 'asc' } 
    });

    const mappedAlumni: DirectoryMember[] = alumni.map((a: any) => ({
      id: a.id,
      name: a.name,
      avatarUrl: a.avatarUrl,
      roleType: 'Alumni',
      primaryLabel: a.cohort,
      secondaryLabel: a.category,
      bio: a.bio,
      email: a.email,
      story: a.story,
      recommendation: a.recommendation,
      category: a.category,
      cohort: a.cohort,
      isApproved: a.isApproved,
    }));

    const mappedSpeakers: DirectoryMember[] = speakers.map((s: any) => ({
      id: s.id,
      name: s.name,
      avatarUrl: s.avatarUrl,
      roleType: 'Speaker',
      primaryLabel: s.title === 'Featured Guest' ? 'Guest' : 'Speaker',
      secondaryLabel: s.title,
      bio: s.bio,
      email: s.email,
      title: s.title,
      isApproved: s.isApproved,
    }));

    members = [...mappedAlumni, ...mappedSpeakers].sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Database connection failed or not yet initialized:", error);
  }

  return (
    <div className="container mx-auto px-4 md:px-8 py-10 md:py-16 flex-1">
      <div className="mb-8 md:mb-12">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-white">Global Directory</h1>
        <p className="text-[#C5C6C7] max-w-2xl text-base md:text-lg">
          Connect with elite academic minds. Filter by institution category or graduation cohort.
        </p>
      </div>

      <DirectoryClient initialMembers={members} isAdmin={isAdmin} />
    </div>
  );
}

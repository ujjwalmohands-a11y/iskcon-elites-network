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

    const mappedAlumni: DirectoryMember[] = alumni.map((a: { id: string, name: string, avatarUrl: string | null, cohort: string, category: string, bio: string | null, email: string | null, story: string | null, recommendation: string | null, isApproved: boolean }) => ({
      id: a.id,
      name: a.name,
      avatarUrl: a.avatarUrl,
      roleType: 'Alumni',
      primaryLabel: a.cohort,
      secondaryLabel: a.category,
      bio: a.bio ?? undefined,
      email: a.email,
      story: a.story,
      recommendation: a.recommendation,
      category: a.category,
      cohort: a.cohort,
      isApproved: a.isApproved,
    }));

    const mappedSpeakers: DirectoryMember[] = speakers.map((s: { id: string, name: string, avatarUrl: string | null, title: string, bio: string | null, email: string | null, isApproved: boolean }) => ({
      id: s.id,
      name: s.name,
      avatarUrl: s.avatarUrl,
      roleType: 'Speaker',
      primaryLabel: s.title === 'Featured Guest' ? 'Guest' : 'Speaker',
      secondaryLabel: s.title,
      bio: s.bio ?? undefined,
      email: s.email,
      title: s.title,
      isApproved: s.isApproved,
    }));

    members = [...mappedAlumni, ...mappedSpeakers].sort((a, b) => a.name.localeCompare(b.name));
  } catch (error) {
    console.error("Database connection failed or not yet initialized:", error);
  }

  return (
    <div className="container mx-auto px-6 pt-32 pb-16 flex-1 max-w-6xl">
      <div className="mb-12 text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight mb-4 text-[#0C1A30]">Global <span className="text-[#C5A059] italic">Directory</span></h1>
        <p className="text-gray-600 text-lg leading-relaxed">
          Connect with elite academic minds. Filter by profession, location, and expertise to find the right mentors and peers.
        </p>
      </div>

      <DirectoryClient initialMembers={members} isAdmin={isAdmin} />
    </div>
  );
}

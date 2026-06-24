import { Metadata } from "next";
import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, GraduationCap, Calendar } from "lucide-react";

type Props = {
  params: Promise<{ id: string }>;
};

// Precise Open Graph meta generation
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  let alumnus = null;
  try {
    alumnus = await prisma.alumnus.findUnique({
      where: { id },
    });
  } catch {
    // Database connection issue
  }

  if (!alumnus) {
    return {
      title: "Profile Not Found | ISKCON Elites",
    };
  }

  return {
    title: `${alumnus.name} | ISKCON Elites Network`,
    description: alumnus.bio.substring(0, 160) || `View ${alumnus.name}'s profile on the ISKCON Elites Network.`,
    openGraph: {
      title: `${alumnus.name} - ISKCON Elites`,
      description: alumnus.bio.substring(0, 160),
      images: alumnus.avatarUrl ? [{ url: alumnus.avatarUrl }] : [],
    },
  };
}

export default async function AlumnusProfilePage({ params }: Props) {
  const { id } = await params;
  
  let alumnus = null;
  try {
    alumnus = await prisma.alumnus.findUnique({
      where: { id },
    });
  } catch {
    // DB not connected
  }

  if (!alumnus) {
    notFound();
  }

  return (
    <div className="container mx-auto px-6 py-12 flex-1 max-w-4xl">
      <Link href="/directory" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-12 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Directory
      </Link>

      <div className="bg-slate-900/40 border border-white/5 rounded-3xl p-8 md:p-12">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          <div className="w-32 h-32 shrink-0 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 text-5xl font-semibold border border-white/10">
            {alumnus.name.charAt(0)}
          </div>
          
          <div className="space-y-4 flex-1">
            <h1 className="text-4xl md:text-5xl font-bold text-white tracking-tight">
              {alumnus.name}
            </h1>
            
            <div className="flex flex-wrap gap-4 text-sm font-medium text-slate-400">
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 px-4 py-2 rounded-full">
                <GraduationCap className="w-4 h-4 text-slate-300" />
                {alumnus.category}
              </div>
              <div className="flex items-center gap-2 bg-slate-950 border border-white/10 px-4 py-2 rounded-full">
                <Calendar className="w-4 h-4 text-slate-300" />
                Class of {alumnus.cohort}
              </div>
            </div>

            <div className="pt-6 mt-6 border-t border-white/5">
              <h2 className="text-xl font-semibold text-slate-200 mb-4">About</h2>
              <p className="text-slate-400 leading-relaxed whitespace-pre-wrap">
                {alumnus.bio}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

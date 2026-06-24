import { Metadata } from "next";
import prisma from "@/lib/prisma";
import DirectoryClient from "./DirectoryClient";

import { Alumnus } from "@prisma/client";

export const metadata: Metadata = {
  title: "Global Alumni Directory | ISKCON Elites Network",
  description: "Browse the ISKCON Elites global directory of alumni from top-tier institutions.",
};

// Force dynamic so it doesn't statically cache empty states during deployment
export const dynamic = "force-dynamic";

export default async function DirectoryPage() {
  let alumni: Alumnus[] = [];
  try {
    alumni = await prisma.alumnus.findMany({
      orderBy: { name: 'asc' },
    });
  } catch (error) {
    console.error("Database connection failed or not yet initialized:", error);
  }

  return (
    <div className="container mx-auto px-6 py-16 flex-1">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Global Directory</h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Connect with elite academic minds. Filter by institution category or graduation cohort.
        </p>
      </div>

      <DirectoryClient initialAlumni={alumni} />
    </div>
  );
}

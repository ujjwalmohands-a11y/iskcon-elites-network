import { auth } from "@clerk/nextjs/server";
import { ShieldAlert } from "lucide-react";

import prisma from "@/lib/prisma";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId } = await auth();

  if (!userId) {
    // We can either redirect or render a hard 403. Rendering a 403 prevents routing loops.
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">403 Unauthorized</h1>
        <p className="text-slate-400 max-w-md">
          You are not logged in.
        </p>
      </div>
    );
  }

  const user = await prisma.user.findUnique({
    where: { clerkId: userId }
  });

  if (!user || (user.role !== 'ADMIN' && user.role !== 'SUPERADMIN')) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">403 Forbidden</h1>
        <p className="text-slate-400 max-w-md">
          You do not possess the required administrator privileges to access the command center.
          This incident has been logged.
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Admin Sub-navigation could go here */}
      <div className="bg-slate-900 border-b border-white/5 py-4">
        <div className="container mx-auto px-6">
          <h2 className="text-sm font-semibold text-slate-300 uppercase tracking-widest">
            Command Center
          </h2>
        </div>
      </div>
      <div className="flex-1">
        {children}
      </div>
    </div>
  );
}

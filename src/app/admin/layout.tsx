import { auth } from "@clerk/nextjs/server";
import { ShieldAlert } from "lucide-react";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { userId, sessionClaims } = await auth();

  // Zero-Trust Check for layout rendering
  // TODO: Re-enable role check once Clerk publicMetadata and JWT templates are configured.
  // const metadata = sessionClaims?.metadata as { role?: string } | undefined;
  if (!userId) {
    // We can either redirect or render a hard 403. Rendering a 403 prevents routing loops.
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
        <ShieldAlert className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-3xl font-bold text-white mb-4">403 Unauthorized</h1>
        <p className="text-slate-400 max-w-md">
          You do not possess the required cryptographic metadata to access the administrative portal. 
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

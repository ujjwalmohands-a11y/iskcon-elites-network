export const runtime = 'edge';
import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center min-h-screen bg-[#0B0C10] relative overflow-hidden">
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-gradient-to-r from-indigo-500/10 to-[#45F3FF]/10 blur-[100px] rounded-full pointer-events-none" />
      <div className="relative z-10 w-full flex justify-center p-4">
        <SignIn />
      </div>
    </div>
  );
}

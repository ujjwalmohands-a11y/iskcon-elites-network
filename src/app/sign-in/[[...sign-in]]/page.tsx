import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-10 bg-slate-950">
      <SignIn />
    </div>
  );
}

import { SignUp } from "@clerk/nextjs";

export default function SignUpPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-10 bg-slate-950">
      <SignUp />
    </div>
  );
}

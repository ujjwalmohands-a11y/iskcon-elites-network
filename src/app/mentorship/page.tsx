import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentorship | ISKCON Elites Network",
  description: "Find a mentor and elevate your academic and professional trajectory.",
};

export default function MentorshipPage() {
  return (
    <div className="container mx-auto px-6 py-16 flex-1">
      <div className="mb-12">
        <h1 className="text-4xl font-bold tracking-tight mb-4 text-white">Mentorship Program</h1>
        <p className="text-slate-400 max-w-2xl text-lg">
          Engage directly with alumni from leading global institutions. Connect with world-class mentors to guide your career path.
        </p>
      </div>
      
      <div className="bg-white/5 border border-white/10 rounded-2xl p-8 text-center max-w-2xl mx-auto mt-16">
        <h2 className="text-2xl font-semibold text-white mb-4">Coming Soon</h2>
        <p className="text-slate-400 mb-8">
          We are currently matching our elite alumni with incoming students. Please check back later to find your ideal mentor.
        </p>
      </div>
    </div>
  );
}

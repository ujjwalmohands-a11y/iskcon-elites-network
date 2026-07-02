export const runtime = 'edge';
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ISKCON Elites Network",
  description: "Learn more about the ISKCON Elites Network.",
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-6 py-16 flex-1">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold tracking-tight mb-8 text-white">About Us</h1>
        <div className="space-y-6 text-lg text-slate-400 leading-relaxed">
          <p>
            The ISKCON Elites Network is a premier academic platform connecting global alumni from top-tier institutions. Our mission is to foster a culture of mentorship and empower the next generation of leaders.
          </p>
          <p>
            We believe in creating a strong, supportive community where experienced professionals and academic achievers can guide students and recent graduates toward excellence.
          </p>
        </div>
      </div>
    </div>
  );
}

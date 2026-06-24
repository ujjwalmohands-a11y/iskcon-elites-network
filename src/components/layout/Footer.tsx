import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-950 border-t border-white/5 pt-24 pb-12 mt-auto">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6">
            <Link href="/" className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-slate-300" />
              <span className="font-semibold text-xl tracking-tight">
                ISKCON Elites Network
              </span>
            </Link>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              A premier academic platform connecting global alumni, fostering mentorship, and empowering the next generation of leaders.
            </p>
          </div>
          
          <div>
            <h3 className="font-semibold text-slate-200 mb-6">Platform</h3>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/directory" className="hover:text-white transition-colors">Global Directory</Link></li>
              <li><Link href="/mentorship" className="hover:text-white transition-colors">Mentorship</Link></li>
              <li><Link href="/events" className="hover:text-white transition-colors">Events & Chapters</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-semibold text-slate-200 mb-6">Legal</h3>
            <ul className="space-y-4 text-slate-400">
              <li><Link href="/privacy" className="hover:text-white transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-white transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-sm text-slate-500">
          <p>© {new Date().getFullYear()} ISKCON Elites Network. All rights reserved.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Academic Authority Protocol</span>
            <span className="hover:text-slate-300 transition-colors cursor-pointer">Zero-Trust Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

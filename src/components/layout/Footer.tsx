import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="relative bg-transparent border-t border-white/5 pt-24 pb-12 mt-auto overflow-hidden">
      {/* Subtle Horizontal Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[800px] h-[1px] bg-gradient-to-r from-transparent via-[#45F3FF]/50 to-transparent shadow-[0_0_20px_rgba(69,243,255,0.5)]" />
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
          <div className="md:col-span-2 space-y-6 flex flex-col items-center md:items-start text-center md:text-left">
            <Link href="/" className="flex items-center gap-3">
              <GraduationCap className="w-8 h-8 text-white" />
              <span className="font-semibold text-xl tracking-tight text-white">
                ISKCON Elites Network
              </span>
            </Link>
            <p className="text-[#C5C6C7] max-w-sm leading-relaxed">
              A premier academic platform connecting global alumni, fostering mentorship, and empowering the next generation of leaders.
            </p>
          </div>
          
          <div className="text-center md:text-left">
            <h3 className="font-semibold text-white mb-6 tracking-tight text-sm uppercase">Platform</h3>
            <ul className="space-y-6 md:space-y-4 text-sm text-[#C5C6C7]">
              <li><Link href="/directory" className="hover:text-white transition-colors duration-300 inline-block py-1">Directory</Link></li>
              <li><Link href="/mentorship" className="hover:text-white transition-colors duration-300 inline-block py-1">Mentorship</Link></li>
              <li><Link href="/about" className="hover:text-white transition-colors duration-300 inline-block py-1">About</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center text-center md:text-left text-sm text-[#C5C6C7] gap-6 md:gap-0">
          <p>© 2026 ISKCON Elites Network. All rights reserved. | Phone: +91 63705 07337</p>
          <div className="flex flex-col md:flex-row gap-4 md:gap-6 text-xs">
            <span className="hover:text-white transition-colors cursor-pointer duration-300">Academic Authority Protocol</span>
            <span className="hover:text-white transition-colors cursor-pointer duration-300">Zero-Trust Architecture</span>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import { SignInButton, UserButton, useAuth } from "@clerk/nextjs";
import { motion } from "framer-motion";
import { GraduationCap } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { isLoaded, userId } = useAuth();

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-slate-950/50 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
            <GraduationCap className="w-6 h-6 text-slate-200" />
          </div>
          <span className="font-semibold text-lg tracking-tight">
            ISKCON Elites Network
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-400">
          <Link href="/directory" className="hover:text-slate-100 transition-colors">Directory</Link>
          <Link href="/mentorship" className="hover:text-slate-100 transition-colors">Mentorship</Link>
          <Link href="/about" className="hover:text-slate-100 transition-colors">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          {isLoaded && !userId && (
            <div className="flex items-center gap-2">
              <Link href="/sign-in" className="px-5 py-2.5 text-sm font-medium text-slate-300 hover:text-white transition-colors">
                Sign In
              </Link>
              <Link href="/sign-up" className="px-5 py-2.5 text-sm font-medium bg-white text-black rounded-full hover:bg-slate-200 transition-colors">
                Sign Up
              </Link>
            </div>
          )}
          {isLoaded && userId && (
            <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
          )}
        </div>
      </div>
    </motion.header>
  );
}

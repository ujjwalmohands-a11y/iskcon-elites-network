"use client";

import { useState, useEffect } from "react";
import { UserButton, useAuth } from "@clerk/nextjs";
import { motion, AnimatePresence } from "framer-motion";
import { GraduationCap, Menu, X } from "lucide-react";
import Link from "next/link";

export default function Header() {
  const { isLoaded, userId } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Prevent scroll when mobile menu is open
  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isMobileMenuOpen]);

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#0B0C10]/80 backdrop-blur-md"
    >
      <div className="container mx-auto px-6 h-20 flex items-center justify-between relative">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="p-2 bg-white/5 rounded-lg border border-white/10 group-hover:bg-white/10 transition-colors">
            <GraduationCap className="w-6 h-6 text-white" />
          </div>
          <span className="font-semibold text-lg tracking-tight text-white">
            ISKCON Elites Network
          </span>
        </Link>
        
        <nav className="hidden md:flex gap-12 text-xs font-medium text-neutral-400 absolute left-1/2 -translate-x-1/2 tracking-wide">
          <Link href="/directory" className="hover:text-white transition-colors duration-300">Directory</Link>
          <Link href="/mentorship" className="hover:text-white transition-colors duration-300">Mentorship</Link>
          <Link href="/about" className="hover:text-white transition-colors duration-300">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <div className="hidden md:flex items-center gap-4">
            {isLoaded && !userId && (
              <div className="flex items-center gap-2">
                <Link href="/sign-in" className="px-5 py-2.5 text-sm font-medium text-[#C5C6C7] hover:text-white transition-colors">
                  Sign In
                </Link>
                <Link href="/sign-up" className="px-5 py-2.5 text-sm font-medium bg-[#45F3FF] text-[#0B0C10] rounded-full hover:bg-[#34d8e5] transition-colors shadow-[0_0_15px_rgba(69,243,255,0.2)]">
                  Sign Up
                </Link>
              </div>
            )}
            {isLoaded && userId && (
              <UserButton appearance={{ elements: { avatarBox: "w-10 h-10" } }} />
            )}
          </div>
          
          {/* Mobile Menu Toggle & User Button (Mobile) */}
          <div className="flex md:hidden items-center gap-4">
            {isLoaded && userId && (
              <UserButton appearance={{ elements: { avatarBox: "w-9 h-9" } }} />
            )}
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 text-[#C5C6C7] hover:text-white bg-white/5 rounded-lg border border-white/10 transition-colors"
              aria-label="Open Menu"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Sheet */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: "-100%" }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: "-100%" }}
            transition={{ type: "spring", bounce: 0, duration: 0.4 }}
            className="fixed inset-0 w-full min-h-screen z-[100] bg-[#0B0C10] flex flex-col"
          >
            {/* Absolute Close Button */}
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="absolute top-5 right-5 p-2 text-white bg-white/5 rounded-full hover:bg-white/10 border border-white/10 transition-colors z-50"
              aria-label="Close Menu"
            >
              <X className="w-6 h-6" />
            </button>

            {/* Nav Links */}
            <nav className="flex flex-col items-start justify-start space-y-6 px-6 pt-24 text-2xl font-medium tracking-tight">
              <Link href="/directory" onClick={() => setIsMobileMenuOpen(false)} className="text-white hover:text-[#45F3FF] transition-colors">Directory</Link>
              <Link href="/mentorship" onClick={() => setIsMobileMenuOpen(false)} className="text-[#C5C6C7] hover:text-white transition-colors">Mentorship</Link>
              <Link href="/about" onClick={() => setIsMobileMenuOpen(false)} className="text-[#C5C6C7] hover:text-white transition-colors">About</Link>
            </nav>

            {/* Auth Buttons */}
            <div className="mt-auto flex flex-col gap-4 px-6 pb-8">
              {isLoaded && !userId && (
                <>
                  <Link href="/sign-in" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-lg font-medium text-white border border-white/10 rounded-2xl hover:bg-white/5 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/sign-up" onClick={() => setIsMobileMenuOpen(false)} className="w-full py-4 text-center text-lg font-medium bg-[#45F3FF] text-[#0B0C10] rounded-2xl shadow-[0_0_20px_rgba(69,243,255,0.25)]">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

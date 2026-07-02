"use client";

import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex-1 flex items-center justify-center relative overflow-hidden">
      {/* Premium Mesh Gradient Glow */}
      <div className="absolute -top-[20%] left-1/2 -translate-x-1/2 w-full max-w-[1200px] h-[800px] bg-gradient-to-tr from-[#45F3FF]/10 via-[#45F3FF]/5 to-transparent rounded-[100%] blur-[160px] pointer-events-none" />

      <div className="container mx-auto px-4 md:px-6 relative z-10 py-20 md:py-32 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="inline-flex items-center justify-center mb-8 px-5 py-2 rounded-full border border-white/10 bg-white/5 backdrop-blur-sm text-xs font-semibold uppercase tracking-widest text-neutral-300"
        >
          Premier Global Academic Network
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-5xl md:text-[80px] font-extrabold tracking-tight mb-8 leading-[1.1] text-white"
        >
          Connect with <br className="hidden md:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-neutral-500">
            World-Class Mentors
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="max-w-2xl mx-auto text-lg md:text-xl text-[#C5C6C7] mb-12 leading-relaxed"
        >
          Elevate your academic and professional trajectory. Engage directly with alumni from leading global institutions like IITs, NITs, and elite international universities.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="flex flex-col md:flex-row items-center justify-center gap-4 w-full"
        >
          <Link
            href="/directory"
            className="group flex items-center gap-2 bg-gradient-to-b from-white to-neutral-200 text-black px-8 py-4 rounded-full font-semibold shadow-[0_0_20px_rgba(255,255,255,0.15)] hover:scale-[1.02] hover:shadow-[0_0_30px_rgba(255,255,255,0.25)] transition-all duration-300 w-full md:w-auto justify-center"
          >
            Explore Directory
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
          <Link
            href="/mentorship"
            className="flex items-center gap-2 bg-black/20 border border-white/10 text-white px-8 py-4 rounded-full font-medium hover:bg-white/5 hover:scale-[1.02] transition-all duration-300 w-full md:w-auto justify-center"
          >
            Find a Mentor
          </Link>
        </motion.div>
      </div>
    </div>
  );
}

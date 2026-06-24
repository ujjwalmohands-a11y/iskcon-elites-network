"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, GraduationCap } from "lucide-react";
import Link from "next/link";
import { Alumnus } from "@prisma/client";

export default function DirectoryClient({ initialAlumni }: { initialAlumni: Alumnus[] }) {
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");

  // Derive unique categories dynamically
  const categories = ["All", ...Array.from(new Set(initialAlumni.map((a) => a.category)))].filter(Boolean);

  const filteredAlumni = initialAlumni.filter((alumnus) => {
    const matchesSearch = alumnus.name.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === "All" || alumnus.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-8">
      {/* Hybrid Search & Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-slate-900/50 p-4 rounded-2xl border border-white/5">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
          <input
            type="text"
            placeholder="Search alumni by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-950 border border-white/10 rounded-xl pl-12 pr-4 py-3 text-slate-200 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-slate-500 transition-shadow"
          />
        </div>
        <select
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
          className="bg-slate-950 border border-white/10 rounded-xl px-4 py-3 text-slate-200 focus:outline-none focus:ring-2 focus:ring-slate-500 appearance-none min-w-[200px]"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat === "All" ? "All Institutions" : cat}
            </option>
          ))}
        </select>
      </div>

      {/* Directory Grid */}
      {filteredAlumni.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredAlumni.map((alumnus) => (
              <motion.div
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                key={alumnus.id}
              >
                <Link href={`/directory/${alumnus.id}`} className="block h-full">
                  <div className="bg-slate-900/40 hover:bg-slate-800/50 border border-white/5 hover:border-white/10 rounded-2xl p-6 transition-all h-full flex flex-col group">
                    <div className="flex items-start justify-between mb-4">
                      <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center text-slate-400 font-medium text-lg border border-white/10 group-hover:border-slate-500 transition-colors">
                        {alumnus.name.charAt(0)}
                      </div>
                      <span className="text-xs font-medium px-3 py-1 rounded-full bg-slate-950 border border-white/10 text-slate-400">
                        {alumnus.cohort}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold text-slate-200 mb-2 group-hover:text-white transition-colors">
                      {alumnus.name}
                    </h3>
                    <div className="flex items-center gap-2 text-sm text-slate-500 mt-auto pt-4 border-t border-white/5">
                      <GraduationCap className="w-4 h-4" />
                      <span>{alumnus.category}</span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        <div className="text-center py-24 bg-slate-900/20 border border-white/5 rounded-2xl">
          <p className="text-slate-400 text-lg">No alumni records found matching your filters.</p>
        </div>
      )}
    </div>
  );
}

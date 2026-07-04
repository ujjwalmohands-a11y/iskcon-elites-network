"use client";

import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = ["All Stories", "UPSC", "Business", "Science", "Healthcare", "Youth"];

const SECONDARY_STORIES = [
  {
    title: "Finding Balance: A CEO's Journey of Mindful Leadership",
    category: "Business",
    author: "Rahul Bajaj",
    role: "Tech Executive",
    imageUrl: "https://images.unsplash.com/photo-1556761175-5973dc0f32d7?q=80&w=1632&auto=format&fit=crop",
  },
  {
    title: "Devotion in the ER: Healing with Compassion",
    category: "Healthcare",
    author: "Dr. Ananya Singh",
    role: "Chief Surgeon",
    imageUrl: "https://images.unsplash.com/photo-1551076805-e1869033e561?q=80&w=1632&auto=format&fit=crop",
  },
  {
    title: "Space and Spirituality: Exploring the Cosmos within",
    category: "Science",
    author: "K. Venkat",
    role: "Astrophysicist",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1744&auto=format&fit=crop",
  },
  {
    title: "Youth Leadership in the Digital Age",
    category: "Youth",
    author: "Sneha Rao",
    role: "Startup Founder",
    imageUrl: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=1742&auto=format&fit=crop",
  }
];

export default function SuccessStoriesPage() {
  const [activeCategory, setActiveCategory] = useState("All Stories");

  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-24 pb-20">
      <div className="container mx-auto px-6">
        
        {/* Header Section */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0C1A30] mb-6">
            Journeys of <span className="text-[#C5A059] italic">Purpose</span>
          </h1>
          <p className="text-lg text-gray-600 leading-relaxed">
            Discover how our elite members navigate the complexities of high-level careers while staying deeply rooted in spiritual wisdom and devotion.
          </p>
        </div>

        {/* Filter Navigation */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-16">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                activeCategory === cat 
                  ? "bg-[#0C1A30] text-white shadow-md" 
                  : "bg-white text-gray-600 border border-gray-200 hover:border-[#C5A059] hover:text-[#0C1A30]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Featured Major Card */}
        <div className="mb-12 rounded-3xl overflow-hidden bg-white shadow-sm border border-gray-100 flex flex-col md:flex-row group cursor-pointer hover:shadow-lg transition-shadow">
          <div className="md:w-3/5 h-80 md:h-[500px] relative overflow-hidden">
            <div className="absolute inset-0 bg-[#0C1A30]/20 group-hover:bg-transparent transition-colors z-10" />
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105"
              style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=1740&auto=format&fit=crop")' }}
            />
          </div>
          <div className="md:w-2/5 p-10 md:p-14 flex flex-col justify-center relative">
            <span className="text-[#D98A29] font-bold text-xs uppercase tracking-widest mb-4 block">UPSC / Civil Services</span>
            <h2 className="text-3xl font-serif font-bold text-[#0C1A30] mb-6 leading-tight group-hover:text-[#D98A29] transition-colors">
              How Bhagavad Gita helped me crack UPSC and serve with integrity
            </h2>
            <p className="text-gray-600 mb-8 line-clamp-3">
              An inspiring account of balancing intense preparation with inner peace, and the role of timeless wisdom in modern administrative challenges.
            </p>
            
            <div className="mt-auto flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-200 rounded-full overflow-hidden border border-gray-300">
                  <div className="w-full h-full bg-gray-300" />
                </div>
                <div>
                  <p className="font-semibold text-sm text-[#0C1A30]">Vikram Desai, IAS</p>
                  <p className="text-xs text-gray-500">Joint Secretary</p>
                </div>
              </div>
              
              <Link href="#" className="flex items-center gap-2 text-[#0C1A30] font-semibold text-sm group-hover:text-[#D98A29] transition-colors">
                Read Story <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* Secondary Card Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {SECONDARY_STORIES.map((story, i) => (
            <div key={i} className="bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 flex flex-col sm:flex-row group cursor-pointer hover:shadow-md transition-shadow">
              <div className="sm:w-2/5 h-48 sm:h-auto relative overflow-hidden">
                <div 
                  className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-110"
                  style={{ backgroundImage: `url(${story.imageUrl})` }}
                />
              </div>
              <div className="sm:w-3/5 p-6 flex flex-col justify-center">
                <span className="text-[#C5A059] font-bold text-[10px] uppercase tracking-widest mb-2 block">{story.category}</span>
                <h3 className="text-lg font-serif font-bold text-[#0C1A30] mb-4 leading-snug group-hover:text-[#D98A29] transition-colors">
                  {story.title}
                </h3>
                <div className="mt-auto pt-4 border-t border-gray-100">
                  <p className="font-semibold text-sm text-[#0C1A30]">{story.author}</p>
                  <p className="text-xs text-gray-500">{story.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="mt-16 text-center">
          <button className="px-8 py-3 rounded-full border-2 border-[#0C1A30] text-[#0C1A30] font-semibold hover:bg-[#0C1A30] hover:text-white transition-colors">
            Load More Stories
          </button>
        </div>

      </div>
    </div>
  );
}

"use client";

import { ArrowRight, Search, Target, BookOpen, Briefcase, Award } from "lucide-react";
import Link from "next/link";

export default function MentorshipPage() {
  return (
    <div className="min-h-screen bg-[#FDFBF7] pt-32 pb-20">
      
      {/* Hero Section */}
      <div className="container mx-auto px-6 mb-16 text-center max-w-3xl">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-[#0C1A30] mb-6">
          Mentorship <span className="text-[#C5A059] italic">Hub</span>
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Connect with experienced leaders who have walked the path before you, or give back by sharing your wisdom with the next generation.
        </p>
      </div>

      {/* Dual Action Portal */}
      <div className="container mx-auto px-6 mb-24">
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Find a Mentor */}
          <div className="bg-[#0C1A30] rounded-3xl p-10 md:p-14 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-bl from-[#C5A059]/20 to-transparent rounded-bl-[100%] z-0 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10">
              <Search className="w-12 h-12 text-[#C5A059] mb-6" />
              <h2 className="text-3xl font-serif font-bold mb-4">Find a Mentor</h2>
              <p className="text-gray-300 mb-10 max-w-sm">
                Seek guidance from accomplished professionals in your field. Navigate your career with values-driven leadership.
              </p>
              <Link href="/directory" className="inline-flex items-center gap-2 bg-[#D98A29] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#c47a22] transition-colors shadow-lg">
                Browse Mentors <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Become a Mentor */}
          <div className="bg-white border border-gray-200 rounded-3xl p-10 md:p-14 text-[#0C1A30] relative overflow-hidden group shadow-sm hover:shadow-md transition-shadow">
            <div className="absolute bottom-0 right-0 w-64 h-64 bg-gradient-to-tl from-[#D98A29]/10 to-transparent rounded-tl-[100%] z-0 transition-transform duration-700 group-hover:scale-110" />
            <div className="relative z-10">
              <Target className="w-12 h-12 text-[#D98A29] mb-6" />
              <h2 className="text-3xl font-serif font-bold mb-4">Become a Mentor</h2>
              <p className="text-gray-600 mb-10 max-w-sm">
                Share your journey, impart your wisdom, and help shape the next generation of spiritually grounded leaders.
              </p>
              <button className="inline-flex items-center gap-2 bg-[#0C1A30] text-white px-8 py-3 rounded-full font-semibold hover:bg-gray-800 transition-colors shadow-md">
                Apply to Mentor <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

        </div>
      </div>

      {/* Popular Mentorship Areas */}
      <div className="bg-white py-20 border-y border-gray-100 mb-24">
        <div className="container mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-serif font-bold text-[#0C1A30] mb-4">Popular Focus Areas</h2>
            <p className="text-gray-600">Our mentors specialize in guiding you through critical career transitions.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Briefcase, title: "Career Guidance", desc: "Navigate promotions, pivots, and corporate leadership." },
              { icon: Award, title: "Civil Services", desc: "Preparation strategy and balancing administrative duties." },
              { icon: BookOpen, title: "Startup Mentoring", desc: "Building ethical businesses and securing funding." }
            ].map((area, i) => (
              <div key={i} className="bg-[#FDFBF7] p-8 rounded-2xl border border-gray-200 text-center hover:border-[#C5A059]/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 mx-auto bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-gray-100 group-hover:bg-[#C5A059]/10 transition-colors">
                  <area.icon className="w-8 h-8 text-[#0C1A30] group-hover:text-[#D98A29] transition-colors" />
                </div>
                <h3 className="font-bold text-[#0C1A30] mb-2">{area.title}</h3>
                <p className="text-sm text-gray-600">{area.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mentor Spotlight */}
      <div className="container mx-auto px-6">
        <div className="bg-[#0C1A30] rounded-3xl overflow-hidden flex flex-col md:flex-row shadow-xl">
          <div className="md:w-1/2 p-10 md:p-16 flex flex-col justify-center">
            <span className="text-[#C5A059] font-bold text-xs uppercase tracking-widest mb-4">Mentor Spotlight</span>
            <h2 className="text-3xl md:text-4xl font-serif font-bold text-white mb-4 leading-tight">
              Dr. Sanjay Kapoor
            </h2>
            <p className="text-[#D98A29] font-semibold mb-6">Former Director, Global Strategy</p>
            
            <div className="bg-white/5 border border-white/10 p-6 rounded-xl mb-8 relative">
              <p className="text-gray-300 italic text-sm leading-relaxed">
                &quot;Mentorship is not just about transferring skills; it&apos;s about transferring values. True success in the corporate world requires an anchor in spiritual principles.&quot;
              </p>
            </div>
            
            <button className="bg-[#D98A29] text-white px-8 py-3 rounded-full font-semibold hover:bg-[#c47a22] transition-colors shadow-lg w-fit">
              Book a Session
            </button>
          </div>
          
          <div className="md:w-1/2 h-80 md:h-auto relative bg-gray-200">
             <div 
                className="absolute inset-0 bg-cover bg-center"
                style={{ backgroundImage: 'url("https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1587&auto=format&fit=crop")' }}
              />
          </div>
        </div>
      </div>

    </div>
  );
}

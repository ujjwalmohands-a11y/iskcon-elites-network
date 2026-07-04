import { Metadata } from "next";

export const metadata: Metadata = {
  title: "About | ISKCON Elites Network",
  description: "Learn more about the ISKCON Elites Network.",
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#0A111F] text-white font-sans flex flex-col py-24 md:py-32">
      <div className="container mx-auto px-6 max-w-4xl flex-1 flex flex-col items-center text-center">
        
        {/* Overhead Tag */}
        <div className="inline-block border border-[#D29E4D]/50 rounded-full px-4 py-1.5 mb-10">
          <span className="text-[#D29E4D] text-[11px] font-bold tracking-[0.25em] uppercase">
            Connecting the Global Community
          </span>
        </div>
        
        {/* Main Heading */}
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold font-serif mb-16 leading-tight">
          A Network of <span className="text-[#D29E4D] italic font-normal">Distinguished</span> Individuals
        </h1>
        
        {/* Body Content */}
        <div className="space-y-8 text-lg md:text-[21px] text-slate-300 font-light leading-[1.8] max-w-3xl text-center">
          <p>
            <strong className="text-white font-semibold">ISKCON Elite</strong> is a network of distinguished individuals associated with ISKCON who have excelled in diverse fields such as government service, entrepreneurship, business, administration, politics, science, education, technology, healthcare, environmental sustainability, arts, and social leadership.
          </p>
          <p>
            Their connection with ISKCON has not only enriched their spiritual lives but has also positively influenced their academic achievements, professional growth, leadership abilities, and personal character. Through the values, discipline, and wisdom gained from devotional practice, they have been able to make meaningful contributions to society while pursuing excellence in their respective careers.
          </p>
          <p>
            These accomplished individuals serve as ambassadors of ISKCON within professional, academic, and public spheres, demonstrating that spiritual principles and worldly success can go hand in hand. Their lives inspire others by showcasing how <span className="text-[#D29E4D] font-medium">Krishna consciousness</span> can support both personal fulfillment and outstanding achievement in the modern world.
          </p>
        </div>
        
        {/* Buttons */}
        <div className="mt-16 flex flex-col sm:flex-row items-center gap-6 justify-center w-full">
          <button className="bg-[#D29E4D] text-white font-semibold py-4 px-10 rounded-full hover:bg-[#b88942] transition-colors w-full sm:w-auto tracking-wide">
            Join the Network
          </button>
          <button className="bg-transparent border border-white/20 text-white font-medium py-4 px-10 rounded-full hover:bg-white/5 transition-colors flex items-center justify-center gap-3 w-full sm:w-auto tracking-wide">
            View Directory <span className="text-xl leading-none">&rarr;</span>
          </button>
        </div>
        
      </div>
    </div>
  );
}

import { ClerkProvider } from '@clerk/nextjs';
import { dark } from '@clerk/themes';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import CustomCursor from '@/components/CustomCursor';

export const metadata: Metadata = {
 title: 'Iskcon Elites Network',
 description: 'The exclusive network for alumni and speakers.',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
    <ClerkProvider 
      afterSignOutUrl="/"
      appearance={({
        baseTheme: dark,
        elements: {
          card: "bg-[#12141C]/80 border border-white/10 backdrop-blur-md shadow-[0_0_50px_rgba(69,243,255,0.05)] rounded-2xl",
          navbar: "hidden",
          headerTitle: "text-white font-bold tracking-tight text-2xl",
          headerSubtitle: "text-neutral-400 text-sm",
          formFieldLabel: "text-neutral-300 font-medium text-xs uppercase tracking-wider",
          formFieldInput: "bg-[#0B0C10] border border-white/10 text-white rounded-xl focus:border-[#45F3FF] focus:ring-1 focus:ring-[#45F3FF]/50 transition-all",
          dividerLine: "bg-white/10",
          dividerText: "text-neutral-500 text-xs uppercase tracking-widest",
          formButtonPrimary: "bg-[#45F3FF] hover:bg-[#45F3FF]/90 text-[#0B0C10] font-semibold text-sm rounded-xl shadow-[0_0_20px_rgba(69,243,255,0.3)] transition-all transform active:scale-[0.98]",
          socialButtonsBlockButton: "bg-white/5 border border-white/10 text-white rounded-xl hover:bg-white/10 transition-all",
          socialButtonsBlockButtonText: "text-white font-medium",
          footerActionText: "text-neutral-400",
          footerActionLink: "text-[#45F3FF] hover:text-[#45F3FF]/80 transition-all font-medium"
        }
      }) as any}
    >
      <html lang="en">
        <body className="antialiased bg-[#0B0C10] text-[#C5C6C7] min-h-screen flex flex-col">
         <CustomCursor />
         <div className="relative min-h-screen bg-[#0B0C10] text-white overflow-x-hidden selection:bg-[#45F3FF]/30 flex flex-col">
           
           {/* LAYER 1: Ambient Backdrop Glow Orbs */}
           <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
             {/* Central Hero Glow */}
             <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-gradient-to-b from-[#45F3FF]/10 via-indigo-500/5 to-transparent blur-[140px] rounded-full" />
             
             {/* Subtle Secondary Right Glow */}
             <div className="absolute top-[30%] right-[-10%] w-[600px] h-[600px] bg-purple-500/5 blur-[120px] rounded-full" />
           </div>

           {/* LAYER 2: High-End SVG Grid Overlay */}
           <div 
             className="absolute inset-0 pointer-events-none z-0 opacity-40" 
             style={{
               backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='40' height='40' viewBox='0 0 40 40'%3E%3Cpath d='M 40 0 L 0 0 0 40' fill='none' stroke='%2345F3FF' stroke-width='0.5' opacity='0.8'/%3E%3C/svg%3E")`,
               maskImage: 'linear-gradient(to bottom, white, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 90%)',
               WebkitMaskImage: 'linear-gradient(to bottom, white, rgba(255,255,255,0.3) 50%, rgba(255,255,255,0) 90%)',
             }}
           />

           {/* LAYER 3: Core Page Content */}
           <div className="relative z-10 flex-1 flex flex-col">
             <Header />
             <main className="flex-1 flex flex-col pt-20">
               {children}
             </main>
             <Footer />
           </div>
           
         </div>
       </body>
     </html>
   </ClerkProvider>
 );
}

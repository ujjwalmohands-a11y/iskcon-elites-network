import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import { Inter, Playfair_Display } from 'next/font/google';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

export const metadata: Metadata = {
 title: 'Iskcon Elites Network',
 description: 'Where Spiritual Wisdom Meets Professional Excellence.',
};

export default function RootLayout({
 children,
}: {
 children: React.ReactNode;
}) {
 return (
    <ClerkProvider 
      afterSignOutUrl="/"
      appearance={{
        elements: {
          card: "bg-white border border-gray-100 shadow-xl rounded-2xl",
          headerTitle: "text-[#0C1A30] font-bold tracking-tight text-2xl font-serif",
          headerSubtitle: "text-gray-500 text-sm",
          formFieldLabel: "text-gray-700 font-medium text-xs uppercase tracking-wider",
          formFieldInput: "bg-white border border-gray-200 text-[#0C1A30] rounded-xl focus:border-[#D98A29] focus:ring-1 focus:ring-[#D98A29] transition-all",
          formButtonPrimary: "bg-[#D98A29] hover:bg-[#c47a22] text-white font-semibold text-sm rounded-xl shadow-md transition-all transform active:scale-[0.98]",
        }
      }}
    >
      <html lang="en" className={`${inter.variable} ${playfair.variable}`}>
        <body className="antialiased bg-[var(--color-brand-cream)] text-[var(--color-brand-navy)] min-h-screen flex flex-col font-sans selection:bg-[#D98A29]/20 selection:text-[#0C1A30]">
         <div className="relative min-h-screen flex flex-col overflow-x-hidden">
           
           {/* Core Page Content */}
           <div className="relative z-10 flex-1 flex flex-col">
             <Header />
             <main className="flex-1 flex flex-col">
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

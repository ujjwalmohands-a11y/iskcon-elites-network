import { ClerkProvider } from '@clerk/nextjs';
import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

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
   <ClerkProvider afterSignOutUrl="/">
     <html lang="en">
       <body className="antialiased bg-slate-950 text-slate-50 min-h-screen flex flex-col">
         <Header />
         <main className="flex-1 flex flex-col pt-20">
           {children}
         </main>
         <Footer />
       </body>
     </html>
   </ClerkProvider>
 );
}

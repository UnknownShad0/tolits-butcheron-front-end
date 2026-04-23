import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { colors } from '@/components/ui';

export const metadata: Metadata = {
  title: "Tolit's Butcheron Basketball",
  description: "Community basketball platform powered by Tolit's Butcheron",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col" style={{ backgroundColor: colors.bg, color: colors.text }}>
        <Navbar />
        <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8">
          <div className=''>
            {children}
          </div>
        </main>
        <footer className="py-6 text-center border-t" style={{ backgroundColor: colors.surfaceDeep, borderColor: colors.border }}>
          <Image src="/logos/tolit-business-logo.jpg" alt="Tolit's Butcheron" width={48} height={48} className="rounded-full mx-auto mb-2 object-cover" />
          <p className="text-sm" style={{ color: colors.textMuted }}>
            Powered by <span className="font-bold font-display tracking-wide" style={{ color: colors.primaryLight }}>TOLIT&apos;S BUTCHERON</span>
          </p>
          <p className="text-xs mt-1" style={{ color: colors.textDim }}>Fresh cuts, every day. 🥩</p>
        </footer>
      </body>
    </html>
  );
}

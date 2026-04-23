import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { cv } from '@/components/ui';

export const metadata: Metadata = {
  title: "Tolit's Butcheron Basketball",
  description: "Community basketball platform powered by Tolit's Butcheron",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen flex flex-col">
        <ThemeProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>
          <footer className="py-6 text-center border-t" style={{ backgroundColor: cv.surfaceDeep, borderColor: cv.border }}>
            <Image src="/logos/tolit-business-logo.jpg" alt="Tolit's Butcheron" width={48} height={48} className="rounded-full mx-auto mb-2 object-cover" />
            <p className="text-sm" style={{ color: cv.textMuted }}>
              Powered by <span className="font-bold font-display tracking-wide" style={{ color: cv.primaryLight }}>TOLIT&apos;S BUTCHERON</span>
            </p>
            <p className="text-xs mt-1" style={{ color: cv.textDim }}>Fresh cuts, every day. 🥩</p>
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}

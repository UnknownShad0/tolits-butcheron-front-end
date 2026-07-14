import type { Metadata } from 'next';
import './globals.css';
import Image from 'next/image';
import Navbar from '@/components/Navbar';
import { ThemeProvider } from '@/components/ThemeProvider';
import { AuthProvider } from '@/lib/auth';
import { cv } from '@/components/ui';
import { MapPin } from "lucide-react";
import { FaFacebook } from "react-icons/fa";

export const metadata: Metadata = {
  title: "Tolit's Butcheron Basketball",
  description: "Community basketball platform powered by Tolit's Butcheron",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'var(--bg)', color: 'var(--text)' }} className="min-h-screen flex flex-col">
        <ThemeProvider>
          <AuthProvider>
          <Navbar />
          <main className="flex-1 max-w-5xl mx-auto w-full px-4 py-8">{children}</main>

<footer
  className="border-t"
  style={{ backgroundColor: cv.surfaceDeep, borderColor: cv.border }}
>
  <div className="max-w-6xl mx-auto px-4 py-8 grid gap-6 md:grid-cols-3 items-center text-center md:text-left">
    
    {/* Logo + Brand */}
    <div className="flex flex-col items-center">
      <Image
        src="/logos/tolit-business-logo.jpg"
        alt="Tolit's Butcheron"
        width={56}
        height={56}
        className="rounded-full mb-3 object-cover shadow-md"
      />

      <p className="text-sm" style={{ color: cv.textMuted }}>
        Powered by{" "}
        <span
          className="font-bold tracking-wide"
          style={{ color: cv.primaryLight }}
        >
          TOLIT&apos;S BUTCHERON
        </span>
      </p>

      <p className="text-xs mt-1" style={{ color: cv.textDim }}>
        Fresh cuts, every day. 🥩
      </p>
    </div>

    {/* Address */}
    <div className="flex flex-col items-center gap-2">
      <p
        className="text-sm font-semibold"
        style={{ color: cv.primaryLight }}
      >
        Visit Us
      </p>

      <div className="flex items-start gap-2 text-xs">
        <MapPin size={16} className="mt-0.5 opacity-80" />
        <span style={{ color: cv.textMuted }}>
          001 Patulo Diaz Compound, Loma de Gato, Marilao, Bulacan
        </span>
      </div>
    </div>

    {/* Socials */}
    <div className="flex flex-col items-center  gap-2">
      <p
        className="text-sm font-semibold"
        style={{ color: cv.primaryLight }}
      >
        Connect With Us
      </p>

      <div className="flex gap-3">
        <a
          href="https://www.facebook.com/tolits.francisco.752"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
          style={{
            backgroundColor: cv.surface,
            color: cv.textMuted,
          }}
        >
          <FaFacebook size={24} />
          <span className="text-xs">Tolit&apos;s Butcheron</span>
        </a>

        <a
          href="https://www.facebook.com/profile.php?id=100094452100772"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-300 hover:scale-105 hover:shadow-md"
          style={{
            backgroundColor: cv.surface,
            color: cv.textMuted,
          }}
        >
          <FaFacebook size={24} />
          <span className="text-xs">Tolit&apos;s Butcheron Basketball</span>
        </a>
      </div>
    </div>
  </div>

  {/* Bottom bar */}
  <div
    className="text-center text-xs py-3 border-t"
    style={{ borderColor: cv.border, color: cv.textDim }}
  >
    © {new Date().getFullYear()} Tolit&apos;s Butcheron. All rights reserved.
  </div>
</footer>
        </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

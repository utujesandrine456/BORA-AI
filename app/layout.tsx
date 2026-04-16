import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import { Toaster } from "react-hot-toast";

// Use weights 500 (medium) for normal text to satisfy requirement "not light"
// Include 700 and 900 for bold headers
const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BORA - AI Recruitment Platform",
  description: "Advanced Recruitment Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full bg-dark">
      <body className={`${urbanist.className} font-medium h-full antialiased bg-dark text-cream`}>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'border border-cream/20 bg-dark text-cream shadow-2xl rounded-md px-4 py-3',
            duration: 4000,
            style: {
              background: 'rgba(0, 0, 0, 0.95)',
              color: '#DAC5A7',
              border: '1px solid rgba(220, 197, 167, 0.2)',
              backdropFilter: 'blur(16px)',
            },
            success: {
              iconTheme: {
                primary: '#22c55e',
                secondary: '#000000',
              },
              style: {
                border: '1px solid rgba(34, 197, 94, 0.4)',
              },
            },
            error: {
              iconTheme: {
                primary: '#ef4444',
                secondary: '#000000',
              },
              style: {
                border: '1px solid rgba(239, 68, 68, 0.4)',
              },
            },
            loading: {
              iconTheme: {
                primary: '#eab308',
                secondary: '#000000',
              },
              style: {
                border: '1px solid rgba(234, 179, 8, 0.4)',
              },
            },
          }}
        />
        <div className="flex min-h-screen">
          <Sidebar />
          <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

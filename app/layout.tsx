import type { Metadata } from "next";
import { Urbanist } from "next/font/google";
import { Toaster } from "react-hot-toast";
import { Sidebar } from "@/components/Sidebar";
import "./globals.css";

const urbanist = Urbanist({
  subsets: ["latin"],
  weight: ["500", "700", "900"],
  variable: "--font-urbanist",
  display: "swap",
});

export const metadata: Metadata = {
  title: "BORA - AI Recruitment Platform",
  description: "Advanced AI-powered recruitment and screening platform.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${urbanist.variable} h-full bg-black`}>
      <body className={`${urbanist.className} font-medium h-full antialiased bg-black text-[#E5D4B6]`}>
        <Toaster
          position="top-right"
          toastOptions={{
            className: 'border border-[#E5D4B6]/20 bg-black text-[#E5D4B6] shadow-2xl rounded-md px-4 py-3',
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

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
        <Toaster position="top-right" />
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

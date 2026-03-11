import type { Metadata } from "next";
import "./globals.css";
import { AppSidebar } from "@/components/layout/AppSidebar";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Heineken Off Trade OS",
  description: "Operating System for Sales Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased flex h-screen bg-slate-950 overscroll-none overflow-hidden selection:bg-green-500/30 selection:text-green-200">
        <AppSidebar />
        <main className="flex-1 overflow-auto p-8 relative">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-green-900/20 via-slate-950 to-slate-950 -z-10 pointer-events-none" />
          {children}
        </main>
        <Toaster position="top-right" theme="dark" closeButton />
      </body>
    </html>
  );
}

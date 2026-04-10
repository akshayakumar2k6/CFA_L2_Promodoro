import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import { Sidebar } from "@/components/layout/Sidebar";
import { Header } from "@/components/layout/Header";
import { StoreInitializer } from "@/components/StoreInitializer";
import { fetchAppState } from "@/app/actions";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Pomodoro OS",
  description: "CFA Level 2 Productivity Engine",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // Fetch initial global state from PostgreSQL DB
  const { tasks, dailyLogs, stats } = await fetchAppState()

  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased dark`}
    >
      <body className="h-full flex overflow-hidden bg-background text-foreground">
        <StoreInitializer tasks={tasks} dailyLogs={dailyLogs} stats={stats} />
        <Sidebar />
        <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
          <Header />
          <main className="flex-1 overflow-y-auto bg-background p-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

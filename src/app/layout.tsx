import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { cookies } from "next/headers";
import { LanguageProvider } from "@/i18n/LanguageContext";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Wholesale Clothing CRM",
  description: "BTEC Unit 6 Cloud Networking Assignment Prototype",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const role = cookieStore.get('user_role')?.value;
  const username = cookieStore.get('user_username')?.value;
  const locale = (cookieStore.get('app_locale')?.value as any) || 'en';

  const isLoggedIn = !!role;

  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white flex h-screen overflow-hidden text-slate-900 transition-colors duration-200`}
      >
        <LanguageProvider initialLocale={locale}>
          <div className="flex h-screen w-full bg-white">
            {isLoggedIn && <Sidebar role={role} />}
              <div className="flex flex-col flex-1 overflow-hidden bg-slate-50 print:overflow-visible print:bg-white">
                {isLoggedIn && <Navbar role={role} username={username} />}
                <main className={`flex-1 overflow-y-auto print:overflow-visible bg-slate-50 ${isLoggedIn ? 'p-4 md:p-8' : ''} print:p-0 print:bg-white`}>
                  {children}
              </main>
            </div>
          </div>
        </LanguageProvider>
      </body>
    </html>
  );
}

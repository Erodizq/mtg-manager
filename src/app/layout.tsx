import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/layout/Navigation";
import { AuthProvider } from "@/lib/auth-context";
import { ThemeProvider } from "@/lib/theme-context";
import ThemedBackground from "@/components/ThemedBackground";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MTG Manager",
  description: "Manage your Magic: The Gathering collection",
  manifest: "/manifest.json",
  appleWebApp: {
    capable: true,
    statusBarStyle: "black-translucent",
    title: "MTG Manager",
  },
  applicationName: "MTG Manager",
  themeColor: "#020617",
};

export const viewport = {
  themeColor: "#020617",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  userScalable: false, // Prevent zoom on mobile for native app feel
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <AuthProvider>
          <ThemeProvider>
            <ThemedBackground />
            <div className="min-h-screen text-slate-100 pb-20 md:pb-0 relative">
              <Navigation />
              <main className="container mx-auto">
                {children}
              </main>
            </div>
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}

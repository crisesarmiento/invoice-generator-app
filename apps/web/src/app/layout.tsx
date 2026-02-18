import type { Metadata } from "next";
import { Geist_Mono, Manrope, Space_Grotesk } from "next/font/google";

import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const bodySans = Manrope({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const displaySans = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Invoice Studio",
  description: "Create and manage invoices for your freelance business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${bodySans.variable} ${displaySans.variable} ${geistMono.variable} min-h-screen antialiased`}
      >
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}

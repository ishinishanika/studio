import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";
import { FirebaseClientProvider } from "@/firebase";
import { ThemeProvider } from "@/components/theme-provider";

const inter = Inter({ subsets: ["latin"], variable: "--font-sans" });

export const metadata: Metadata = {
  title: "LifeFlow",
  description: "A community-focused app for blood donation.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="data:," />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <FirebaseClientProvider>
          <ThemeProvider>
            {children}
            <Toaster />
          </ThemeProvider>
        </FirebaseClientProvider>
      </body>
    </html>
  );
}

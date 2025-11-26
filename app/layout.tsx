import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import { Toaster } from "@/components/ui/sonner";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "./ConvexClientProvider";
import { ClerkProvider } from "@clerk/nextjs";
import { shadesOfPurple } from "@clerk/themes";
import Navbar from "@/components/buildComponents/Navbar";
import Footer from "@/components/buildComponents/Footer";
// const geistSans = Geist({
//   variable: "--font-geist-sans",
//   subsets: ["latin"],
// });

// const geistMono = Geist_Mono({
//   variable: "--font-geist-mono",
//   subsets: ["latin"],
// });
export const inter = Inter({
  weight: "500",
  subsets: ["latin"],
});
export const metadata: Metadata = {
  title: "Creators Platform",
  description: "Content Creation Platform Powered by AI",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <ClerkProvider
            appearance={{
              theme: shadesOfPurple,
            }}
          >
            <ConvexClientProvider>
              <Navbar />
              <Toaster richColors />
              {children}
            </ConvexClientProvider>
          </ClerkProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

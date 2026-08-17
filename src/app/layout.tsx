import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Dancing_Script,
  Geist_Mono,
} from "next/font/google";
import { ReactToaster } from "@/components/ui/react-toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { PageRevealObserver } from "@/components/page-reveal-observer";
import { ThemeProvider } from "@/components/theme-provider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  variable: "--font-bricolage",
  subsets: ["latin"],
});
const dancingScript = Dancing_Script({
  variable: "--font-wordmark",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: { default: "easymail", template: "%s · easymail" },
  description: "A reusable SMTP email API for people and organizations.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      suppressHydrationWarning
      lang="en"
      className={`${bricolage.variable} ${dancingScript.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <ReactToaster />
        </ThemeProvider>
        <PageRevealObserver />
      </body>
    </html>
  );
}

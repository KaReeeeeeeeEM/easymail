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
  metadataBase: new URL("https://easymail.almareem.com"),
  title: { default: "Reusable Email API for Gmail and SMTP | easymail", template: "%s · easymail" },
  description: "Connect Gmail or any SMTP sender once, issue rotatable API keys, and send transactional email from any application through one secure HTTPS API.",
  keywords: ["email API", "Gmail API", "SMTP API", "Nodemailer service", "transactional email", "email delivery API", "Google Workspace SMTP"],
  authors: [{ name: "easymail" }],
  creator: "easymail",
  publisher: "easymail",
  alternates: { canonical: "/" },
  openGraph: { type: "website", url: "/", siteName: "easymail", title: "Reusable Email API for Gmail and SMTP", description: "Turn a saved SMTP sender into a secure, reusable HTTPS email API.", images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: "easymail email API" }] },
  twitter: { card: "summary_large_image", title: "Reusable Email API for Gmail and SMTP", description: "Send transactional email through your own Gmail or SMTP credentials using one HTTPS API.", images: ["/opengraph-image"] },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1, "max-video-preview": -1 } },
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
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "SoftwareApplication", name: "easymail", applicationCategory: "DeveloperApplication", operatingSystem: "Web", url: "https://easymail.almareem.com", description: "A reusable Gmail and SMTP email API for transactional delivery.", offers: { "@type": "Offer", price: "0", priceCurrency: "USD" } }).replace(/</g, "\\u003c") }} />
        <ThemeProvider>
          <TooltipProvider>{children}</TooltipProvider>
          <ReactToaster />
        </ThemeProvider>
        <PageRevealObserver />
      </body>
    </html>
  );
}

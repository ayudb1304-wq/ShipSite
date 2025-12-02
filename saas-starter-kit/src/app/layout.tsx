import type { Metadata, Viewport } from "next";
import { Plus_Jakarta_Sans, JetBrains_Mono } from "next/font/google";
import "./globals.css";

/**
 * Fonts Configuration
 * 
 * Using Plus Jakarta Sans for body text and JetBrains Mono for code.
 * These are distinctive, modern fonts that set the design apart.
 */
const fontSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin"],
  display: "swap",
});

const fontMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

/**
 * Metadata Configuration
 * 
 * Comprehensive SEO setup for the application.
 * Update these values with your actual site information.
 */
export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"),
  title: {
    default: "SaaSKit - Ship Your SaaS in Days, Not Months",
    template: "%s | SaaSKit",
  },
  description:
    "The ultimate Next.js SaaS starter kit with authentication, payments, database, and beautiful UI components. Build and launch your product faster.",
  keywords: [
    "SaaS",
    "Starter Kit",
    "Next.js",
    "React",
    "TypeScript",
    "Tailwind CSS",
    "Supabase",
    "Stripe",
    "Boilerplate",
  ],
  authors: [{ name: "SaaSKit Team" }],
  creator: "SaaSKit",
  publisher: "SaaSKit",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "SaaSKit",
    title: "SaaSKit - Ship Your SaaS in Days, Not Months",
    description:
      "The ultimate Next.js SaaS starter kit with authentication, payments, database, and beautiful UI components.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaSKit - SaaS Starter Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaSKit - Ship Your SaaS in Days, Not Months",
    description:
      "The ultimate Next.js SaaS starter kit with authentication, payments, and beautiful UI.",
    images: ["/og-image.png"],
    creator: "@saaskit",
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon-16x16.png",
    apple: "/apple-touch-icon.png",
  },
  manifest: "/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0a0a0a" },
  ],
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${fontSans.variable} ${fontMono.variable} font-sans antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

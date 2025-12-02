import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { Providers } from "@/components/providers"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: {
    default: "SaaS Starter Kit",
    template: "%s | SaaS Starter Kit",
  },
  description: "A production-ready SaaS starter kit built with Next.js, Supabase, and Stripe",
  keywords: ["SaaS", "Next.js", "Starter Kit", "Boilerplate"],
  authors: [{ name: "Your Name" }],
  creator: "Your Name",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yourdomain.com",
    siteName: "SaaS Starter Kit",
    title: "SaaS Starter Kit",
    description: "A production-ready SaaS starter kit built with Next.js, Supabase, and Stripe",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "SaaS Starter Kit",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SaaS Starter Kit",
    description: "A production-ready SaaS starter kit built with Next.js, Supabase, and Stripe",
    images: ["/og-image.png"],
  },
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
  verification: {
    // Add your verification codes here
    // google: "your-google-verification-code",
    // yandex: "your-yandex-verification-code",
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}

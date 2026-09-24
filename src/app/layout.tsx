import type { Metadata } from "next";
import "./globals.css";
import { ClerkProvider } from "@clerk/nextjs";
import { ThemeProvider } from "@/components/providers/ThemeProvider";
import { ArtworkProtectionProvider } from "@/components/providers/ArtworkProtectionProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { GoogleAnalytics } from "@/components/analytics/GoogleAnalytics";
import { MicrosoftClarity } from "@/components/analytics/MicrosoftClarity";

// Font CSS variables (--font-bodoni, --font-manrope) are defined in globals.css
// using @font-face for self-hosting, avoiding Google Fonts network errors.

export const metadata: Metadata = {
  title: "ONWA - African Digital Museum",
  description: "Preserve, celebrate, and reimagine African culture through AI-assisted digital artwork. A luxury digital museum dedicated to African storytelling.",
  keywords: ["African art", "digital museum", "African culture", "AI art", "African heritage", "African spirituality"],
  authors: [{ name: "ONWA" }],
  creator: "ONWA",
  publisher: "ONWA",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  ),
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/icon.svg", type: "image/svg+xml" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
      { url: "/apple-touch-icon-precomposed.png", sizes: "180x180", type: "image/png" },
    ],
  },
  manifest: "/manifest.json",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "ONWA",
    title: "ONWA - African Digital Museum",
    description: "Preserve, celebrate, and reimagine African culture through AI-assisted digital artwork.",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "ONWA - African Digital Museum",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "ONWA - African Digital Museum",
    description: "Preserve, celebrate, and reimagine African culture through AI-assisted digital artwork.",
    images: ["/og-image.jpg"],
    creator: "@onwa",
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
    google: "your-google-verification-code",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider
      appearance={{
        elements: {
          form: {
            action: "flex flex-col gap-4",
          },
        },
      }}
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en" className="dark" suppressHydrationWarning>
          <head>
            {/* Preconnect to Google Fonts for faster loading */}
            <link rel="preconnect" href="https://fonts.googleapis.com" />
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
            {/* Load fonts via browser <link> to avoid server-side fetch failures */}
            <link
              href="https://fonts.googleapis.com/css2?family=Bodoni+Moda:wght@400;500;600;700&family=Manrope:wght@300;400;500;600;700&display=swap"
              rel="stylesheet"
            />
            <GoogleAnalytics />
            <MicrosoftClarity />
          </head>
          <body className="font-sans antialiased">
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <ArtworkProtectionProvider>
                <Header />
                <main className="min-h-screen">{children}</main>
                <Footer />
              </ArtworkProtectionProvider>
            </ThemeProvider>
          </body>
        </html>
    </ClerkProvider>
  );
}

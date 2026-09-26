import type { Metadata, Viewport } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AmbientPointer from "@/components/AmbientPointer";
import { getSiteUrl, SITE_DESCRIPTION, SITE_NAME } from "@/lib/site";
import "./globals.css";

const siteUrl = getSiteUrl();

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  applicationName: SITE_NAME,
  title: {
    default: "Marketa AI — Your AI marketing brain",
    template: "%s | Marketa AI",
  },
  description: SITE_DESCRIPTION,
  keywords: [
    "AI marketing assistant",
    "small business marketing",
    "social media captions",
    "WhatsApp marketing",
    "branded posters",
  ],
  creator: "Marketa AI",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title: "Marketa AI — Your AI marketing brain",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Marketa AI turns one promotion idea into a complete campaign.",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Marketa AI — Your AI marketing brain",
    description: SITE_DESCRIPTION,
    images: ["/opengraph-image"],
  },
  robots: {
    index: true,
    follow: true,
  },
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
};

export const viewport: Viewport = {
  colorScheme: "dark",
  themeColor: "#07080d",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body id="top">
        <ClerkProvider>
          <AmbientPointer />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

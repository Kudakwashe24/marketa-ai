import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import AmbientPointer from "@/components/AmbientPointer";
import "./globals.css";

export const metadata: Metadata = {
  title: "Marketa AI",
  description: "AI marketing assistant for businesses.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <AmbientPointer />
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}

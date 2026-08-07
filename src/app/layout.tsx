import type { Metadata } from "next";
import "./globals.css";
import SiteHeader from "@/components/SiteHeader";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vidalip — book models, photographers and creative talent",
    template: "%s | Vidalip",
  },
  description:
    "Browse verified creative talent, compare rates and availability, and get in touch directly.",
  openGraph: {
    siteName: "Vidalip",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <SiteHeader />
        <main>{children}</main>
        <footer className="mt-20 border-t border-ink-800 py-8 text-center text-sm text-ink-400">
          © {new Date().getFullYear()} Vidalip. All listings are reviewed before
          they go live.
        </footer>
      </body>
    </html>
  );
}

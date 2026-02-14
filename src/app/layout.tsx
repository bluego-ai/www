import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "bluego.ai — AI-Powered Sales & Marketing Team",
  description:
    "AI assistants that handle outreach, follow-ups, scheduling, and lead generation — so you can focus on closing deals and growing your business.",
  openGraph: {
    title: "bluego.ai — Every task. Every channel. Every time.",
    description:
      "AI-Powered Operations for Your Business. We deploy and manage intelligent AI assistants that handle sales, support, scheduling, and operations.",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "bluego.ai — AI-Powered Sales & Marketing Team",
      },
    ],
    siteName: "bluego.ai",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "bluego.ai — Every task. Every channel. Every time.",
    description:
      "AI-Powered Operations for Your Business.",
    images: ["/og-image.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <body className={`${inter.className} antialiased`}>{children}</body>
    </html>
  );
}

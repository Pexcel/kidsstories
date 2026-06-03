import Script from "next/script";
import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
 
  title: "KidsStories with Janet Bambi",

  description:
    "Bible stories, animations, memory verses, lessons and prayers for children.",

  openGraph: {
    title: "KidsStories with Janet Bambi",
    description:
      "Bible stories, animations, memory verses, lessons and prayers for children.",
    url: "https://kidsstories.com.ng",
    siteName: "KidsStories",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "KidsStories Bible Animations for Children",
      },
    ],
    locale: "en_US",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "KidsStories with Janet Bambi",
    description:
      "Bible stories, animations, memory verses, lessons and prayers for children.",
    images: ["/og-image.jpg"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
  <head>
    <Script
      async
      strategy="afterInteractive"
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4663946431005155"
      crossOrigin="anonymous"
    />
  </head>

  <body>
    {children}
  </body>
</html>
  );
}

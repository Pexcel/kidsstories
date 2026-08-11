import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Notification Admin | Animated Bible TV",
  robots: {
    index: false,
    follow: false,
    nocache: true,
    googleBot: {
      index: false,
      follow: false,
      noimageindex: true,
    },
  },
};

export default function NotifyLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
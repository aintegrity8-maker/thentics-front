import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thentics",
  description: "AI detection for academic integrity.",
  icons: {
    icon: "/thentics-logo.png",
    shortcut: "/thentics-logo.png",
    apple: "/thentics-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Thentics",
  description: "AI detection for academic integrity.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
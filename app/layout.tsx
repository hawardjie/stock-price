import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Stock Price Watch - Real-time Market Analytics",
  description: "Modern real-time stock price watch with advanced analytics, technical indicators, and customizable visualizations",
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

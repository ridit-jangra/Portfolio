import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter, Finger_Paint } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
});

const fingerPaint = Finger_Paint({
  variable: "--font-finger-paint",
  weight: "400",
});

export const metadata: Metadata = {
  title: "Ridit",
  description: "Portfolio",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${inter.variable} ${fingerPaint.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

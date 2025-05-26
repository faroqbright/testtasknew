import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "MERN Assessment",
  description: "Full-Stack MERN Developer Technical Assessment",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} text-black bg-gray-100`}>
        <main className="min-h-screen">
          {children}
        </main>
      </body>
    </html>
  );
}
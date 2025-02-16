import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Crossword Collab",
  description: "Collaborative Crossword Creation",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}

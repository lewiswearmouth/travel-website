import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Personal Travel Atlas",
  description: "An interactive travel map and country-first photo gallery.",
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

import type { Metadata } from "next";
import "./globals.css";
import { inter } from "./fonts";


export const metadata: Metadata = {
  title: "Ocelot Pride Calculator",
  description: "Ocelot Pride Calculator",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

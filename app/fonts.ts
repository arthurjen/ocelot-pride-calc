import localFont from "next/font/local";
import { Inter } from "next/font/google";

export const beleren = localFont({
  src: "/Beleren2016-Bold.woff",
});

export const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});
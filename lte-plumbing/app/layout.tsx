import type { Metadata } from "next";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const archivo = Archivo({
  subsets: ["latin"],
  variable: "--font-archivo",
  weight: ["600", "700", "800", "900"],
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  weight: ["300", "400", "500", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "L.T.E. Plumbing Services Ltd | Plumbing & Heating",
  description:
    "L.T.E. Plumbing Services Ltd — 24-hour emergency plumbing, heating, bathroom renovation and hot tub servicing. 5.0 stars on Google.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${archivo.variable} ${inter.variable}`}>
      <body className="grain bg-ink text-paper antialiased">{children}</body>
    </html>
  );
}

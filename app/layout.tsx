import type { Metadata } from "next";
import { M_PLUS_Rounded_1c, Shippori_Mincho } from "next/font/google";
import "./globals.css";

const mplus = M_PLUS_Rounded_1c({
  variable: "--font-mplus",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

const shippori = Shippori_Mincho({
  variable: "--font-shippori",
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Browser RPG",
  description: "링크 하나로 접근 가능한 브라우저 3D RPG",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={`${mplus.variable} ${shippori.variable}`}>
      <body>{children}</body>
    </html>
  );
}

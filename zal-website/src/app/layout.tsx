import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "زال — مدل‌های زبانی و دیتاست‌های فارسی",
  description:
    "زال — کامیونیتی مدل‌ها و دیتاست‌های باز برای زبان فارسی. همان‌گونه که نگارگران ایرانی قرن‌ها دانش را بر کاغذ نگاه داشتند، ما زبان فارسی را به دنیای هوش مصنوعی می‌آوریم.",
  keywords: [
    "زال",
    "Zal",
    "Persian AI",
    "هوش مصنوعی فارسی",
    "مدل زبانی فارسی",
    "دیتاست فارسی",
    "NLP",
    "HuggingFace",
  ],
  authors: [{ name: "تیم زال" }],
  icons: {
    icon:
      "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect x='30' y='30' width='40' height='40' rx='5' transform='rotate(45 50 50)' fill='%23a8811f'/%3E%3C/svg%3E",
  },
  openGraph: {
    title: "زال — مدل‌های زبانی فارسی",
    description:
      "کامیونیتی مدل‌ها و دیتاست‌های باز برای زبان فارسی",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fa" dir="rtl" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,500;0,600;1,500&family=Noto+Nastaliq+Urdu:wght@400;700&display=swap"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/rastikerdar/vazirmatn@v33.003/Vazirmatn-font-face.css"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}

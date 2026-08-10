import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "منصة مستر احمد الغندور | فيزياء للثانوية العامة",
    template: "%s | منصة مستر احمد الغندور",
  },
  description:
    "منصة تعليمية متخصصة في مادة الفيزياء للثانوية العامة مع أ. احمد الغندور — خبرة تتجاوز 5 سنوات، دروس فيديو، امتحانات إلكترونية، ومتابعة أكاديمية متكاملة.",
  keywords: ["فيزياء", "ثانوية عامة", "تعليم", "مصر", "دروس أونلاين", "احمد الغندور"],
  authors: [{ name: "أ. احمد الغندور" }],
  openGraph: {
    type: "website",
    locale: "ar_EG",
    siteName: "منصة مستر احمد الغندور",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#6366f1",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ar" dir="rtl">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  );
}

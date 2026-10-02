import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import AnnouncementBar from "@/components/AnnouncementBar";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import IntroScreen from "@/components/IntroScreen";
import { SITE_URL } from "@/lib/site";

// Self-hosted (src/assets/fonts) so builds never depend on reaching Google Fonts.
// Variable fonts: one file covers every weight used on the site.
const inter = localFont({
  src: "../assets/fonts/inter-latin-variable.woff2",
  weight: "100 900",
  style: "normal",
  variable: "--font-inter",
  display: "swap",
});

const plusJakarta = localFont({
  src: "../assets/fonts/plus-jakarta-sans-latin-variable.woff2",
  weight: "200 800",
  style: "normal",
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Medivo — Because Every Dose Matters",
    template: "%s | Medivo",
  },
  description:
    "Medivo is a smart medication management solution designed to help users organise their medications, receive timely reminders, confirm doses and stay connected with caregivers.",
  keywords: [
    "Medivo",
    "smart medication box",
    "medication management",
    "medication reminder",
    "pill organiser",
    "caregiver monitoring",
  ],
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Medivo",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${plusJakarta.variable}`}
    >
      <body style={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        {/* Full-screen intro animation — plays once per session */}
        <IntroScreen />
        <AnnouncementBar />
        <Header />
        <main style={{ flex: 1 }}>{children}</main>
        <Footer />
      </body>
    </html>
  );
}

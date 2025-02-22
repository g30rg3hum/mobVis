import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

import { config } from "@fortawesome/fontawesome-svg-core";
import "@fortawesome/fontawesome-svg-core/styles.css";

import { getServerSession } from "next-auth";
import SessionProvider from "@/components/custom/session-provider";
import Header from "@/components/layout/header";
import { ReactNode } from "react";

config.autoAddCss = false;

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "mobVis",
  description:
    "Visualisation tool for gait analysis of patients with multiple sclerosis.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  const session = await getServerSession();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-[#F3F3F3]`}
      >
        <Header />
        {/* This is for getting the session in a client component */}
        <SessionProvider session={session}>{children}</SessionProvider>
      </body>
    </html>
  );
}

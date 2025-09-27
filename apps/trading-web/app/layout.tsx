"use client"

import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import "./globals.css";
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../theme'
import Navigation from '../components/Navigation'

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
  display: "swap",
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <title>Trading Platform - Professional Market Analysis</title>
        <meta name="description" content="Advanced trading platform with real-time market data, technical analysis, and portfolio management" />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <AuthProvider>
            <Navigation />
            {children}
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

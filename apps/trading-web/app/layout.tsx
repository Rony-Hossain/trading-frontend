"use client"

import { useEffect, useMemo, useState } from 'react'
import { Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "../contexts/AuthContext";
import { FeatureFlagProvider } from '../contexts/FeatureFlagContext'
import "./globals.css";
import { ThemeProvider, CssBaseline } from '@mui/material'
import theme from '../theme'
import Navigation from '../components/Navigation'
import GlobalStatusBanners from '../components/system/GlobalStatusBanners'
import LaunchKpiMonitor from '../components/analytics/LaunchKpiMonitor'
import WhatsNewModal from '../components/whats-new/WhatsNewModal'
import { LATEST_WHATS_NEW } from '../lib/content/whats-new'
import sriManifest from '../config/sri-manifest.json'
import { useDeviceSyncAudit } from '../hooks/useDeviceSyncAudit'

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
  const whatsNewEntry = useMemo(() => LATEST_WHATS_NEW, [])
  const [showWhatsNew, setShowWhatsNew] = useState(false)
  const [hasUnseen, setHasUnseen] = useState(false)
  useDeviceSyncAudit()

  useEffect(() => {
    if (!whatsNewEntry) return
    const storageKey = 'whats-new:last-seen-version'
    const seenVersion = typeof window !== 'undefined' ? window.localStorage.getItem(storageKey) : null
    const latestVersion = whatsNewEntry.version
    const shouldShow = seenVersion !== latestVersion
    setShowWhatsNew(shouldShow)
    setHasUnseen(shouldShow)
  }, [whatsNewEntry])

  const handleCloseWhatsNew = () => {
    if (typeof window !== 'undefined') {
      window.localStorage.setItem('whats-new:last-seen-version', whatsNewEntry.version)
    }
    setShowWhatsNew(false)
    setHasUnseen(false)
  }

  const handleOpenWhatsNew = () => {
    setShowWhatsNew(true)
    setHasUnseen(false)
  }

  return (
    <html lang="en">
      <head>
        <title>Trading Platform - Professional Market Analysis</title>
        <meta name="description" content="Advanced trading platform with real-time market data, technical analysis, and portfolio management" />
        <link
          rel="icon"
          href="/favicon.ico"
          integrity={(sriManifest as Record<string, string>)['/favicon.ico']}
          crossOrigin="anonymous"
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning={true}
      >
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <FeatureFlagProvider>
            <AuthProvider>
              <Navigation onOpenWhatsNew={handleOpenWhatsNew} hasWhatsNew={hasUnseen} />
              <GlobalStatusBanners />
              <LaunchKpiMonitor />
              {children}
              {whatsNewEntry && (
                <WhatsNewModal open={showWhatsNew} entry={whatsNewEntry} onClose={handleCloseWhatsNew} />
              )}
            </AuthProvider>
          </FeatureFlagProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}

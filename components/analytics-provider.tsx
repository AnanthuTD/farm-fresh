"use client"

import type React from "react"

import { useEffect } from "react"
import { usePathname } from "next/navigation"
import { trackPageView } from "@/lib/analytics"

export default function AnalyticsProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()

  useEffect(() => {
    // Track page view on route change
    const page = pathname === "/" ? "home" : pathname.slice(1).split("/")[0]
    trackPageView(page)
  }, [pathname])

  return <>{children}</>
}

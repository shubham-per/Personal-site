"use client"

import { useEffect } from "react"

interface AnalyticsTrackerProps {
  page: string
  action?: string
}

export default function AnalyticsTracker({ page, action = "page_view" }: AnalyticsTrackerProps) {
  useEffect(() => {
    const trackVisit = async () => {
      try {
        const visitorId = localStorage.getItem("visitor_id") || 
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        
        const sessionId = sessionStorage.getItem("session_id") || 
          Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
        
        // Store IDs for future use
        localStorage.setItem("visitor_id", visitorId)
        sessionStorage.setItem("session_id", sessionId)
        
        await fetch("/api/analytics", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            visitor_id: visitorId,
            page,
            action,
            user_agent: navigator.userAgent,
            referrer: document.referrer || null,
            session_id: sessionId,
          }),
        })
      } catch (error) {
        console.error("Failed to track analytics:", error)
      }
    }

    trackVisit()
  }, [page, action])

  return null
} 
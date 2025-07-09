"use client"

import { v4 as uuidv4 } from "uuid"

class AnalyticsTracker {
  private visitorId: string
  private sessionId: string

  constructor() {
    this.visitorId = this.getOrCreateVisitorId()
    this.sessionId = this.getOrCreateSessionId()
  }

  private getOrCreateVisitorId(): string {
    let visitorId = localStorage.getItem("visitor_id")
    if (!visitorId) {
      visitorId = uuidv4()
      localStorage.setItem("visitor_id", visitorId)
    }
    return visitorId
  }

  private getOrCreateSessionId(): string {
    let sessionId = sessionStorage.getItem("session_id")
    if (!sessionId) {
      sessionId = uuidv4()
      sessionStorage.setItem("session_id", sessionId)
    }
    return sessionId
  }

  async track(page: string, action = "view") {
    try {
      await fetch("/api/analytics", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          visitor_id: this.visitorId,
          page,
          action,
          user_agent: navigator.userAgent,
          referrer: document.referrer || null,
          session_id: this.sessionId,
        }),
      })
    } catch (error) {
      console.error("Analytics tracking failed:", error)
    }
  }

  trackPageView(page: string) {
    this.track(page, "view")
  }

  trackClick(element: string, page: string) {
    this.track(page, `click_${element}`)
  }

  trackWindowOpen(windowId: string) {
    this.track(windowId, "window_open")
  }
}

export const analytics = new AnalyticsTracker()

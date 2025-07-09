import type React from "react"
interface DesktopProps {
  children: React.ReactNode
}

export default function Desktop({ children }: DesktopProps) {
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Windows 7 style background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>
      {children}
    </div>
  )
}

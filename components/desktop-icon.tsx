"use client"

import type React from "react"

import { useState } from "react"

interface DesktopIconProps {
  icon: React.ReactNode | string
  label: string
  onDoubleClick: () => void
  size?: "small" | "large"
  textColor?: "white" | "dark"
}

export default function DesktopIcon({
  icon,
  label,
  onDoubleClick,
  size = "small",
  textColor = "white",
}: DesktopIconProps) {
  const [isSelected, setIsSelected] = useState(false)

  const handleClick = () => {
    setIsSelected(true)
    setTimeout(() => setIsSelected(false), 200)
  }

  const iconSize = size === "large" ? "w-16 h-16" : "w-12 h-12"
  const textSize = size === "large" ? "text-sm" : "text-xs"
  const textColorClass = textColor === "dark" ? "text-gray-800" : "text-white"

  return (
    <div
      className={`flex flex-col items-center cursor-pointer select-none ${
        size === "large" ? "p-3" : "p-2"
      } rounded-lg ${isSelected ? "bg-white/20 backdrop-blur-sm" : ""} hover:bg-white/10 transition-all duration-200`}
      onClick={handleClick}
      onDoubleClick={onDoubleClick}
    >
      <div
        className={`${iconSize} bg-white/10 backdrop-blur-sm rounded-lg border border-white/20 flex items-center justify-center mb-2 shadow-lg hover:bg-white/20 transition-all duration-200`}
      >
        {typeof icon === "string" ? (
          <span className="text-2xl">{icon}</span>
        ) : (
          <div className="text-gray-700">{icon}</div>
        )}
      </div>
      <span className={`${textSize} text-center ${textColorClass} font-medium max-w-16 leading-tight drop-shadow-sm`}>
        {label}
      </span>
    </div>
  )
}

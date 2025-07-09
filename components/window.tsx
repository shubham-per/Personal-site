"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Minus, Square } from "lucide-react"

interface WindowProps {
  title: string
  children: React.ReactNode
  isActive: boolean
  onClose: () => void
  onFocus: () => void
  initialPosition: { x: number; y: number }
  width?: number
  height?: number
  zIndex?: number
}

export default function Window({
  title,
  children,
  isActive,
  onClose,
  onFocus,
  initialPosition,
  width = 400,
  height = 300,
  zIndex = 10,
}: WindowProps) {
  const [position, setPosition] = useState(initialPosition)
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const windowRef = useRef<HTMLDivElement>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("window-title")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      })
      onFocus()
    }
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging) {
        setPosition({
          x: Math.max(0, Math.min(window.innerWidth - width, e.clientX - dragOffset.x)),
          y: Math.max(0, Math.min(window.innerHeight - height - 40, e.clientY - dragOffset.y)),
        })
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, width, height])

  return (
    <div
      ref={windowRef}
      className={`absolute bg-black/20 backdrop-blur-md border border-white/30 shadow-2xl rounded-t-lg overflow-hidden`}
      style={{
        left: position.x,
        top: position.y,
        width,
        height,
        cursor: isDragging ? "grabbing" : "default",
        boxShadow: isActive ? "0 0 30px rgba(0,0,0,0.3)" : "0 0 15px rgba(0,0,0,0.2)",
        zIndex: zIndex,
      }}
      onClick={onFocus}
    >
      {/* Title Bar */}
      <div
        className={`window-title h-8 px-3 flex items-center justify-between cursor-grab active:cursor-grabbing ${
          isActive
            ? "bg-gradient-to-r from-blue-600/80 to-blue-500/80 text-white backdrop-blur-sm"
            : "bg-gradient-to-r from-gray-600/60 to-gray-500/60 text-gray-200 backdrop-blur-sm"
        }`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm font-bold truncate">{title}</span>
        <div className="flex space-x-1">
          <button className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400">
            <Minus className="w-2 h-2" />
          </button>
          <button className="w-4 h-4 bg-gray-300 border border-gray-400 flex items-center justify-center hover:bg-gray-400">
            <Square className="w-2 h-2" />
          </button>
          <button
            onClick={onClose}
            className="w-4 h-4 bg-red-500 border border-red-600 flex items-center justify-center hover:bg-red-600 text-white"
          >
            <X className="w-2 h-2" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="h-full pb-8 overflow-hidden bg-gray-50 backdrop-blur-sm">{children}</div>
    </div>
  )
}

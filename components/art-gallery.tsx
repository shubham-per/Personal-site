"use client"
import { createPortal } from "react-dom"

import { useState, useEffect } from "react"
import type { Project } from "@/lib/types"
import { X, ChevronLeft, ChevronRight, Play, Download } from "lucide-react"

interface ArtGalleryProps {
    projects: Project[]
}

export function ArtGallery({ projects }: ArtGalleryProps) {
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    // Filter out projects with no media
    const validProjects = projects.filter((p) => p.imageUrl || (p.photos && p.photos.length > 0))

    const isVideo = (url: string) => {
        return url.match(/\.(mp4|webm|ogg|mov)$/i)
    }

    // Check if URL is a YouTube link
    const isYouTube = (url: string) => {
        return url.match(/(?:youtube\.com\/(?:watch\?v=|embed\/)|youtu\.be\/)/)
    }

    // Extract YouTube video ID from various URL formats
    const getYouTubeId = (url: string): string | null => {
        const patterns = [
            /(?:youtube\.com\/watch\?v=)([a-zA-Z0-9_-]{11})/,
            /(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/,
            /(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/
        ]
        for (const pattern of patterns) {
            const match = url.match(pattern)
            if (match) return match[1]
        }
        return null
    }

    // Get YouTube thumbnail for preview
    const getYouTubeThumbnail = (videoId: string) => {
        return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
    }

    // Check if URL is a Google Drive link
    const isGoogleDrive = (url: string) => {
        return url.match(/drive\.google\.com\/file\/d\//)
    }

    // Extract Google Drive file ID
    const getGoogleDriveId = (url: string): string | null => {
        const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)\//)
        return match ? match[1] : null
    }

    const getMediaUrl = (project: Project) => {
        return project.imageUrl || (project.photos && project.photos.length > 0 ? project.photos[0] : "")
    }

    const handleNext = () => {
        if (selectedIndex === null) return
        setSelectedIndex((prev) => (prev! + 1) % validProjects.length)
    }

    const handlePrev = () => {
        if (selectedIndex === null) return
        setSelectedIndex((prev) => (prev! - 1 + validProjects.length) % validProjects.length)
    }

    const handleKeyDown = (e: KeyboardEvent) => {
        if (selectedIndex === null) return
        if (e.key === "ArrowRight") handleNext()
        if (e.key === "ArrowLeft") handlePrev()
        if (e.key === "Escape") setSelectedIndex(null)
    }

    useEffect(() => {
        if (selectedIndex !== null) {
            document.addEventListener("keydown", handleKeyDown)
            return () => document.removeEventListener("keydown", handleKeyDown)
        }
    }, [selectedIndex])

    return (
        <>
            {/* Gallery Grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 pb-20">
                {validProjects.map((project, index) => {
                    const url = getMediaUrl(project)
                    const isVid = isVideo(url)
                    const isYT = isYouTube(url)
                    const ytId = isYT ? getYouTubeId(url) : null

                    return (
                        <div
                            key={project.id}
                            className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-gray-100 dark:bg-gray-800 shadow-sm transition-all hover:shadow-md"
                            onClick={() => setSelectedIndex(index)}
                        >
                            {isYT && ytId ? (
                                // YouTube thumbnail with play button
                                <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                    <img
                                        src={getYouTubeThumbnail(ytId)}
                                        alt={project.title}
                                        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <div className="bg-red-600 rounded-full p-3">
                                            <Play className="h-8 w-8 fill-white text-white" />
                                        </div>
                                    </div>
                                </div>
                            ) : isGoogleDrive(url) ? (
                                <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                    <div className="flex flex-col items-center gap-2 opacity-80">
                                        <svg viewBox="0 0 87.3 78" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
                                            <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8h-27.5c0 1.55.4 3.1 1.2 4.5z" fill="#0066da"/>
                                            <path d="m43.65 25-13.75-23.8c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44a7.2 7.2 0 0 0 -1.2 4.5h27.5z" fill="#00ac47"/>
                                            <path d="m73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5l-13.75.1-20.5 20.5z" fill="#ea4335"/>
                                            <path d="m43.65 25 13.75-23.8c-1.35-.8-2.9-1.2-4.5-1.2h-18.5c-1.6 0-3.15.45-4.5 1.2z" fill="#4285f4"/>
                                            <path d="m59.8 44.5-16.15-16.15-20.5 20.45h36.65z" fill="#ffba00"/>
                                            <path d="m73.4 44.5-13.6-23.7-16.15 16.15z" fill="#ffba00"/>
                                        </svg>
                                        <span className="text-white/70 text-xs font-medium">Google Drive</span>
                                    </div>
                                </div>
                            ) : isVid ? (
                                <div className="flex h-full w-full items-center justify-center bg-gray-900">
                                    <video
                                        src={url}
                                        muted
                                        playsInline
                                        preload="metadata"
                                        className="h-full w-full object-cover opacity-80 transition-opacity group-hover:opacity-60"
                                    />
                                    <div className="absolute inset-0 flex items-center justify-center">
                                        <Play className="h-10 w-10 fill-white text-white opacity-90 shadow-sm" />
                                    </div>
                                </div>
                            ) : (
                                <img
                                    src={url || "/placeholder.svg"}
                                    alt={project.title}
                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-110"
                                />
                            )}

                            {/* Overlay with Title */}
                            <div className="absolute inset-0 flex items-end bg-gradient-to-t from-black/60 to-transparent p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                                <span className="text-sm font-medium text-white truncate w-full">{project.title}</span>
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Lightbox Modal */}
            {mounted && selectedIndex !== null && createPortal(
                <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/95 backdrop-blur-md">
                    {/* Close Button */}
                    <button
                        className="absolute right-4 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                        onClick={() => setSelectedIndex(null)}
                    >
                        <X className="h-6 w-6" />
                    </button>

                    {/* Navigation */}
                    <button
                        className="absolute left-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors hidden sm:block"
                        onClick={(e) => {
                            e.stopPropagation()
                            handlePrev()
                        }}
                    >
                        <ChevronLeft className="h-8 w-8" />
                    </button>

                    <button
                        className="absolute right-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors hidden sm:block"
                        onClick={(e) => {
                            e.stopPropagation()
                            handleNext()
                        }}
                    >
                        <ChevronRight className="h-8 w-8" />
                    </button>

                    {/* Download Button */}
                    <button
                        className="absolute right-16 top-4 z-50 rounded-full bg-white/10 p-2 text-white hover:bg-white/20 transition-colors"
                        onClick={(e) => {
                            e.stopPropagation()
                            /* Download logic helper */
                            const project = validProjects[selectedIndex]
                            const url = project.imageUrl || (project.photos && project.photos.length > 0 ? project.photos[0] : "")
                            if (url) {
                                const link = document.createElement('a')
                                link.href = url
                                link.download = project.title || 'download'
                                document.body.appendChild(link)
                                link.click()
                                document.body.removeChild(link)
                            }
                        }}
                        title="Download"
                    >
                        <Download className="h-6 w-6" />
                    </button>


                    {/* Main Media */}
                    <div className="relative h-full w-full p-4 md:p-10 flex items-center justify-center">
                        {(() => {
                            const project = validProjects[selectedIndex]
                            const url = project.imageUrl || (project.photos && project.photos.length > 0 ? project.photos[0] : "")
                            const isVid = url.match(/\.(mp4|webm|ogg|mov)$/i)
                            const isYT = isYouTube(url)
                            const ytId = isYT ? getYouTubeId(url) : null

                            return (
                                <div className="relative max-h-full max-w-full flex flex-col items-center justify-center" onClick={(e) => e.stopPropagation()}>
                                    {isYT && ytId ? (
                                        // YouTube embed - larger player
                                        <div className="w-[90vw] max-w-6xl aspect-video">
                                            <iframe
                                                src={`https://www.youtube.com/embed/${ytId}?autoplay=1&rel=0`}
                                                title={project.title}
                                                className="w-full h-full rounded shadow-lg"
                                                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                                allowFullScreen
                                            />
                                        </div>
                                    ) : isGoogleDrive(url) && getGoogleDriveId(url) ? (
                                        <div className="w-[90vw] max-w-6xl aspect-video">
                                            <video
                                                controls
                                                autoPlay
                                                playsInline
                                                className="w-full h-full rounded shadow-lg"
                                            >
                                                <source src={`https://drive.usercontent.google.com/download?id=${getGoogleDriveId(url)}`} />
                                            </video>
                                        </div>
                                    ) : isVid ? (
                                        <video
                                            src={url}
                                            controls
                                            autoPlay
                                            playsInline
                                            className="max-h-[85vh] max-w-full rounded shadow-lg"
                                        />
                                    ) : (
                                        <img
                                            src={url || "/placeholder.svg"}
                                            alt={project.title}
                                            className="max-h-[85vh] max-w-full rounded shadow-lg object-contain"
                                        />
                                    )}
                                    <div className="mt-4 text-center bg-black/50 p-4 rounded-xl backdrop-blur-md">
                                        <h2 className="text-xl font-bold text-white mb-2">{project.title}</h2>
                                        <p className="text-gray-300 text-sm max-w-2xl mx-auto">{project.description}</p>
                                    </div>
                                </div>
                            )
                        })()}
                    </div>
                </div>,
                document.body
            )}
        </>
    )
}

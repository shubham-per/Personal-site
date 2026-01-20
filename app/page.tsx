"use client"

import { useState, useEffect } from "react"
import Window from "@/components/window"
import DesktopIcon from "@/components/desktop-icon"
import MobileLayout from "@/components/mobile-layout"
import AnalyticsTracker from "@/components/analytics-tracker"
import { Rocket, Gamepad2, Palette, User, Mail, Youtube, MessageCircle, HelpCircle, FolderOpen } from "lucide-react"

interface Content {
  id: number
  section: string
  title: string
  content: string
}

interface Project {
  id: number
  title: string
  description: string
  category: "engineering" | "games" | "art"
  imageUrl?: string
  photos: string[]
  keywords: string[]
  projectLink?: string
  tags: string[]
  orderIndex: number
  isActive: boolean
  cardStyle?: string
  customTabKey?: string
}

interface WindowConfig {
  id: number
  key: string
  label: string
  type: "builtIn" | "custom"
  showOnDesktop: boolean
  showInHome: boolean
  orderDesktop: number
  orderHome: number
  isHidden: boolean
  content?: string
  icon?: string
  customIconUrl?: string
  layout?: "content" | "projects" | "faq"
}

type BackgroundConfig =
  | {
      type: "solid"
      color: string
    }
  | {
      type: "gradient"
      from: string
      via?: string
      to: string
    }
  | {
      type: "image"
      imageUrl: string
      overlay?: boolean
    }

export default function Page() {
  const [openWindows, setOpenWindows] = useState<string[]>(["home"])
  const [activeWindow, setActiveWindow] = useState("home")
  const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 })
  const [windowZIndex, setWindowZIndex] = useState<Record<string, number>>({})
  const [nextZIndex, setNextZIndex] = useState(100)
  const [isMobile, setIsMobile] = useState(false)
  
  const [content, setContent] = useState<Record<string, Content>>({})
  const [projects, setProjects] = useState<Project[]>([])
  const [faqItems, setFaqItems] = useState<Array<{ id: number; question: string; answer: string; order: number; isActive: boolean }>>([])
  const [loading, setLoading] = useState(true)
  const [background, setBackground] = useState<BackgroundConfig | null>(null)
  const [windows, setWindows] = useState<WindowConfig[]>([])

  useEffect(() => {
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsMobile(window.innerWidth < 768)
    }

    updateDimensions()
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  useEffect(() => {
    const loadContent = async () => {
      try {
        const sections = ["about", "contact", "faq"]
        const contentData: Record<string, Content> = {}

        for (const section of sections) {
          const res = await fetch(`/api/content?section=${section}`)
          const data = await res.json()
          if (data) contentData[section] = data
        }
        setContent(contentData)

        const projectsRes = await fetch("/api/projects")
        const rawProjects = await projectsRes.json()
        const projectsData: Project[] = rawProjects.map((p: any) => ({
          ...p,
          photos: Array.isArray(p.photos) ? p.photos : [],
          keywords: Array.isArray(p.keywords) ? p.keywords : [],
          tags: Array.isArray(p.tags) ? p.tags : [],
        }))
        setProjects(projectsData)

        const faqRes = await fetch("/api/faq")
        const faqData = await faqRes.json()
        setFaqItems(faqData)

        const bgRes = await fetch("/api/background")
        if (bgRes.ok) {
          const bgData = await bgRes.json()
          setBackground(bgData)
        }

        const winRes = await fetch("/api/windows")
        if (winRes.ok) {
          const winData = await winRes.json()
          setWindows(winData)
        }

        setLoading(false)
      } catch (error) {
        console.error("Failed to load content:", error)
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId])
    }
    setWindowZIndex((prev) => ({ ...prev, [windowId]: nextZIndex }))
    setNextZIndex((prev) => prev + 1)
    setActiveWindow(windowId)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId))
    setWindowZIndex((prev) => {
      const newZIndex = { ...prev }
      delete newZIndex[windowId]
      return newZIndex
    })
    if (activeWindow === windowId) {
      setActiveWindow(openWindows.filter((id) => id !== windowId)[0] || "")
    }
  }

  const focusWindow = (windowId: string) => {
    setWindowZIndex((prev) => ({ ...prev, [windowId]: nextZIndex }))
    setNextZIndex((prev) => prev + 1)
    setActiveWindow(windowId)
  }

  const getResponsivePosition = (baseX: number, baseY: number) => ({
    x: Math.min(baseX, windowDimensions.width * 0.1),
    y: Math.min(baseY, windowDimensions.height * 0.1),
  })

  const getCenteredPosition = (width: number, height: number) => ({
    x: Math.max(0, (windowDimensions.width - width) / 2),
    y: Math.max(0, (windowDimensions.height - height) / 2),
  })

  const getResponsiveSize = (baseWidth: number, baseHeight: number) => ({
    width: Math.min(baseWidth, windowDimensions.width * 0.9),
    height: Math.min(baseHeight, windowDimensions.height * 0.8),
  })

  const getWindowZIndex = (windowId: string) => {
    return windowZIndex[windowId] || 10
  }

  const openExternalLink = (url: string) => {
    window.open(url, "_blank", "noopener,noreferrer")
  }

  const getProjectsByCategory = (category: "engineering" | "games" | "art") => {
    return projects.filter(project => project.category === category)
  }

  const getBackgroundClass = () => {
    if (!background) {
      return { style: {} as React.CSSProperties, className: "" }
    }
    if (background.type === "solid") {
      return { style: { backgroundColor: background.color } as React.CSSProperties, className: "" }
    }
    if (background.type === "gradient") {
      const from = background.from || "#60a5fa"
      const via = background.via || "#3b82f6"
      const to = background.to || "#2563eb"
      return {
        style: {
          backgroundImage: `linear-gradient(to bottom, ${from}, ${via}, ${to})`,
        } as React.CSSProperties,
        className: "",
      }
    }
    return {
      style: {
        backgroundImage: `url(${background.imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      } as React.CSSProperties,
      className: "",
    }
  }

  const renderIcon = (w: WindowConfig, large = false) => {
    const size = large ? "w-8 h-8" : "w-6 h-6"
    
    if (w.customIconUrl) {
      return <img src={w.customIconUrl} alt={w.label} className={`${size} object-contain`} />
    }
    
    const icon = (w.icon || "").toLowerCase()
    if (icon === "user" || w.key === "about") return <User className={`${size} ${large ? "text-blue-600" : ""}`} />
    if (icon === "rocket" || w.key === "engineering") return <Rocket className={`${size} ${large ? "text-orange-600" : ""}`} />
    if (icon === "gamepad" || icon === "gamepad2" || w.key === "games") return <Gamepad2 className={`${size} ${large ? "text-green-600" : ""}`} />
    if (icon === "palette" || w.key === "art") return <Palette className={`${size} ${large ? "text-purple-600" : ""}`} />
    if (icon === "mail" || w.key === "contact") return <Mail className={`${size} ${large ? "text-cyan-600" : ""}`} />
    if (icon === "help" || icon === "help-circle" || w.key === "faq") return <HelpCircle className={`${size} ${large ? "text-yellow-600" : ""}`} />
    return <FolderOpen className={`${size} ${large ? "text-gray-700" : ""}`} />
  }

  if (isMobile) {
    return <MobileLayout />
  }

  if (loading || !background || windows.length === 0) {
    return (
      <div className="h-screen w-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  const bgProps = getBackgroundClass()

  return (
    <div>
      <AnalyticsTracker page="home" />
      <div className={`h-screen w-screen relative overflow-hidden ${bgProps.className || ""}`} style={bgProps.style}>
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>
        
        <div className="absolute top-4 sm:top-6 left-4 sm:left-6 space-y-2 sm:space-y-4">
          {windows
            .filter((w) => !w.isHidden && w.showOnDesktop)
            .sort((a, b) => a.orderDesktop - b.orderDesktop)
            .map((w) => (
              <DesktopIcon
                key={w.id}
                icon={renderIcon(w, false)}
                label={w.label}
                onDoubleClick={() => openWindow(w.key)}
                textColor="white"
              />
            ))}
        </div>

        <div className="absolute bottom-16 sm:bottom-20 right-4 sm:right-6 flex flex-col space-y-2 sm:space-y-4">
          <DesktopIcon
            icon={<Youtube className="w-6 h-6 text-red-500" />}
            label="YouTube"
            onDoubleClick={() => openExternalLink("https://youtube.com")}
            textColor="white"
          />
          <DesktopIcon
            icon={<MessageCircle className="w-6 h-6 text-indigo-500" />}
            label="Discord"
            onDoubleClick={() => openExternalLink("https://discord.com")}
            textColor="white"
          />
          <DesktopIcon
            icon={<User className="w-6 h-6 text-blue-600" />}
            label="LinkedIn"
            onDoubleClick={() => openExternalLink("https://linkedin.com")}
            textColor="white"
          />
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-10 sm:h-12 bg-black/30 backdrop-blur-md border-t border-white/20 flex items-center px-2 sm:px-4 space-x-1 sm:space-x-2">
          <button
            onClick={() => openWindow("home")}
            className="bg-white/20 backdrop-blur-sm px-4 py-2 text-sm font-medium border border-white/30 rounded hover:bg-white/30 text-white transition-all duration-200 flex items-center space-x-2"
          >
            <div className="w-4 h-4 bg-gradient-to-br from-green-400 to-blue-500 rounded-sm"></div>
            <span>Start</span>
          </button>
          {openWindows.map((windowId) => (
            <button
              key={windowId}
              onClick={() => focusWindow(windowId)}
              className={`px-4 py-2 text-sm border rounded transition-all duration-200 ${
                activeWindow === windowId
                  ? "bg-white/30 backdrop-blur-sm border-white/40 text-white"
                  : "bg-white/10 backdrop-blur-sm border-white/20 text-white/80 hover:bg-white/20"
              }`}
            >
              {windowId}
            </button>
          ))}
        </div>

        {openWindows.includes("home") && (
          <Window
            title="home"
            isActive={activeWindow === "home"}
            onClose={() => closeWindow("home")}
            onFocus={() => focusWindow("home")}
            initialPosition={getCenteredPosition(getResponsiveSize(600, 500).width, getResponsiveSize(600, 500).height)}
            width={getResponsiveSize(600, 500).width}
            height={getResponsiveSize(600, 500).height}
            zIndex={getWindowZIndex("home")}
          >
            <div className="flex flex-col items-center justify-center h-full p-8">
              <div className="text-center mb-8">
                <h1 className="text-4xl font-bold text-gray-800 mb-2">
                  hi! i'm <span className="text-blue-600">shubham</span>
                </h1>
                <p className="text-gray-600 text-lg">aerospace engineer, game developer, and digital artist</p>
              </div>
              <div className="grid grid-cols-3 gap-4 sm:gap-6">
                {windows
                  .filter((w) => !w.isHidden && w.showInHome)
                  .sort((a, b) => a.orderHome - b.orderHome)
                  .map((w) => (
                    <DesktopIcon
                      key={w.id}
                      icon={renderIcon(w, true)}
                      label={w.label}
                      onDoubleClick={() => openWindow(w.key)}
                      size="large"
                      textColor="dark"
                    />
                  ))}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("about") && (
          <Window
            title="about - Shubham Ranabhat"
            isActive={activeWindow === "about"}
            onClose={() => closeWindow("about")}
            onFocus={() => focusWindow("about")}
            initialPosition={getResponsivePosition(350, 150)}
            width={getResponsiveSize(500, 400).width}
            height={getResponsiveSize(500, 400).height}
            zIndex={getWindowZIndex("about")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gray-300 rounded mr-4 flex items-center justify-center">
                  <User className="w-8 h-8 text-gray-600" />
                </div>
                <div>
                  <h2 className="text-xl font-bold">{content.about?.title || "About Me"}</h2>
                  <p className="text-gray-600">Final Year Aerospace Engineering Student</p>
                </div>
              </div>
              <div className="space-y-4 text-sm">
                {content.about ? (
                  <div dangerouslySetInnerHTML={{ __html: content.about.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <div className="text-gray-500 italic">Loading content...</div>
                )}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("faq") && (
          <Window
            title="faq - Frequently Asked Questions"
            isActive={activeWindow === "faq"}
            onClose={() => closeWindow("faq")}
            onFocus={() => focusWindow("faq")}
            initialPosition={getResponsivePosition(600, 400)}
            width={getResponsiveSize(500, 400).width}
            height={getResponsiveSize(500, 400).height}
            zIndex={getWindowZIndex("faq")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-6">
                <HelpCircle className="w-8 h-8 text-yellow-600 mr-3" />
                <h2 className="text-2xl font-bold">{content.faq?.title || "FAQ"}</h2>
              </div>
              <div className="space-y-6">
                {faqItems.filter((item) => !item.customTabKey).length > 0 ? (
                  faqItems.filter((item) => !item.customTabKey).map((item) => (
                    <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                      <h3 className="font-bold text-lg mb-2 text-gray-800">{item.question}</h3>
                      <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.answer}</p>
                    </div>
                  ))
                ) : (
                  <div className="text-gray-500 italic">No FAQ items available.</div>
                )}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("contact") && (
          <Window
            title="contact - Get In Touch"
            isActive={activeWindow === "contact"}
            onClose={() => closeWindow("contact")}
            onFocus={() => focusWindow("contact")}
            initialPosition={getResponsivePosition(450, 300)}
            width={getResponsiveSize(500, 400).width}
            height={getResponsiveSize(500, 400).height}
            zIndex={getWindowZIndex("contact")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-6">
                <Mail className="w-8 h-8 text-cyan-600 mr-3" />
                <h2 className="text-2xl font-bold">{content.contact?.title || "Contact"}</h2>
              </div>
              <div className="space-y-4 text-sm">
                {content.contact ? (
                  <div dangerouslySetInnerHTML={{ __html: content.contact.content.replace(/\n/g, '<br/>') }} />
                ) : (
                  <div className="text-gray-500 italic">Loading content...</div>
                )}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("engineering") && (
          <Window
            title="engineering - Projects"
            isActive={activeWindow === "engineering"}
            onClose={() => closeWindow("engineering")}
            onFocus={() => focusWindow("engineering")}
            initialPosition={getResponsivePosition(200, 100)}
            width={getResponsiveSize(600, 500).width}
            height={getResponsiveSize(600, 500).height}
            zIndex={getWindowZIndex("engineering")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-6">
                <Rocket className="w-8 h-8 text-orange-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Engineering Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {getProjectsByCategory("engineering").map((project) => (
                  <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img 
                          src={project.imageUrl || "/placeholder.jpg"} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        {project.projectLink && (
                          <div className="mb-3">
                            <a 
                              href={project.projectLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              🔗 View Project
                            </a>
                          </div>
                        )}
                        {project.keywords && project.keywords.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.keywords.map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {project.photos && project.photos.length > 0 && (
                        <div className="w-32 space-y-2">
                          <p className="text-xs text-gray-500">Photos:</p>
                          <div className="space-y-2">
                            {project.photos.slice(0, 3).map((photo, index) => (
                              <img 
                                key={index} 
                                src={photo} 
                                alt={`${project.title} photo ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                            {project.photos.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{project.photos.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("games") && (
          <Window
            title="games - Projects"
            isActive={activeWindow === "games"}
            onClose={() => closeWindow("games")}
            onFocus={() => focusWindow("games")}
            initialPosition={getResponsivePosition(300, 200)}
            width={getResponsiveSize(600, 500).width}
            height={getResponsiveSize(600, 500).height}
            zIndex={getWindowZIndex("games")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-6">
                <Gamepad2 className="w-8 h-8 text-green-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Game Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {getProjectsByCategory("games").map((project) => (
                  <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img 
                          src={project.imageUrl || "/placeholder.jpg"} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        {project.projectLink && (
                          <div className="mb-3">
                            <a 
                              href={project.projectLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              🔗 View Project
                            </a>
                          </div>
                        )}
                        {project.keywords && project.keywords.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.keywords.map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {project.photos && project.photos.length > 0 && (
                        <div className="w-32 space-y-2">
                          <p className="text-xs text-gray-500">Photos:</p>
                          <div className="space-y-2">
                            {project.photos.slice(0, 3).map((photo, index) => (
                              <img 
                                key={index} 
                                src={photo} 
                                alt={`${project.title} photo ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                            {project.photos.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{project.photos.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )}

        {openWindows.includes("art") && (
          <Window
            title="art - Projects"
            isActive={activeWindow === "art"}
            onClose={() => closeWindow("art")}
            onFocus={() => focusWindow("art")}
            initialPosition={getResponsivePosition(400, 250)}
            width={getResponsiveSize(600, 500).width}
            height={getResponsiveSize(600, 500).height}
            zIndex={getWindowZIndex("art")}
          >
            <div className="p-6 bg-white h-full overflow-auto">
              <div className="flex items-center mb-6">
                <Palette className="w-8 h-8 text-purple-600 mr-3" />
                <h2 className="text-2xl font-bold text-gray-800">Art Projects</h2>
              </div>
              <div className="grid grid-cols-1 gap-6">
                {getProjectsByCategory("art").map((project) => (
                  <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-4">
                    <div className="flex gap-4">
                      <div className="w-32 h-32 flex-shrink-0">
                        <img 
                          src={project.imageUrl || "/placeholder.jpg"} 
                          alt={project.title}
                          className="w-full h-full object-cover rounded border"
                        />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                        <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                        {project.projectLink && (
                          <div className="mb-3">
                            <a 
                              href={project.projectLink} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 text-sm underline"
                            >
                              🔗 View Project
                            </a>
                          </div>
                        )}
                        {project.keywords && project.keywords.length > 0 && (
                          <div className="mb-3">
                            <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                            <div className="flex flex-wrap gap-1">
                              {project.keywords.map((keyword, index) => (
                                <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                  {keyword}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {project.tags.map((tag, index) => (
                            <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </div>
                      {project.photos && project.photos.length > 0 && (
                        <div className="w-32 space-y-2">
                          <p className="text-xs text-gray-500">Photos:</p>
                          <div className="space-y-2">
                            {project.photos.slice(0, 3).map((photo, index) => (
                              <img 
                                key={index} 
                                src={photo} 
                                alt={`${project.title} photo ${index + 1}`}
                                className="w-full h-20 object-cover rounded border"
                              />
                            ))}
                            {project.photos.length > 3 && (
                              <div className="text-xs text-gray-500 text-center">
                                +{project.photos.length - 3} more
                              </div>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Window>
        )}

        {windows
          .filter((w) => w.type === "custom")
          .map((w) =>
            openWindows.includes(w.key) ? (
              <Window
                key={w.key}
                title={w.label}
                isActive={activeWindow === w.key}
                onClose={() => closeWindow(w.key)}
                onFocus={() => focusWindow(w.key)}
                initialPosition={getResponsivePosition(300, 200)}
                width={getResponsiveSize(w.layout === "projects" ? 600 : 500, w.layout === "projects" ? 500 : 400).width}
                height={getResponsiveSize(w.layout === "projects" ? 600 : 500, w.layout === "projects" ? 500 : 400).height}
                zIndex={getWindowZIndex(w.key)}
              >
                {w.layout === "projects" ? (
                  <div className="p-6 bg-white h-full overflow-auto">
                    <div className="flex items-center mb-6">
                      {w.customIconUrl ? (
                        <img src={w.customIconUrl} alt={w.label} className="w-8 h-8 mr-3 object-contain" />
                      ) : (
                        renderIcon(w, true)
                      )}
                      <h2 className="text-2xl font-bold text-gray-800">{w.label}</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                      {projects
                        .filter((p) => p.isActive && p.customTabKey === w.key)
                        .sort((a, b) => a.orderIndex - b.orderIndex)
                        .map((project) => (
                          <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4 mb-4">
                            <div className="flex gap-4">
                              <div className="w-32 h-32 flex-shrink-0">
                                <img 
                                  src={project.imageUrl || "/placeholder.jpg"} 
                                  alt={project.title}
                                  className="w-full h-full object-cover rounded border"
                                />
                              </div>
                              <div className="flex-1">
                                <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                                <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                                {project.projectLink && (
                                  <div className="mb-3">
                                    <a 
                                      href={project.projectLink} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:text-blue-800 text-sm underline"
                                    >
                                      🔗 View Project
                                    </a>
                                  </div>
                                )}
                                {project.keywords && project.keywords.length > 0 && (
                                  <div className="mb-3">
                                    <p className="text-xs text-gray-500 mb-1">Keywords:</p>
                                    <div className="flex flex-wrap gap-1">
                                      {project.keywords.map((keyword, index) => (
                                        <span key={index} className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">
                                          {keyword}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                )}
                                <div className="flex flex-wrap gap-2">
                                  {project.tags.map((tag, index) => (
                                    <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                                      {tag}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              {project.photos && project.photos.length > 0 && (
                                <div className="w-32 space-y-2">
                                  <p className="text-xs text-gray-500">Photos:</p>
                                  <div className="space-y-2">
                                    {project.photos.slice(0, 3).map((photo, index) => (
                                      <img 
                                        key={index} 
                                        src={photo} 
                                        alt={`${project.title} photo ${index + 1}`}
                                        className="w-full h-20 object-cover rounded border"
                                      />
                                    ))}
                                    {project.photos.length > 3 && (
                                      <div className="text-xs text-gray-500 text-center">
                                        +{project.photos.length - 3} more
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      {projects.filter((p) => p.isActive && p.customTabKey === w.key).length === 0 && (
                        <div className="text-gray-500 italic">No projects available.</div>
                      )}
                    </div>
                  </div>
                ) : w.layout === "faq" ? (
                  <div className="p-6 bg-white h-full overflow-auto">
                    <div className="flex items-center mb-6">
                      {w.customIconUrl ? (
                        <img src={w.customIconUrl} alt={w.label} className="w-8 h-8 mr-3 object-contain" />
                      ) : (
                        renderIcon(w, true)
                      )}
                      <h2 className="text-2xl font-bold text-gray-800">{w.label}</h2>
                    </div>
                    <div className="space-y-6">
                      {faqItems.filter((item) => item.customTabKey === w.key).length > 0 ? (
                        faqItems.filter((item) => item.customTabKey === w.key).map((item) => (
                          <div key={item.id} className="border-b border-gray-200 pb-4 last:border-0">
                            <h3 className="font-bold text-lg mb-2 text-gray-800">{item.question}</h3>
                            <p className="text-sm text-gray-600 whitespace-pre-wrap">{item.answer}</p>
                          </div>
                        ))
                      ) : (
                        <div className="text-gray-500 italic">No FAQ items available.</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="p-6 bg-white h-full overflow-auto">
                    <div className="flex items-center mb-6">
                      {w.customIconUrl ? (
                        <img src={w.customIconUrl} alt={w.label} className="w-8 h-8 mr-3 object-contain" />
                      ) : (
                        renderIcon(w, true)
                      )}
                      <h2 className="text-2xl font-bold text-gray-800">{w.label}</h2>
                    </div>
                    <div className="text-sm text-gray-700 space-y-3">
                      {w.content ? (
                        <div dangerouslySetInnerHTML={{ __html: w.content.replace(/\n/g, "<br/>") }} />
                      ) : (
                        <p className="italic text-gray-500">No content set yet for this window.</p>
                      )}
                    </div>
                  </div>
                )}
              </Window>
            ) : null
          )}
      </div>
    </div>
  )
}

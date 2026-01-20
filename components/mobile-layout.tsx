"use client"

import { useState, useEffect } from "react"
import { User, Rocket, Gamepad2, Palette, Mail, HelpCircle } from "lucide-react"
import AnalyticsTracker from "@/components/analytics-tracker"

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
}

export default function MobileLayout() {
  const [activeSection, setActiveSection] = useState<string | null>(null)
  const [content, setContent] = useState<Record<string, Content>>({})
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Load content from admin panel
  useEffect(() => {
    const loadContent = async () => {
      try {
        // Load content sections
        const sections = ["about", "contact", "faq"]
        const contentData: Record<string, Content> = {}

        for (const section of sections) {
          const res = await fetch(`/api/content?section=${section}`)
          const data = await res.json()
          if (data) contentData[section] = data
        }
        setContent(contentData)

        // Load projects
        const projectsRes = await fetch("/api/projects")
        const projectsData = await projectsRes.json()
        setProjects(projectsData)

        setLoading(false)
      } catch (error) {
        console.error("Failed to load content:", error)
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  const handleIconClick = (section: string) => {
    setActiveSection(section)
  }

  const handleBack = () => {
    setActiveSection(null)
  }

  const getProjectsByCategory = (category: "engineering" | "games" | "art") => {
    return projects.filter(project => project.category === category)
  }

  // Show loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 flex items-center justify-center">
        <div className="text-white text-xl">Loading...</div>
      </div>
    )
  }

  if (activeSection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden flex flex-col">
        <AnalyticsTracker page={activeSection} />
        {/* Windows 7 style background pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
        </div>

        {/* Header */}
        <div className="bg-black/20 backdrop-blur-md border-b border-white/20 p-4 flex items-center">
          <button
            onClick={handleBack}
            className="text-white mr-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded border border-white/30 hover:bg-white/30 transition-all duration-200"
          >
            ← Back
          </button>
          <h1 className="text-lg font-semibold capitalize text-white drop-shadow-sm">{activeSection}</h1>
        </div>

        {/* Content */}
        <div className="flex-1 p-4">
          {activeSection === "about" && content.about && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded mr-4 flex items-center justify-center border border-white/30">
                    <User className="w-8 h-8 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">{content.about.title}</h2>
                    <p className="text-gray-600">Final Year Aerospace Engineering Student</p>
                  </div>
                </div>
                <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: content.about.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          )}

          {activeSection === "contact" && content.contact && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <Mail className="w-8 h-8 text-cyan-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800">{content.contact.title}</h2>
                </div>
                <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: content.contact.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          )}

          {activeSection === "faq" && content.faq && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <HelpCircle className="w-8 h-8 text-yellow-600 mr-3" />
                  <h2 className="text-xl font-bold text-gray-800">{content.faq.title}</h2>
                </div>
                <div className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: content.faq.content.replace(/\n/g, '<br/>') }} />
              </div>
            </div>
          )}

          {activeSection === "engineering" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <Rocket className="w-8 h-8 text-orange-600 mr-3" />
                  <h3 className="font-semibold text-gray-800">Engineering Projects</h3>
                </div>
                <div className="space-y-4">
                  {getProjectsByCategory("engineering").map((project) => (
                    <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      
                      {/* Project link */}
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
                      
                      {/* Keywords */}
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
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "games" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <Gamepad2 className="w-8 h-8 text-green-600 mr-3" />
                  <h3 className="font-semibold text-gray-800">Game Projects</h3>
                </div>
                <div className="space-y-4">
                  {getProjectsByCategory("games").map((project) => (
                    <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      
                      {/* Project link */}
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
                      
                      {/* Keywords */}
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
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeSection === "art" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <Palette className="w-8 h-8 text-purple-600 mr-3" />
                  <h3 className="font-semibold text-gray-800">Art Projects</h3>
                </div>
                <div className="space-y-4">
                  {getProjectsByCategory("art").map((project) => (
                    <div key={project.id} className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">{project.title}</h4>
                      <p className="text-sm text-gray-600 mb-3">{project.description}</p>
                      
                      {/* Project link */}
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
                      
                      {/* Keywords */}
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
                      
                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {project.tags.map((tag, index) => (
                          <span key={index} className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      <AnalyticsTracker page="home" />
      {/* Windows 7 style background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>

      {/* Header */}
      <div className="relative z-10 p-6 pt-12">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-white mb-2 drop-shadow-sm">
            hi! i'm <span className="text-blue-200">shubham</span>
          </h1>
          <p className="text-blue-100 text-lg drop-shadow-sm">aerospace engineer, game developer, and digital artist</p>
        </div>

        {/* Grid of sections */}
        <div className="grid grid-cols-2 gap-4">
          <button
            onClick={() => handleIconClick("about")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <User className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">About</span>
          </button>

          <button
            onClick={() => handleIconClick("engineering")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <Rocket className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">Engineering</span>
          </button>

          <button
            onClick={() => handleIconClick("games")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <Gamepad2 className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">Games</span>
          </button>

          <button
            onClick={() => handleIconClick("art")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <Palette className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">Art</span>
          </button>

          <button
            onClick={() => handleIconClick("contact")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <Mail className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">Contact</span>
          </button>

          <button
            onClick={() => handleIconClick("faq")}
            className="bg-white/20 backdrop-blur-sm border border-white/30 rounded-lg p-6 hover:bg-white/30 transition-all duration-200 flex flex-col items-center"
          >
            <HelpCircle className="w-12 h-12 text-white mb-3" />
            <span className="text-white font-medium">FAQ</span>
          </button>
        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-white/80 text-sm">© {new Date().getFullYear()} Shubham Ranabhat</p>
        </div>
      </div>
    </div>
  )
}

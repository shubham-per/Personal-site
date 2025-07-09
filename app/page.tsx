"use client"

import { useState, useEffect } from "react"
import Window from "@/components/window"
import DesktopIcon from "@/components/desktop-icon"
import MobileLayout from "@/components/mobile-layout"
import { Rocket, Gamepad2, Palette, User, Mail, Youtube, MessageCircle, HelpCircle } from "lucide-react"

export default function Page() {
  const [openWindows, setOpenWindows] = useState<string[]>(["home"])
  const [activeWindow, setActiveWindow] = useState("home")
  const [windowDimensions, setWindowDimensions] = useState({ width: 1200, height: 800 })
  const [windowZIndex, setWindowZIndex] = useState<Record<string, number>>({})
  const [nextZIndex, setNextZIndex] = useState(100)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    // Set initial window dimensions and check if mobile
    const updateDimensions = () => {
      setWindowDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      })
      setIsMobile(window.innerWidth < 768) // Mobile breakpoint
    }

    updateDimensions()

    // Handle window resize
    window.addEventListener("resize", updateDimensions)
    return () => window.removeEventListener("resize", updateDimensions)
  }, [])

  const openWindow = (windowId: string) => {
    if (!openWindows.includes(windowId)) {
      setOpenWindows([...openWindows, windowId])
    }
    // Always bring window to front when opened
    setWindowZIndex((prev) => ({ ...prev, [windowId]: nextZIndex }))
    setNextZIndex((prev) => prev + 1)
    setActiveWindow(windowId)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows(openWindows.filter((id) => id !== windowId))
    // Remove from z-index tracking
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
    // Bring window to front
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

  // If mobile, render mobile layout
  if (isMobile) {
    return <MobileLayout />
  }

  // Desktop layout (existing code)
  return (
    <div className="h-screen w-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden">
      {/* Windows 7 style background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>
      {/* Desktop Icons */}
      <div className="absolute top-4 sm:top-6 left-4 sm:left-6 space-y-2 sm:space-y-4">
        <DesktopIcon
          icon={<Rocket className="w-6 h-6" />}
          label="Engineering"
          onDoubleClick={() => openWindow("engineering")}
          textColor="white"
        />
        <DesktopIcon
          icon={<Gamepad2 className="w-6 h-6" />}
          label="Games"
          onDoubleClick={() => openWindow("games")}
          textColor="white"
        />
        <DesktopIcon
          icon={<Palette className="w-6 h-6" />}
          label="Art"
          onDoubleClick={() => openWindow("art")}
          textColor="white"
        />
      </div>

      {/* Social Media Icons */}
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

      {/* Taskbar */}
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

      {/* Windows */}
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
              <DesktopIcon
                icon={<User className="w-8 h-8 text-blue-600" />}
                label="about"
                onDoubleClick={() => openWindow("about")}
                size="large"
                textColor="dark"
              />
              <DesktopIcon
                icon={<Rocket className="w-8 h-8 text-orange-600" />}
                label="engineering"
                onDoubleClick={() => openWindow("engineering")}
                size="large"
                textColor="dark"
              />
              <DesktopIcon
                icon={<Gamepad2 className="w-8 h-8 text-green-600" />}
                label="games"
                onDoubleClick={() => openWindow("games")}
                size="large"
                textColor="dark"
              />
              <DesktopIcon
                icon={<Palette className="w-8 h-8 text-purple-600" />}
                label="art"
                onDoubleClick={() => openWindow("art")}
                size="large"
                textColor="dark"
              />
              <DesktopIcon
                icon={<Mail className="w-8 h-8 text-cyan-600" />}
                label="contact"
                onDoubleClick={() => openWindow("contact")}
                size="large"
                textColor="dark"
              />
              <DesktopIcon
                icon={<HelpCircle className="w-8 h-8 text-yellow-600" />}
                label="faq"
                onDoubleClick={() => openWindow("faq")}
                size="large"
                textColor="dark"
              />
            </div>
          </div>
        </Window>
      )}

      {/* All other windows remain the same... */}
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
                <h2 className="text-xl font-bold">Shubham Ranabhat</h2>
                <p className="text-gray-600">Final Year Aerospace Engineering Student</p>
              </div>
            </div>

            <div className="space-y-4 text-sm">
              <p>
                I'm a final year aerospace engineering student with a passion for pushing boundaries across multiple
                disciplines. My journey began with a fascination for flight and space exploration, which led me to
                pursue aerospace engineering.
              </p>

              <p>
                Beyond engineering, I've developed strong interests in game development and digital art. I use tools
                like Blender, Photoshop, and After Effects to bring creative visions to life, while also building
                interactive experiences through game development.
              </p>

              <div className="mt-6">
                <h3 className="font-bold mb-2">Current Focus:</h3>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Rocket propulsion systems</li>
                  <li>Game physics programming</li>
                  <li>3D modeling and animation</li>
                  <li>VFX and motion graphics</li>
                </ul>
              </div>
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
              <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
            </div>

            <div className="space-y-6">
              <div className="border-l-4 border-yellow-500 pl-4">
                <h3 className="font-bold text-lg mb-2">What do you specialize in?</h3>
                <p className="text-sm text-gray-700">
                  I specialize in aerospace engineering, game development, and digital art. My focus areas include
                  rocket propulsion, flight control systems, and 3D modeling.
                </p>
              </div>

              <div className="border-l-4 border-green-500 pl-4">
                <h3 className="font-bold text-lg mb-2">Are you available for projects?</h3>
                <p className="text-sm text-gray-700">
                  Yes! I'm currently available for aerospace engineering internships, game development collaborations,
                  and 3D modeling projects.
                </p>
              </div>

              <div className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-bold text-lg mb-2">What tools do you use?</h3>
                <p className="text-sm text-gray-700">
                  I use Blender for 3D modeling, Unity and Unreal for game development, and various CAD tools for
                  engineering design. For VFX, I work with After Effects and Photoshop.
                </p>
              </div>

              <div className="border-l-4 border-purple-500 pl-4">
                <h3 className="font-bold text-lg mb-2">How can I contact you?</h3>
                <p className="text-sm text-gray-700">
                  You can reach me through email, LinkedIn, or GitHub. I'm always open to discussing new opportunities
                  and collaborations in aerospace engineering, game development, or digital art.
                </p>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Engineering Window */}
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
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Liquid Rocket Engine</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Bipropellant rocket engine development with thrust vectoring capabilities and real-time monitoring
                  systems.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Propulsion</span>
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">CAD</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Testing</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Flight Computer for Rockets</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Autonomous flight control system with real-time telemetry and data logging capabilities.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Electronics</span>
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded">Programming</span>
                  <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Control Systems</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg mb-2 text-gray-800">Thrust Vectoring Model</h4>
                <p className="text-sm text-gray-600 mb-3">
                  Active flight control demonstration using servo-controlled nozzles for stability and maneuverability.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Control Systems</span>
                  <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Mechanics</span>
                  <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">3D Printing</span>
                </div>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-bold text-lg mb-2 text-gray-800">HALE UAV Design</h4>
                <p className="text-sm text-gray-600 mb-3">
                  High Altitude Long Endurance aircraft design and aerodynamic analysis for extended flight missions.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Aerodynamics</span>
                  <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded">Design</span>
                  <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Analysis</span>
                </div>
              </div>

              <div className="col-span-full mt-8 space-y-4">
                <button
                  onClick={() => openWindow("shit-projects")}
                  className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-red-100"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">💩</span>
                    <h4 className="font-bold text-xl text-red-700">SHIT Projects Collection</h4>
                  </div>
                  <p className="text-red-600 text-sm text-left">
                    Click to view the most cursed engineering projects...
                  </p>
                </button>

                <button
                  onClick={() => openWindow("trash-projects")}
                  className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-6 hover:shadow-lg transition-all duration-300 hover:bg-gray-100"
                >
                  <div className="flex items-center mb-4">
                    <span className="text-2xl mr-3">🗑️</span>
                    <h4 className="font-bold text-xl text-gray-700">Absolute Trash Collection</h4>
                  </div>
                  <p className="text-gray-600 text-sm text-left">
                    Academic requirement projects (click to view the suffering)...
                  </p>
                </button>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Games Window */}
      {openWindows.includes("games") && (
        <Window
          title="games - Development"
          isActive={activeWindow === "games"}
          onClose={() => closeWindow("games")}
          onFocus={() => focusWindow("games")}
          initialPosition={getResponsivePosition(250, 150)}
          width={getResponsiveSize(600, 500).width}
          height={getResponsiveSize(600, 500).height}
          zIndex={getWindowZIndex("games")}
        >
          <div className="p-6 bg-white h-full overflow-auto">
            <div className="flex items-center mb-6">
              <Gamepad2 className="w-8 h-8 text-green-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Game Development</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">🚀</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-800">Space Explorer</h4>
                    <p className="text-gray-600">3D Space Exploration Game</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  A 3D space exploration game featuring realistic physics, procedurally generated planets, and immersive
                  spacecraft mechanics. Players can explore vast solar systems and discover unique worlds.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Unity</span>
                  <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">C#</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Procedural Generation</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-blue-600 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-white text-2xl">🌍</span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xl text-gray-800">Orbital Mechanics Simulator</h4>
                    <p className="text-gray-600">Educational Physics Game</p>
                  </div>
                </div>
                <p className="text-sm text-gray-600 mb-4">
                  An educational game that teaches orbital mechanics through interactive puzzles and simulations.
                  Perfect for students learning about space physics and satellite dynamics.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-cyan-100 text-cyan-800 text-xs px-2 py-1 rounded">Physics</span>
                  <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">Education</span>
                  <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Simulation</span>
                </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Art Window */}
      {openWindows.includes("art") && (
        <Window
          title="art - Digital Art & VFX"
          isActive={activeWindow === "art"}
          onClose={() => closeWindow("art")}
          onFocus={() => focusWindow("art")}
          initialPosition={getResponsivePosition(300, 200)}
          width={getResponsiveSize(600, 500).width}
          height={getResponsiveSize(600, 500).height}
          zIndex={getWindowZIndex("art")}
        >
          <div className="p-6 bg-white h-full overflow-auto">
            <div className="flex items-center mb-6">
              <Palette className="w-8 h-8 text-purple-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Digital Art & VFX</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🚀</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Space Station Concept</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    3D model and animation of a futuristic space station with detailed interior and exterior designs.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Blender</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">3D Modeling</span>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Animation</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="w-full h-32 bg-gradient-to-br from-orange-400 to-red-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🔥</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Rocket Launch Animation</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    VFX sequence showing realistic rocket launch with particle effects and atmospheric dynamics.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">After Effects</span>
                    <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">VFX</span>
                    <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Motion Graphics</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="w-full h-32 bg-gradient-to-br from-green-400 to-blue-600 flex items-center justify-center">
                  <span className="text-white text-4xl">🌌</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Sci-Fi Environment</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Detailed 3D environment with atmospheric lighting and futuristic architectural elements.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Blender</span>
                    <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Lighting</span>
                    <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Texturing</span>
                  </div>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg overflow-hidden border border-gray-200">
                <div className="w-full h-32 bg-gradient-to-br from-pink-400 to-purple-600 flex items-center justify-center">
                  <span className="text-white text-4xl">⚡</span>
                </div>
                <div className="p-4">
                  <h4 className="font-bold text-lg mb-2 text-gray-800">Technical Animations</h4>
                  <p className="text-sm text-gray-600 mb-3">
                    Educational animations explaining complex aerospace concepts and engineering principles.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">Animation</span>
                    <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Education</span>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Technical</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Contact Window */}
      {openWindows.includes("contact") && (
        <Window
          title="contact - Get in Touch"
          isActive={activeWindow === "contact"}
          onClose={() => closeWindow("contact")}
          onFocus={() => focusWindow("contact")}
          initialPosition={getResponsivePosition(400, 250)}
          width={getResponsiveSize(500, 400).width}
          height={getResponsiveSize(500, 400).height}
          zIndex={getWindowZIndex("contact")}
        >
          <div className="p-6 bg-white h-full overflow-auto">
            <div className="flex items-center mb-6">
              <Mail className="w-8 h-8 text-cyan-600 mr-3" />
              <h2 className="text-2xl font-bold text-gray-800">Get in Touch</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">📧</span>
                  Email
                </h4>
                <p className="text-gray-600">shubham.ranabhat@example.com</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">💼</span>
                  LinkedIn
                </h4>
                <p className="text-gray-600">linkedin.com/in/shubham-ranabhat</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                  <span className="text-xl mr-2">🐙</span>
                  GitHub
                </h4>
                <p className="text-gray-600">github.com/shubham-ranabhat</p>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                  <span className="text-xl mr-2">🎯</span>
                  Currently Available For
                </h4>
                <ul className="text-gray-600 space-y-2">
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                    Aerospace Engineering Internships
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                    Game Development Collaborations
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                    3D Modeling & Animation Projects
                  </li>
                  <li className="flex items-center">
                    <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                    Research Opportunities
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* SHIT Projects Window */}
      {openWindows.includes("shit-projects") && (
        <Window
          title="💩 SHIT Projects Collection"
          isActive={activeWindow === "shit-projects"}
          onClose={() => closeWindow("shit-projects")}
          onFocus={() => focusWindow("shit-projects")}
          initialPosition={getResponsivePosition(150, 50)}
          width={getResponsiveSize(700, 600).width}
          height={getResponsiveSize(700, 600).height}
          zIndex={getWindowZIndex("shit-projects")}
        >
          <div className="p-6 bg-white h-full overflow-auto">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">💩</span>
              <h2 className="text-2xl font-bold text-red-700">The Most Cursed Engineering Projects</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-xl mb-3 text-gray-800">CFD of Toilet Flush</h4>
                <p className="text-lg text-gray-600 mb-3">Fluid dynamics analysis of bathroom fixtures</p>
                <p className="text-sm text-gray-700 mb-4">
                  Comprehensive computational fluid dynamics analysis of toilet flushing mechanisms. Studied vortex
                  formation, flow patterns, and optimization of water usage efficiency. This project involved detailed
                  mesh generation, turbulence modeling, and validation against experimental data. Yes, this actually
                  happened, and yes, I had to present it to a room full of professors with straight faces.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">CFD</span>
                  <span className="bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded">Fluid Mechanics</span>
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded">Cursed</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">ANSYS Fluent</span>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-xl mb-3 text-gray-800">Fart Simulation</h4>
                <p className="text-lg text-gray-600 mb-3">Aerodynamic analysis of biological gas expulsion</p>
                <p className="text-sm text-gray-700 mb-4">
                  Mathematical modeling and simulation of gas dynamics in biological systems. Included pressure wave
                  propagation, turbulence modeling, and acoustic analysis. The project covered everything from initial
                  gas composition to final dispersion patterns. The things we do for science... and the looks we got
                  from classmates were priceless.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">Gas Dynamics</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded">Acoustics</span>
                  <span className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded">Biology</span>
                  <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded">MATLAB</span>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-xl mb-3 text-gray-800">Dick Plane</h4>
                <p className="text-lg text-gray-600 mb-3">Unconventional aircraft configuration study</p>
                <p className="text-sm text-gray-700 mb-4">
                  Aerodynamic analysis of... unconventionally shaped aircraft configurations. Studied lift generation,
                  drag characteristics, and stability of non-traditional geometries. The project required maintaining
                  professional composure while discussing "thrust characteristics" and "penetration efficiency."
                  Engineering knows no bounds of awkwardness.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">Aerodynamics</span>
                  <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded">Unconventional</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Questionable</span>
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded">Wind Tunnel</span>
                </div>
              </div>

              <div className="bg-red-50 p-6 rounded-lg border border-red-200">
                <h4 className="font-bold text-xl mb-3 text-gray-800">Waifu Dancing Mechanical Design</h4>
                <p className="text-lg text-gray-600 mb-3">Anthropomorphic robotic motion system</p>
                <p className="text-sm text-gray-700 mb-4">
                  Mechanical design and kinematic analysis of humanoid dancing robots. Included joint optimization,
                  motion planning, and synchronization with music. The project involved servo motor selection, gear
                  ratio calculations, and programming dance sequences. Where engineering meets... culture. The final
                  presentation was... memorable.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded">Robotics</span>
                  <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded">Kinematics</span>
                  <span className="bg-pink-100 text-pink-800 text-sm px-3 py-1 rounded">Cultural</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded">Arduino</span>
                </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Trash Projects Window */}
      {openWindows.includes("trash-projects") && (
        <Window
          title="🗑️ Absolute Trash Collection"
          isActive={activeWindow === "trash-projects"}
          onClose={() => closeWindow("trash-projects")}
          onFocus={() => focusWindow("trash-projects")}
          initialPosition={getResponsivePosition(200, 100)}
          width={getResponsiveSize(700, 600).width}
          height={getResponsiveSize(700, 600).height}
          zIndex={getWindowZIndex("trash-projects")}
        >
          <div className="p-6 bg-white h-full overflow-auto">
            <div className="flex items-center mb-6">
              <span className="text-3xl mr-3">🗑️</span>
              <h2 className="text-2xl font-bold text-gray-700">Academic Requirement Trash</h2>
            </div>

            <div className="space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h4 className="font-bold text-xl mb-3 text-gray-800">MAP of IOE Pulchowk in Retro Style (using C)</h4>
                <p className="text-lg text-gray-600 mb-3">Campus mapping project in ancient C</p>
                <p className="text-sm text-gray-700 mb-4">
                  Created a digital map of IOE Pulchowk campus using pure C programming. Features ASCII art graphics,
                  file I/O operations, and basic navigation. The professor insisted on C because "it builds character."
                  The year was 2024. Modern languages existed. The pain was real. Spent weeks debugging pointer
                  arithmetic for what could have been done in Python in an afternoon.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded">C Programming</span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">ASCII Art</span>
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded">Academic Torture</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Pointers Hell</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h4 className="font-bold text-xl mb-3 text-gray-800">Motion Capture Software</h4>
                <p className="text-lg text-gray-600 mb-3">Computer vision project for academic credit</p>
                <p className="text-sm text-gray-700 mb-4">
                  Developed motion capture software using OpenCV and Python. Features include marker tracking, 3D
                  reconstruction, and animation export. Worked perfectly during development and testing. Crashed
                  spectacularly during the final presentation when the professor asked "what if we move the camera?"
                  Classic demo gods at work.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded">Computer Vision</span>
                  <span className="bg-cyan-100 text-cyan-800 text-sm px-3 py-1 rounded">OpenCV</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Demo Gods</span>
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded">Murphy's Law</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h4 className="font-bold text-xl mb-3 text-gray-800">3D Design Hackathon</h4>
                <p className="text-lg text-gray-600 mb-3">24-hour design competition survival</p>
                <p className="text-sm text-gray-700 mb-4">
                  Participated in 24-hour 3D design hackathon. Created innovative product designs under extreme time
                  pressure. Survived on energy drinks, determination, and questionable life choices. Won participation
                  certificate and a newfound appreciation for sleep. Worth it? Debatable. Would do it again? Probably.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded">3D Design</span>
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded">Sleep Deprivation</span>
                  <span className="bg-yellow-100 text-yellow-800 text-sm px-3 py-1 rounded">Participation Trophy</span>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded">Caffeine Overdose</span>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg border border-gray-300">
                <h4 className="font-bold text-xl mb-3 text-gray-800">Gaussian Splatting</h4>
                <p className="text-lg text-gray-600 mb-3">3D reconstruction using neural radiance fields</p>
                <p className="text-sm text-gray-700 mb-4">
                  Implemented Gaussian splatting for 3D scene reconstruction from 2D images. Involved neural networks,
                  optimization algorithms, and lots of GPU crying. Results were... splat-tastic. Professor was not
                  amused by the pun. GPU temperature reached levels that could probably cook an egg. Worth every degree
                  Celsius.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="bg-indigo-100 text-indigo-800 text-sm px-3 py-1 rounded">Neural Networks</span>
                  <span className="bg-teal-100 text-teal-800 text-sm px-3 py-1 rounded">3D Reconstruction</span>
                  <span className="bg-red-100 text-red-800 text-sm px-3 py-1 rounded">GPU Torture</span>
                  <span className="bg-purple-100 text-purple-800 text-sm px-3 py-1 rounded">PyTorch</span>
                </div>
              </div>
            </div>
          </div>
        </Window>
      )}

      {/* Copyright */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 text-xs text-white/80 drop-shadow-sm">
        © {new Date().getFullYear()} Shubham Ranabhat
      </div>
    </div>
  )
}

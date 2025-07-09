"use client"

import { useState } from "react"
import { User, Rocket, Gamepad2, Palette, Mail, HelpCircle } from "lucide-react"

export default function MobileLayout() {
  const [activeSection, setActiveSection] = useState<string | null>(null)

  const handleIconClick = (section: string) => {
    setActiveSection(section)
  }

  const handleBack = () => {
    setActiveSection(null)
  }

  if (activeSection) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden flex flex-col">
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
          {activeSection === "about" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-6 border border-white/30 shadow-lg">
                <div className="flex items-center mb-4">
                  <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded mr-4 flex items-center justify-center border border-white/30">
                    <User className="w-8 h-8 text-gray-700" />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800">Shubham Ranabhat</h2>
                    <p className="text-gray-600">Final Year Aerospace Engineering Student</p>
                  </div>
                </div>
                <p className="text-sm text-gray-700 mb-4">
                  I'm a final year aerospace engineering student with a passion for pushing boundaries across multiple
                  disciplines. My journey began with a fascination for flight and space exploration.
                </p>
                <p className="text-sm text-gray-700 mb-4">
                  Beyond engineering, I've developed strong interests in game development and digital art using tools
                  like Blender, Photoshop, and After Effects.
                </p>
                <div className="mt-6">
                  <h3 className="font-bold mb-2 text-gray-800">Current Focus:</h3>
                  <ul className="list-disc list-inside space-y-1 text-gray-700 text-sm">
                    <li>Rocket propulsion systems</li>
                    <li>Game physics programming</li>
                    <li>3D modeling and animation</li>
                    <li>VFX and motion graphics</li>
                  </ul>
                </div>
              </div>
            </div>
          )}

          {activeSection === "engineering" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Engineering Projects</h3>
                <div className="space-y-4">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
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

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
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

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Thrust Vectoring Model</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      Active flight control demonstration using servo-controlled nozzles for stability and
                      maneuverability.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Control Systems</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Mechanics</span>
                      <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">3D Printing</span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">HALE UAV Design</h4>
                    <p className="text-sm text-gray-600 mb-3">
                      High Altitude Long Endurance aircraft design and aerodynamic analysis for extended flight
                      missions.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-teal-100 text-teal-800 text-xs px-2 py-1 rounded">Aerodynamics</span>
                      <span className="bg-lime-100 text-lime-800 text-xs px-2 py-1 rounded">Design</span>
                      <span className="bg-amber-100 text-amber-800 text-xs px-2 py-1 rounded">Analysis</span>
                    </div>
                  </div>

                  <div className="mt-4 space-y-4">
                    <button
                      onClick={() => handleIconClick("shit-projects")}
                      className="w-full bg-red-50 border-2 border-red-200 rounded-lg p-4 hover:bg-red-100 transition-all duration-200"
                    >
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">💩</span>
                        <h4 className="font-bold text-lg text-red-700">SHIT Projects Collection</h4>
                      </div>
                      <p className="text-red-600 text-sm text-left">
                        Click to view the most cursed engineering projects...
                      </p>
                    </button>

                    <button
                      onClick={() => handleIconClick("trash-projects")}
                      className="w-full bg-gray-50 border-2 border-gray-300 rounded-lg p-4 hover:bg-gray-100 transition-all duration-200"
                    >
                      <div className="flex items-center mb-3">
                        <span className="text-2xl mr-3">🗑️</span>
                        <h4 className="font-bold text-lg text-gray-700">Absolute Trash Collection</h4>
                      </div>
                      <p className="text-gray-600 text-sm text-left">
                        Academic requirement projects (click to view the suffering)...
                      </p>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "games" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Game Development</h3>
                <div className="space-y-6">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
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
                      A 3D space exploration game featuring realistic physics, procedurally generated planets, and
                      immersive spacecraft mechanics. Players can explore vast solar systems and discover unique worlds.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Unity</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">C#</span>
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">
                        Procedural Generation
                      </span>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg p-4">
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
            </div>
          )}

          {activeSection === "art" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Digital Art & VFX</h3>
                <div className="grid grid-cols-1 gap-4">
                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
                    <div className="w-full h-32 bg-gradient-to-br from-blue-400 to-purple-600 flex items-center justify-center">
                      <span className="text-white text-4xl">🚀</span>
                    </div>
                    <div className="p-4">
                      <h4 className="font-bold text-lg mb-2 text-gray-800">Space Station Concept</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        3D model and animation of a futuristic space station with detailed interior and exterior
                        designs.
                      </p>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Blender</span>
                        <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">3D Modeling</span>
                        <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Animation</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
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

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
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

                  <div className="bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg overflow-hidden">
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
            </div>
          )}

          {activeSection === "contact" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Get in Touch</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium text-gray-800">📧 Email</h4>
                    <p className="text-sm text-gray-600">shubham.ranabhat@example.com</p>
                  </div>
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium text-gray-800">💼 LinkedIn</h4>
                    <p className="text-sm text-gray-600">linkedin.com/in/shubham-ranabhat</p>
                  </div>
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium text-gray-800">🐙 GitHub</h4>
                    <p className="text-sm text-gray-600">github.com/shubham-ranabhat</p>
                  </div>
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium text-gray-800">🎯 Currently Available For</h4>
                    <ul className="text-sm text-gray-600 space-y-1 mt-2">
                      <li>• Aerospace Engineering Internships</li>
                      <li>• Game Development Collaborations</li>
                      <li>• 3D Modeling & Animation Projects</li>
                      <li>• Research Opportunities</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "faq" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-800">Frequently Asked Questions</h3>
                <div className="space-y-4">
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">What do you specialize in?</h4>
                    <p className="text-sm text-gray-600">
                      I specialize in aerospace engineering, game development, and digital art. My focus areas include
                      rocket propulsion, flight control systems, and 3D modeling.
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">Are you available for projects?</h4>
                    <p className="text-sm text-gray-600">
                      Yes! I'm currently available for aerospace engineering internships, game development
                      collaborations, and 3D modeling projects.
                    </p>
                  </div>
                  <div className="p-3 bg-white/50 backdrop-blur-sm border border-white/30 rounded-lg">
                    <h4 className="font-medium mb-2 text-gray-800">What tools do you use?</h4>
                    <p className="text-sm text-gray-600">
                      I use Blender for 3D modeling, Unity and Unreal for game development, and various CAD tools for
                      engineering design. For VFX, I work with After Effects and Photoshop.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "shit-projects" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-red-700 flex items-center">
                  <span className="text-2xl mr-2">💩</span>
                  The Most Cursed Engineering Projects
                </h3>
                <div className="space-y-4">
                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">CFD of Toilet Flush</h4>
                    <p className="text-sm text-gray-600 mb-2">Fluid dynamics analysis of bathroom fixtures</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Comprehensive CFD analysis of toilet flushing mechanisms. Yes, this actually happened.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">CFD</span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Cursed</span>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Fart Simulation</h4>
                    <p className="text-sm text-gray-600 mb-2">Aerodynamic analysis of biological gas expulsion</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Mathematical modeling of gas dynamics in biological systems. The things we do for science...
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Gas Dynamics</span>
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Acoustics</span>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Dick Plane</h4>
                    <p className="text-sm text-gray-600 mb-2">Unconventional aircraft configuration study</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Aerodynamic analysis of... unconventionally shaped aircraft. Engineering knows no bounds.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Aerodynamics</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Questionable</span>
                    </div>
                  </div>

                  <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Waifu Dancing Mechanical Design</h4>
                    <p className="text-sm text-gray-600 mb-2">Anthropomorphic robotic motion system</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Mechanical design of humanoid dancing robots. Where engineering meets... culture.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Robotics</span>
                      <span className="bg-pink-100 text-pink-800 text-xs px-2 py-1 rounded">Cultural</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "trash-projects" && (
            <div className="space-y-4">
              <div className="bg-white/90 backdrop-blur-sm rounded-lg p-4 border border-white/30 shadow-lg">
                <h3 className="font-semibold mb-4 text-gray-700 flex items-center">
                  <span className="text-2xl mr-2">🗑️</span>
                  Academic Requirement Trash
                </h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">MAP of IOE Pulchowk (using C)</h4>
                    <p className="text-sm text-gray-600 mb-2">Campus mapping project in ancient C</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Digital map using pure C programming. The professor insisted on C. The year was 2024. The pain was
                      real.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">C Programming</span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">Academic Torture</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Motion Capture Software</h4>
                    <p className="text-sm text-gray-600 mb-2">Computer vision project for academic credit</p>
                    <p className="text-xs text-gray-500 mb-3">
                      OpenCV motion capture software. Worked in demo, crashed during presentation. Classic.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-purple-100 text-purple-800 text-xs px-2 py-1 rounded">Computer Vision</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">Demo Gods</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">3D Design Hackathon</h4>
                    <p className="text-sm text-gray-600 mb-2">24-hour design competition survival</p>
                    <p className="text-xs text-gray-500 mb-3">
                      24-hour hackathon survival. Won participation certificate. Worth it? Debatable.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded">3D Design</span>
                      <span className="bg-yellow-100 text-yellow-800 text-xs px-2 py-1 rounded">
                        Participation Trophy
                      </span>
                    </div>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg border border-gray-300">
                    <h4 className="font-bold text-lg mb-2 text-gray-800">Gaussian Splatting</h4>
                    <p className="text-sm text-gray-600 mb-2">3D reconstruction using neural radiance fields</p>
                    <p className="text-xs text-gray-500 mb-3">
                      Neural networks and GPU torture. Results were... splat-tastic. Professor was not amused.
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded">Neural Networks</span>
                      <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded">GPU Torture</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-400 via-blue-500 to-blue-600 relative overflow-hidden flex flex-col">
      {/* Windows 7 style background pattern */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_0%,transparent_50%)]"></div>
      </div>

      {/* Main Content */}
      <div className="flex-1 px-6 py-8">
        {/* Header */}
        <div className="text-center mb-12 mt-8">
          <h1 className="text-4xl font-light text-white mb-2 drop-shadow-lg">
            hi! i'm <span className="text-cyan-300 font-normal">shubham</span>
          </h1>
          <p className="text-white/90 drop-shadow-sm">aerospace engineer, game developer, and digital artist</p>
        </div>

        {/* Icon Grid */}
        <div className="grid grid-cols-3 gap-4 mb-12">
          {/* Row 1 */}
          <button
            onClick={() => handleIconClick("about")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <User className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">about</span>
          </button>

          <button
            onClick={() => handleIconClick("engineering")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">engineering</span>
          </button>

          <button
            onClick={() => handleIconClick("games")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Gamepad2 className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">games</span>
          </button>

          {/* Row 2 */}
          <button
            onClick={() => handleIconClick("art")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Palette className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">art</span>
          </button>

          <button
            onClick={() => handleIconClick("contact")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <Mail className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">contact</span>
          </button>

          <button
            onClick={() => handleIconClick("faq")}
            className="flex flex-col items-center p-4 bg-white/20 backdrop-blur-md rounded-2xl hover:bg-white/30 transition-all duration-200 border border-white/30 shadow-lg"
          >
            <div className="w-12 h-12 mb-3 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-lg border border-white/30">
              <HelpCircle className="w-8 h-8 text-white" />
            </div>
            <span className="text-sm font-medium text-white drop-shadow-sm">faq</span>
          </button>
        </div>
      </div>

      {/* Bottom Section - Fixed to bottom */}
      <div className="mt-auto bg-black/20 backdrop-blur-md border-t border-white/20 relative h-16 flex items-center justify-center">
        {/* Copyright */}
        <div className="text-xs text-white/80 drop-shadow-sm">© {new Date().getFullYear()} Shubham Ranabhat</div>
      </div>
    </div>
  )
}

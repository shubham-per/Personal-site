"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Settings,
  Monitor,
  Home,
  Palette,
  Share2,
  FileText,
  Plus,
  Save,
  Eye,
  EyeOff,
} from "lucide-react"

export default function SimpleAdmin() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  
  // Data states
  const [content, setContent] = useState({
    about: { title: "About Me", content: "Welcome to my portfolio!" },
    engineering: { title: "Engineering Projects", content: "Check out my engineering work!" },
    games: { title: "Game Development", content: "Explore my game projects!" },
    art: { title: "Digital Art", content: "Browse my creative work!" },
    contact: { title: "Get In Touch", content: "Feel free to reach out!" },
    faq: { title: "FAQ", content: "Common questions and answers!" }
  })

  const [desktopIcons, setDesktopIcons] = useState([
    { id: 1, name: "Engineering", icon: "Rocket", active: true },
    { id: 2, name: "Games", icon: "Gamepad2", active: true },
    { id: 3, name: "Art", icon: "Palette", active: true }
  ])

  const [homeIcons, setHomeIcons] = useState([
    { id: 1, name: "About", icon: "User", color: "blue-600", active: true },
    { id: 2, name: "Engineering", icon: "Rocket", color: "orange-600", active: true },
    { id: 3, name: "Games", icon: "Gamepad2", color: "green-600", active: true },
    { id: 4, name: "Art", icon: "Palette", color: "purple-600", active: true },
    { id: 5, name: "Contact", icon: "Mail", color: "cyan-600", active: true },
    { id: 6, name: "FAQ", icon: "HelpCircle", color: "yellow-600", active: true }
  ])

  const [wallpaper, setWallpaper] = useState({
    type: "gradient",
    colors: { from: "blue-400", via: "blue-500", to: "blue-600" }
  })

  const [socialIcons, setSocialIcons] = useState([
    { id: 1, platform: "YouTube", icon: "Youtube", url: "https://youtube.com", color: "red-500", active: true },
    { id: 2, platform: "Discord", icon: "MessageCircle", url: "https://discord.com", color: "indigo-500", active: true },
    { id: 3, platform: "LinkedIn", icon: "User", url: "https://linkedin.com", color: "blue-600", active: true }
  ])

  // Simple authentication
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (loginForm.email === "admin@shubham.dev" && loginForm.password === "admin123") {
      setIsAuthenticated(true)
    } else {
      alert("Invalid credentials! Use: admin@shubham.dev / admin123")
    }
  }

  const updateContent = (section: string, field: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [section]: { ...prev[section as keyof typeof prev], [field]: value }
    }))
  }

  const toggleDesktopIcon = (id: number) => {
    setDesktopIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, active: !icon.active } : icon
    ))
  }

  const toggleHomeIcon = (id: number) => {
    setHomeIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, active: !icon.active } : icon
    ))
  }

  const toggleSocialIcon = (id: number) => {
    setSocialIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, active: !icon.active } : icon
    ))
  }

  const updateHomeIconColor = (id: number, color: string) => {
    setHomeIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, color } : icon
    ))
  }

  const updateSocialIconUrl = (id: number, url: string) => {
    setSocialIcons(prev => prev.map(icon => 
      icon.id === id ? { ...icon, url } : icon
    ))
  }

  const updateWallpaper = (field: string, value: string) => {
    setWallpaper(prev => ({
      ...prev,
      colors: { ...prev.colors, [field]: value }
    }))
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-96">
          <CardHeader>
            <CardTitle className="text-center">Admin Login</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={loginForm.email}
                  onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                  placeholder="admin@shubham.dev"
                  required
                />
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={loginForm.password}
                  onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                  placeholder="admin123"
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
              <div className="text-center text-sm text-gray-600">
                <p>Default credentials:</p>
                <p>Email: admin@shubham.dev</p>
                <p>Password: admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Simple Backend Management</h1>
          <p className="text-gray-600">Manage your desktop interface easily</p>
        </div>

        <Tabs defaultValue="content" className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="desktop">Desktop Icons</TabsTrigger>
            <TabsTrigger value="home">Home Icons</TabsTrigger>
            <TabsTrigger value="wallpaper">Wallpaper</TabsTrigger>
            <TabsTrigger value="social">Social Icons</TabsTrigger>
          </TabsList>

          {/* Content Management */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(content).map(([section, data]) => (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5" />
                      {data.title}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label>Title</Label>
                      <Input
                        value={data.title}
                        onChange={(e) => updateContent(section, 'title', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Content</Label>
                      <Textarea
                        value={data.content}
                        onChange={(e) => updateContent(section, 'content', e.target.value)}
                        rows={4}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Desktop Icons Management */}
          <TabsContent value="desktop" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Monitor className="w-5 h-5" />
                  Desktop Icons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {desktopIcons.map((icon) => (
                    <div key={icon.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gray-200 rounded flex items-center justify-center">
                          <span className="text-lg">{icon.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-medium">{icon.name}</h3>
                        </div>
                      </div>
                      <Switch
                        checked={icon.active}
                        onCheckedChange={() => toggleDesktopIcon(icon.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Home Icons Management */}
          <TabsContent value="home" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Home className="w-5 h-5" />
                  Home Tab Icons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {homeIcons.map((icon) => (
                    <div key={icon.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <div className={`w-8 h-8 bg-${icon.color} rounded flex items-center justify-center`}>
                            <span className="text-white text-sm">{icon.icon}</span>
                          </div>
                          <div>
                            <h3 className="font-medium">{icon.name}</h3>
                          </div>
                        </div>
                        <Switch
                          checked={icon.active}
                          onCheckedChange={() => toggleHomeIcon(icon.id)}
                        />
                      </div>
                      <div>
                        <Label className="text-xs">Color</Label>
                        <Select
                          value={icon.color}
                          onValueChange={(value) => updateHomeIconColor(icon.id, value)}
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="blue-600">Blue</SelectItem>
                            <SelectItem value="red-600">Red</SelectItem>
                            <SelectItem value="green-600">Green</SelectItem>
                            <SelectItem value="yellow-600">Yellow</SelectItem>
                            <SelectItem value="purple-600">Purple</SelectItem>
                            <SelectItem value="cyan-600">Cyan</SelectItem>
                            <SelectItem value="orange-600">Orange</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Wallpaper Management */}
          <TabsContent value="wallpaper" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Wallpaper Settings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>Wallpaper Type</Label>
                    <Select value={wallpaper.type} onValueChange={(value) => setWallpaper(prev => ({ ...prev, type: value }))}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="gradient">Gradient</SelectItem>
                        <SelectItem value="image">Image</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  {wallpaper.type === "gradient" && (
                    <div className="grid grid-cols-3 gap-4">
                      <div>
                        <Label>From Color</Label>
                        <Input
                          value={wallpaper.colors.from}
                          onChange={(e) => updateWallpaper('from', e.target.value)}
                          placeholder="blue-400"
                        />
                      </div>
                      <div>
                        <Label>Via Color</Label>
                        <Input
                          value={wallpaper.colors.via}
                          onChange={(e) => updateWallpaper('via', e.target.value)}
                          placeholder="blue-500"
                        />
                      </div>
                      <div>
                        <Label>To Color</Label>
                        <Input
                          value={wallpaper.colors.to}
                          onChange={(e) => updateWallpaper('to', e.target.value)}
                          placeholder="blue-600"
                        />
                      </div>
                    </div>
                  )}
                  
                  <div className="p-4 bg-gray-100 rounded-lg">
                    <h4 className="font-medium mb-2">Preview:</h4>
                    <div 
                      className="w-full h-32 rounded"
                      style={{
                        background: wallpaper.type === "gradient" 
                          ? `linear-gradient(to bottom, var(--${wallpaper.colors.from}), var(--${wallpaper.colors.via}), var(--${wallpaper.colors.to}))`
                          : `url(${wallpaper.colors.from})`
                      }}
                    ></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Social Icons Management */}
          <TabsContent value="social" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Share2 className="w-5 h-5" />
                  Social Media Icons
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {socialIcons.map((icon) => (
                    <div key={icon.id} className="flex items-center justify-between p-4 border rounded-lg">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 bg-${icon.color} rounded flex items-center justify-center`}>
                          <span className="text-white text-lg">{icon.icon}</span>
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium">{icon.platform}</h3>
                          <Input
                            value={icon.url}
                            onChange={(e) => updateSocialIconUrl(icon.id, e.target.value)}
                            className="mt-1"
                            placeholder="https://..."
                          />
                        </div>
                      </div>
                      <Switch
                        checked={icon.active}
                        onCheckedChange={() => toggleSocialIcon(icon.id)}
                      />
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-medium text-blue-900 mb-2">How to Use:</h3>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• <strong>Content:</strong> Edit the text for About, Engineering, Games, Art, Contact, and FAQ sections</li>
            <li>• <strong>Desktop Icons:</strong> Toggle which icons appear on your desktop</li>
            <li>• <strong>Home Icons:</strong> Control which icons appear in the home tab and their colors</li>
            <li>• <strong>Wallpaper:</strong> Change your desktop background (gradient colors or image)</li>
            <li>• <strong>Social Icons:</strong> Manage your social media links and visibility</li>
          </ul>
        </div>
      </div>
    </div>
  )
}



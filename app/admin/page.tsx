"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from "recharts"
import {
  Settings,
  FileText,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  LogOut,
  Eye,
  Users,
  MousePointer,
  Wrench,
  Gamepad2,
  Palette,
   User,
   Mail,
   HelpCircle,
   FolderOpen,
} from "lucide-react"

interface Project {
  id: number
  title: string
  description: string
  category: "engineering" | "games" | "art"
  image_url?: string
  photos: string[]
  keywords: string[]
  projectLink?: string
  tags: string[]
  order_index: number
  is_active: boolean
  customTabKey?: string // For custom tab projects
}

interface Content {
  id: number
  section: string
  title: string
  content: string
}

interface Analytics {
  pageViews: { page: string; views: number }[]
  dailyVisits: { date: string; unique_visitors: number; total_views: number }[]
  topReferrers: { referrer: string; visits: number }[]
}

interface FaqItem {
  id: number
  question: string
  answer: string
  order: number
  isActive: boolean
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
  layout?: "content" | "projects" | "faq"
}

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loginForm, setLoginForm] = useState({ email: "", password: "" })
  const [projects, setProjects] = useState<Project[]>([])
  const [content, setContent] = useState<Record<string, Content>>({})
  const [analytics, setAnalytics] = useState<Analytics | null>(null)
  const [faqItems, setFaqItems] = useState<FaqItem[]>([])
  const [background, setBackground] = useState<BackgroundConfig | null>(null)
  const [windows, setWindows] = useState<WindowConfig[]>([])
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [editingFaq, setEditingFaq] = useState<FaqItem | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isFaqDialogOpen, setIsFaqDialogOpen] = useState(false)

  useEffect(() => {
    checkAuth()
  }, [])

  useEffect(() => {
    if (isAuthenticated) {
      loadData()
    }
  }, [isAuthenticated])

  const checkAuth = async () => {
    try {
      const response = await fetch("/api/auth/check")
      setIsAuthenticated(response.ok)
    } catch {
      setIsAuthenticated(false)
    }
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(loginForm),
      })

      if (response.ok) {
        setIsAuthenticated(true)
        setLoginForm({ email: "", password: "" })
      } else {
        alert("Invalid credentials")
      }
    } catch (error) {
      alert("Login failed")
    }
  }

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" })
    setIsAuthenticated(false)
  }

  const loadData = async () => {
    try {
      // Load projects
      const projectsRes = await fetch("/api/projects")
      const rawProjects = await projectsRes.json()
      const projectsData: Project[] = rawProjects.map((p: any) => ({
        ...p,
        photos: Array.isArray(p.photos) ? p.photos : [],
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
      }))
      setProjects(projectsData)

      // Load content
      const sections = ["about", "contact", "faq"]
      const contentData: Record<string, Content> = {}

      for (const section of sections) {
        const res = await fetch(`/api/content?section=${section}`)
        const data = await res.json()
        if (data) contentData[section] = data
      }
      setContent(contentData)

      // Load analytics
      const analyticsRes = await fetch("/api/analytics")
      const analyticsData = await analyticsRes.json()
      setAnalytics(analyticsData)

      // Load FAQ items
      const faqRes = await fetch("/api/faq")
      if (faqRes.ok) {
        const faqData = await faqRes.json()
        setFaqItems(faqData)
      }

      // Load background config
      const bgRes = await fetch("/api/background")
      if (bgRes.ok) {
        const bgData = await bgRes.json()
        setBackground(bgData)
      }

      // Load window config
      const winRes = await fetch("/api/windows")
      if (winRes.ok) {
        const winData = await winRes.json()
        setWindows(winData)
      }
    } catch (error) {
      console.error("Failed to load data:", error)
    }
  }

  const handleSaveProject = async (payload: { project: Omit<Project, "id"> & { id?: number }; mainImageFile?: File | null }) => {
    const { project, mainImageFile } = payload
    try {
      const method = project.id ? "PUT" : "POST"
      let response: Response

      if (mainImageFile) {
        const formData = new FormData()
        Object.entries(project).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          const finalKey = key === "image_url" ? "imageUrl" : key
          if (Array.isArray(value)) {
            formData.append(finalKey, JSON.stringify(value))
          } else {
            formData.append(finalKey, String(value))
          }
        })
        formData.append("image", mainImageFile)

        response = await fetch("/api/projects", {
          method,
          body: formData,
        })
      } else {
        // Map image_url -> imageUrl for JSON payload
        const payloadJson: any = { ...project }
        if ("image_url" in payloadJson) {
          payloadJson.imageUrl = payloadJson.image_url
          delete payloadJson.image_url
        }
        response = await fetch("/api/projects", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadJson),
        })
      }

      if (response.ok) {
        loadData()
        setIsProjectDialogOpen(false)
        setEditingProject(null)
      }
    } catch (error) {
      alert("Failed to save project")
    }
  }

  const handleDeleteProject = async (id: number) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      const response = await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      alert("Failed to delete project")
    }
  }

  const handleSaveContent = async (content: Content) => {
    try {
      const response = await fetch("/api/content", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(content),
      })

      if (response.ok) {
        loadData()
        setIsContentDialogOpen(false)
        setEditingContent(null)
      }
    } catch (error) {
      alert("Failed to save content")
    }
  }

  const handleSaveFaq = async (item: FaqItem | Omit<FaqItem, "id"> & { id?: number }) => {
    try {
      const method = item.id ? "PUT" : "POST"
      const response = await fetch("/api/faq", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(item),
      })

      if (response.ok) {
        loadData()
        setIsFaqDialogOpen(false)
        setEditingFaq(null)
      }
    } catch (error) {
      alert("Failed to save FAQ item")
    }
  }

  const handleDeleteFaq = async (id: number) => {
    if (!confirm("Are you sure you want to delete this FAQ item?")) return

    try {
      const response = await fetch(`/api/faq?id=${id}`, { method: "DELETE" })
      if (response.ok) {
        loadData()
      }
    } catch (error) {
      alert("Failed to delete FAQ item")
    }
  }

  const getProjectsByCategory = (category: "engineering" | "games" | "art") => {
    return projects.filter(project => project.category === category && !project.customTabKey)
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <Card className="w-full max-w-md">
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
                  required
                />
              </div>
              <Button type="submit" className="w-full">
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel</h1>
            <Button onClick={handleLogout} variant="outline">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-11">
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="about">
              <User className="w-4 h-4 mr-2" />
              About
            </TabsTrigger>
            <TabsTrigger value="engineering">
              <Wrench className="w-4 h-4 mr-2" />
              Engineering
            </TabsTrigger>
            <TabsTrigger value="games">
              <Gamepad2 className="w-4 h-4 mr-2" />
              Games
            </TabsTrigger>
            <TabsTrigger value="art">
              <Palette className="w-4 h-4 mr-2" />
              Art
            </TabsTrigger>
            <TabsTrigger value="contact">
              <Mail className="w-4 h-4 mr-2" />
              Contact
            </TabsTrigger>
            <TabsTrigger value="faq">
              <HelpCircle className="w-4 h-4 mr-2" />
              FAQ
            </TabsTrigger>
            <TabsTrigger value="background">
              <Palette className="w-4 h-4 mr-2" />
              Background
            </TabsTrigger>
            <TabsTrigger value="windows">
              <FileText className="w-4 h-4 mr-2" />
              Windows
            </TabsTrigger>
            <TabsTrigger value="custom-panels">
              <FolderOpen className="w-4 h-4 mr-2" />
              Custom Panels
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
            {analytics && (
              <>
                {/* Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Total Page Views</CardTitle>
                      <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analytics.pageViews.reduce((sum, item) => sum + item.views, 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
                      <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">
                        {analytics.dailyVisits.reduce((sum, item) => sum + item.unique_visitors, 0)}
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <CardTitle className="text-sm font-medium">Top Page</CardTitle>
                      <MousePointer className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                      <div className="text-2xl font-bold">{analytics.pageViews[0]?.page || "N/A"}</div>
                    </CardContent>
                  </Card>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Page Views</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={analytics.pageViews}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="page" />
                          <YAxis />
                          <Tooltip />
                          <Bar dataKey="views" fill="#3b82f6" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Daily Visitors</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={analytics.dailyVisits}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" />
                          <YAxis />
                          <Tooltip />
                          <Line type="monotone" dataKey="unique_visitors" stroke="#3b82f6" />
                        </LineChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                </div>
              </>
            )}
          </TabsContent>

          {/* About Tab */}
          <TabsContent value="about" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>About Section</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Edit the main about text shown in the desktop “about” window on your homepage.
                </p>
                {content.about && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {content.about.content.substring(0, 200)}...
                  </p>
                )}
                <Button
                  onClick={() => {
                    if (!content.about) return
                    setEditingContent(content.about)
                    setIsContentDialogOpen(true)
                  }}
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit About
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Engineering Tab */}
          <TabsContent value="engineering" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Engineering Projects</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: 0,
                    title: "",
                    description: "",
                    category: "engineering",
                    photos: [],
                    keywords: [],
                    projectLink: "",
                    tags: [],
                    order_index: 0,
                    is_active: true,
                  } as Project)
                  setIsProjectDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Engineering Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProjectsByCategory("engineering").map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          Engineering
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingProject(project)
                          setIsProjectDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Games Tab */}
          <TabsContent value="games" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Game Projects</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: 0,
                    title: "",
                    description: "",
                    category: "games",
                    photos: [],
                    keywords: [],
                    projectLink: "",
                    tags: [],
                    order_index: 0,
                    is_active: true,
                  } as Project)
                  setIsProjectDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Game Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProjectsByCategory("games").map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          Games
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingProject(project)
                          setIsProjectDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Art Tab */}
          <TabsContent value="art" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Art Projects</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: 0,
                    title: "",
                    description: "",
                    category: "art",
                    photos: [],
                    keywords: [],
                    projectLink: "",
                    tags: [],
                    order_index: 0,
                    is_active: true,
                  } as Project)
                  setIsProjectDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Art Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getProjectsByCategory("art").map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          Art
                        </Badge>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-1 mb-4">
                      {project.tags.map((tag, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => {
                          setEditingProject(project)
                          setIsProjectDialogOpen(true)
                        }}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="destructive" onClick={() => handleDeleteProject(project.id)}>
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Contact Tab */}
          <TabsContent value="contact" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Contact Section</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Edit the contact text shown in the desktop “contact” window on your homepage.
                </p>
                {content.contact && (
                  <p className="text-sm text-gray-700 mb-4 line-clamp-3">
                    {content.contact.content.substring(0, 200)}...
                  </p>
                )}
                <Button
                  onClick={() => {
                    if (!content.contact) return
                    setEditingContent(content.contact)
                    setIsContentDialogOpen(true)
                  }}
                  size="sm"
                >
                  <Edit className="w-4 h-4 mr-2" />
                  Edit Contact
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* FAQ Tab */}
          <TabsContent value="faq" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">FAQ Items</h2>
              <Button
                onClick={() => {
                  setEditingFaq({
                    id: 0,
                    question: "",
                    answer: "",
                    order: faqItems.length + 1,
                    isActive: true,
                  })
                  setIsFaqDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ Item
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {faqItems.filter((item) => !item.customTabKey).map((item) => (
                <Card key={item.id}>
                  <CardHeader>
                    <CardTitle className="text-lg">{item.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.answer}</p>
                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500">Order: {item.order}</span>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingFaq(item)
                            setIsFaqDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteFaq(item.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Site Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label>Site Title</Label>
                    <Input defaultValue="Shubham's Portfolio" />
                  </div>
                  <div>
                    <Label>Site Description</Label>
                    <Textarea defaultValue="Aerospace engineer, game developer, and digital artist" rows={2} />
                  </div>
                  <div>
                    <Label>Contact Email</Label>
                    <Input type="email" defaultValue="contact@shubham.dev" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Analytics Settings</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="tracking" defaultChecked />
                    <Label htmlFor="tracking">Enable visitor tracking</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <input type="checkbox" id="referrers" defaultChecked />
                    <Label htmlFor="referrers">Track referrer sources</Label>
                  </div>
                  <div>
                    <Label>Data retention (days)</Label>
                    <Input type="number" defaultValue="30" min="1" max="365" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button variant="outline" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Export Analytics Data
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <BarChart3 className="w-4 h-4 mr-2" />
                    Generate Analytics Report
                  </Button>
                  <Button variant="outline" className="w-full justify-start">
                    <Settings className="w-4 h-4 mr-2" />
                    Backup Database
                  </Button>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Database Connection</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Connected</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Analytics Tracking</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Last Backup</span>
                    <span className="text-sm text-gray-600">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Projects</span>
                    <span className="text-sm font-medium">{projects.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Background Tab */}
          <TabsContent value="background" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Homepage Background</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <p className="text-sm text-gray-600">
                  Choose how the desktop background looks on your homepage: solid color, gradient, or custom image.
                </p>

                <BackgroundForm
                  initialConfig={background}
                  onSaved={(cfg) => setBackground(cfg)}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Windows Tab */}
          <TabsContent value="windows" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Windows & Tabs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Control which windows appear on the desktop and inside the home window. You can also add custom tabs
                  with their own content.
                </p>
                <WindowsManager windows={windows} onChange={setWindows} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Custom Panels Tab */}
          <TabsContent value="custom-panels" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Custom Panels</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Manage content and settings for each custom tab. Panels are automatically created when you add a custom tab in Windows & Tabs.
                </p>
                {windows.filter((w) => w.type === "custom").length === 0 ? (
                  <p className="text-sm text-gray-500">No custom tabs yet. Add one in the Windows & Tabs section.</p>
                ) : (
                  <div className="space-y-4">
                    {windows
                      .filter((w) => w.type === "custom")
                      .map((window) => (
                        <CustomPanelEditor key={window.id} window={window} onUpdate={loadData} />
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Project Dialog */}
      <Dialog open={isProjectDialogOpen} onOpenChange={setIsProjectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProject?.id ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          {editingProject && (
            <ProjectForm
              project={editingProject}
              onSave={handleSaveProject}
              onCancel={() => setIsProjectDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Content Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Content</DialogTitle>
          </DialogHeader>
          {editingContent && (
            <ContentForm
              content={editingContent}
              onSave={handleSaveContent}
              onCancel={() => setIsContentDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* FAQ Dialog */}
      <Dialog open={isFaqDialogOpen} onOpenChange={setIsFaqDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingFaq?.id ? "Edit FAQ Item" : "Add FAQ Item"}</DialogTitle>
          </DialogHeader>
          {editingFaq && (
            <FaqForm
              item={editingFaq}
              onSave={handleSaveFaq}
              onCancel={() => setIsFaqDialogOpen(false)}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}

// Project Form Component
function ProjectForm({
  project,
  onSave,
  onCancel,
}: {
  project: Project
  onSave: (payload: { project: Project; mainImageFile?: File | null }) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(project)
  const [tagInput, setTagInput] = useState("")
  const [keywordInput, setKeywordInput] = useState("")
  const [photoInput, setPhotoInput] = useState("")
  const [mainImageFile, setMainImageFile] = useState<File | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave({ project: formData, mainImageFile })
  }

  const addTag = () => {
    if (tagInput.trim() && !formData.tags.includes(tagInput.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, tagInput.trim()],
      })
      setTagInput("")
    }
  }

  const removeTag = (tagToRemove: string) => {
    setFormData({
      ...formData,
      tags: formData.tags.filter((tag) => tag !== tagToRemove),
    })
  }

  const addKeyword = () => {
    if (keywordInput.trim() && !formData.keywords.includes(keywordInput.trim())) {
      setFormData({
        ...formData,
        keywords: [...formData.keywords, keywordInput.trim()],
      })
      setKeywordInput("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    setFormData({
      ...formData,
      keywords: formData.keywords.filter((keyword) => keyword !== keywordToRemove),
    })
  }

  const addPhoto = () => {
    if (photoInput.trim() && !formData.photos.includes(photoInput.trim())) {
      setFormData({
        ...formData,
        photos: [...formData.photos, photoInput.trim()],
      })
      setPhotoInput("")
    }
  }

  const removePhoto = (photoToRemove: string) => {
    setFormData({
      ...formData,
      photos: formData.photos.filter((photo) => photo !== photoToRemove),
    })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          value={formData.description}
          onChange={(e) => setFormData({ ...formData, description: e.target.value })}
          rows={4}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select value={formData.category} onValueChange={(value: "engineering" | "games" | "art") => setFormData({ ...formData, category: value })}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="engineering">Engineering</SelectItem>
            <SelectItem value="games">Games</SelectItem>
            <SelectItem value="art">Art</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div>
        <Label htmlFor="image_url">Main Image URL (optional)</Label>
        <Input
          id="image_url"
          type="url"
          value={formData.image_url || ""}
          onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
          placeholder="https://example.com/image.jpg"
        />
        <div className="mt-2">
          <Label htmlFor="main_image_file" className="text-xs text-gray-600">
            Or upload an image
          </Label>
          <Input
            id="main_image_file"
            type="file"
            accept="image/*"
            onChange={(e) => setMainImageFile(e.target.files?.[0] || null)}
            className="mt-1"
          />
        </div>
      </div>

      <div>
        <Label htmlFor="projectLink">Project Link (optional)</Label>
        <Input
          id="projectLink"
          type="url"
          value={formData.projectLink || ""}
          onChange={(e) => setFormData({ ...formData, projectLink: e.target.value })}
          placeholder="https://github.com/username/project or https://example.com"
        />
      </div>

      <div>
        <Label>Additional Photos</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={photoInput}
            onChange={(e) => setPhotoInput(e.target.value)}
            placeholder="Add photo URL"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addPhoto())}
          />
          <Button type="button" onClick={addPhoto} size="sm">
            Add
          </Button>
        </div>
        <div className="space-y-2">
          {formData.photos.map((photo, index) => (
            <div key={index} className="flex items-center gap-2 p-2 border rounded">
              <img src={photo} alt={`Photo ${index + 1}`} className="w-12 h-12 object-cover rounded" />
              <span className="flex-1 text-sm truncate">{photo}</span>
              <button
                type="button"
                onClick={() => removePhoto(photo)}
                className="text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Keywords (for SEO)</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={keywordInput}
            onChange={(e) => setKeywordInput(e.target.value)}
            placeholder="Add a keyword"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addKeyword())}
          />
          <Button type="button" onClick={addKeyword} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.keywords.map((keyword, index) => (
            <Badge key={index} variant="secondary" className="text-xs">
              {keyword}
              <button
                type="button"
                onClick={() => removeKeyword(keyword)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="order_index">Display Order</Label>
        <Input
          id="order_index"
          type="number"
          value={formData.order_index}
          onChange={(e) => setFormData({ ...formData, order_index: parseInt(e.target.value) || 0 })}
        />
      </div>

      <div>
        <Label>Tags</Label>
        <div className="flex gap-2 mb-2">
          <Input
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            placeholder="Add a tag"
            onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
          />
          <Button type="button" onClick={addTag} size="sm">
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-1">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(tag)}
                className="ml-1 text-red-500 hover:text-red-700"
              >
                ×
              </button>
            </Badge>
          ))}
        </div>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  )
}

// Content Form Component
function ContentForm({
  content,
  onSave,
  onCancel,
}: {
  content: Content
  onSave: (content: Content) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(content)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="title">Title</Label>
        <Input
          id="title"
          value={formData.title}
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="content">Content</Label>
        <Textarea
          id="content"
          value={formData.content}
          onChange={(e) => setFormData({ ...formData, content: e.target.value })}
          rows={8}
          required
        />
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          <Save className="w-4 h-4 mr-2" />
          Save
        </Button>
      </div>
    </form>
  )
}

// FAQ Form Component
function FaqForm({
  item,
  onSave,
  onCancel,
}: {
  item: FaqItem
  onSave: (item: FaqItem) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(item)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <Label htmlFor="question">Question</Label>
        <Input
          id="question"
          value={formData.question}
          onChange={(e) => setFormData({ ...formData, question: e.target.value })}
          required
        />
      </div>

      <div>
        <Label htmlFor="answer">Answer</Label>
        <Textarea
          id="answer"
          value={formData.answer}
          onChange={(e) => setFormData({ ...formData, answer: e.target.value })}
          rows={6}
          required
        />
      </div>

      <div>
        <Label htmlFor="order">Display Order</Label>
        <Input
          id="order"
          type="number"
          value={formData.order}
          onChange={(e) =>
            setFormData({ ...formData, order: Number.isNaN(parseInt(e.target.value)) ? 0 : parseInt(e.target.value) })
          }
        />
      </div>

      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <input
            id="isActive"
            type="checkbox"
            checked={formData.isActive}
            onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
          />
          <Label htmlFor="isActive">Visible on site</Label>
        </div>

        <div className="flex gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
          <Button type="submit">
            <Save className="w-4 h-4 mr-2" />
            Save
          </Button>
        </div>
      </div>
    </form>
  )
}

// Background Form Component
function BackgroundForm({
  initialConfig,
  onSaved,
}: {
  initialConfig: BackgroundConfig | null
  onSaved: (config: BackgroundConfig) => void
}) {
  const [type, setType] = useState<BackgroundConfig["type"]>(initialConfig?.type || "gradient")
  const [solidColor, setSolidColor] = useState(
    initialConfig && initialConfig.type === "solid" ? initialConfig.color : "#2563eb",
  )
  const [from, setFrom] = useState(
    initialConfig && initialConfig.type === "gradient" ? initialConfig.from : "#60a5fa",
  )
  const [via, setVia] = useState(
    initialConfig && initialConfig.type === "gradient" ? initialConfig.via || "#3b82f6" : "#3b82f6",
  )
  const [to, setTo] = useState(initialConfig && initialConfig.type === "gradient" ? initialConfig.to : "#2563eb")
  const [overlay, setOverlay] = useState(
    initialConfig && initialConfig.type === "image" ? initialConfig.overlay ?? true : true,
  )
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [saving, setSaving] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      let config: BackgroundConfig
      let body: BodyInit
      let headers: HeadersInit | undefined

      if (type === "image") {
        const formData = new FormData()
        formData.append("type", "image")
        if (imageFile) {
          formData.append("image", imageFile)
        }
        formData.append("overlay", overlay ? "true" : "false")
        body = formData
        headers = undefined
      } else if (type === "solid") {
        config = { type: "solid", color: solidColor }
        body = JSON.stringify(config)
        headers = { "Content-Type": "application/json" }
      } else {
        config = { type: "gradient", from, via, to }
        body = JSON.stringify(config)
        headers = { "Content-Type": "application/json" }
      }

      const res = await fetch("/api/background", {
        method: "POST",
        body,
        headers,
      })

      if (!res.ok) {
        alert("Failed to save background")
        return
      }

      const saved = (await res.json()) as BackgroundConfig
      onSaved(saved)
    } finally {
      setSaving(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Background Type</Label>
        <div className="flex gap-4 mt-2">
          <button
            type="button"
            onClick={() => setType("solid")}
            className={`px-3 py-1 text-sm rounded border ${
              type === "solid" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"
            }`}
          >
            Solid
          </button>
          <button
            type="button"
            onClick={() => setType("gradient")}
            className={`px-3 py-1 text-sm rounded border ${
              type === "gradient" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"
            }`}
          >
            Gradient
          </button>
          <button
            type="button"
            onClick={() => setType("image")}
            className={`px-3 py-1 text-sm rounded border ${
              type === "image" ? "bg-blue-600 text-white border-blue-600" : "bg-white text-gray-700"
            }`}
          >
            Image
          </button>
        </div>
      </div>

      {type === "solid" && (
        <div className="space-y-2">
          <Label>Color</Label>
          <div className="flex items-center gap-3">
            <Input
              type="color"
              value={solidColor}
              onChange={(e) => setSolidColor(e.target.value)}
              className="w-16 p-1"
            />
            <Input value={solidColor} onChange={(e) => setSolidColor(e.target.value)} className="flex-1" />
          </div>
        </div>
      )}

      {type === "gradient" && (
        <div className="space-y-4">
          <div>
            <Label>From</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="color" value={from} onChange={(e) => setFrom(e.target.value)} className="w-16 p-1" />
              <Input value={from} onChange={(e) => setFrom(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <Label>Via (optional)</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="color" value={via} onChange={(e) => setVia(e.target.value)} className="w-16 p-1" />
              <Input value={via} onChange={(e) => setVia(e.target.value)} className="flex-1" />
            </div>
          </div>
          <div>
            <Label>To</Label>
            <div className="flex items-center gap-3 mt-1">
              <Input type="color" value={to} onChange={(e) => setTo(e.target.value)} className="w-16 p-1" />
              <Input value={to} onChange={(e) => setTo(e.target.value)} className="flex-1" />
            </div>
          </div>
        </div>
      )}

      {type === "image" && (
        <div className="space-y-3">
          <div>
            <Label>Upload Image</Label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => setImageFile(e.target.files?.[0] || null)}
              className="mt-1"
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              id="overlay"
              type="checkbox"
              checked={overlay}
              onChange={(e) => setOverlay(e.target.checked)}
            />
            <Label htmlFor="overlay">Add subtle overlay for readability</Label>
          </div>
        </div>
      )}

      <div className="flex justify-end">
        <Button type="submit" disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Background"}
        </Button>
      </div>
    </form>
  )
}

// Windows Manager Component
function WindowsManager({
  windows,
  onChange,
}: {
  windows: WindowConfig[]
  onChange: (windows: WindowConfig[]) => void
}) {
  const [savingId, setSavingId] = useState<number | null>(null)
  const [creating, setCreating] = useState(false)
  const [iconFiles, setIconFiles] = useState<Record<number, File>>({})
  const [iconPreviews, setIconPreviews] = useState<Record<number, string>>({})
  const builtIn = windows.filter((w) => w.type === "builtIn")
  const custom = windows.filter((w) => w.type === "custom")

  const updateWindowLocal = (id: number, patch: Partial<WindowConfig>) => {
    onChange(
      windows.map((w) =>
        w.id === id
          ? {
              ...w,
              ...patch,
            }
          : w,
      ),
    )
  }

  const saveWindow = async (window: WindowConfig) => {
    setSavingId(window.id)
    try {
      const iconFile = iconFiles[window.id]
      if (iconFile) {
        const formData = new FormData()
        formData.append("id", String(window.id))
        formData.append("key", window.key)
        formData.append("label", window.label)
        formData.append("content", window.content || "")
        formData.append("layout", window.layout || "content")
        formData.append("icon", window.icon || "folder")
        formData.append("showOnDesktop", String(window.showOnDesktop))
        formData.append("showInHome", String(window.showInHome))
        formData.append("orderDesktop", String(window.orderDesktop))
        formData.append("orderHome", String(window.orderHome))
        formData.append("isHidden", String(window.isHidden))
        formData.append("icon", iconFile)

        const res = await fetch("/api/windows", {
          method: "PUT",
          body: formData,
        })
        if (!res.ok) {
          alert("Failed to save window")
          return
        }
        const updated = (await res.json()) as WindowConfig
        onChange(windows.map((w) => (w.id === updated.id ? updated : w)))
        // Clear icon file after successful save
        const newIconFiles = { ...iconFiles }
        delete newIconFiles[window.id]
        setIconFiles(newIconFiles)
        const newIconPreviews = { ...iconPreviews }
        delete newIconPreviews[window.id]
        setIconPreviews(newIconPreviews)
      } else {
        const res = await fetch("/api/windows", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(window),
        })
        if (!res.ok) {
          alert("Failed to save window")
          return
        }
        const updated = (await res.json()) as WindowConfig
        onChange(windows.map((w) => (w.id === updated.id ? updated : w)))
      }
    } finally {
      setSavingId(null)
    }
  }

  const deleteWindow = async (id: number) => {
    if (!confirm("Delete this custom window?")) return
    setSavingId(id)
    try {
      const res = await fetch(`/api/windows?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        alert("Failed to delete window")
        return
      }
      onChange(windows.filter((w) => w.id !== id))
    } finally {
      setSavingId(null)
    }
  }

  const createWindow = async () => {
    setCreating(true)
    try {
      const res = await fetch("/api/windows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          key: "",
          label: "New tab",
          showOnDesktop: false,
          showInHome: true,
          content: "",
        }),
      })
      if (!res.ok) {
        alert("Failed to create window")
        return
      }
      const created = (await res.json()) as WindowConfig
      onChange([...windows, created])
    } finally {
      setCreating(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="font-semibold text-lg">Built-in Windows</h3>
      </div>
      <div className="space-y-3">
        {builtIn.map((w) => (
          <div
            key={w.id}
            className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 p-3 border rounded bg-white"
          >
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="font-medium capitalize">{w.label}</span>
                <span className="text-xs text-gray-500">({w.key})</span>
              </div>
              <div className="flex flex-wrap gap-3 text-xs text-gray-600">
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={w.showOnDesktop}
                    onChange={(e) => updateWindowLocal(w.id, { showOnDesktop: e.target.checked })}
                  />
                  Show on desktop
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={w.showInHome}
                    onChange={(e) => updateWindowLocal(w.id, { showInHome: e.target.checked })}
                  />
                  Show in home grid
                </label>
                <label className="flex items-center gap-1">
                  <input
                    type="checkbox"
                    checked={w.isHidden}
                    onChange={(e) => updateWindowLocal(w.id, { isHidden: e.target.checked })}
                  />
                  Hidden
                </label>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <div>
                <Label className="text-xs">Desktop order</Label>
                <Input
                  type="number"
                  value={w.orderDesktop}
                  onChange={(e) => updateWindowLocal(w.id, { orderDesktop: parseInt(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs"
                />
              </div>
              <div>
                <Label className="text-xs">Home order</Label>
                <Input
                  type="number"
                  value={w.orderHome}
                  onChange={(e) => updateWindowLocal(w.id, { orderHome: parseInt(e.target.value) || 0 })}
                  className="w-20 h-8 text-xs"
                />
              </div>
              <Button size="sm" onClick={() => saveWindow(w)} disabled={savingId === w.id}>
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-6">
        <h3 className="font-semibold text-lg">Custom Windows</h3>
        <Button size="sm" onClick={createWindow} disabled={creating}>
          <Plus className="w-4 h-4 mr-1" />
          Add Custom Window
        </Button>
      </div>

      <div className="space-y-3">
        {custom.length === 0 && <p className="text-sm text-gray-500">No custom windows yet.</p>}
        {custom.map((w) => (
          <div key={w.id} className="p-3 border rounded bg-white space-y-3">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
              <div className="space-y-1 flex-1">
                <div className="flex gap-3">
                  <div className="flex-1">
                    <Label className="text-xs">Label</Label>
                    <Input
                      value={w.label}
                      onChange={(e) => updateWindowLocal(w.id, { label: e.target.value })}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label className="text-xs">Key</Label>
                    <Input
                      value={w.key}
                      onChange={(e) => updateWindowLocal(w.id, { key: e.target.value })}
                      className="h-8 text-sm w-32"
                    />
                  </div>
                </div>
                <div className="flex flex-wrap gap-3 text-xs text-gray-600 mt-1">
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={w.showOnDesktop}
                      onChange={(e) => updateWindowLocal(w.id, { showOnDesktop: e.target.checked })}
                    />
                    Show on desktop
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={w.showInHome}
                      onChange={(e) => updateWindowLocal(w.id, { showInHome: e.target.checked })}
                    />
                    Show in home grid
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="checkbox"
                      checked={w.isHidden}
                      onChange={(e) => updateWindowLocal(w.id, { isHidden: e.target.checked })}
                    />
                    Hidden
                  </label>
                </div>
              </div>
              <div className="flex items-center gap-3 text-xs">
                <div>
                  <Label className="text-xs">Desktop order</Label>
                  <Input
                    type="number"
                    value={w.orderDesktop}
                    onChange={(e) => updateWindowLocal(w.id, { orderDesktop: parseInt(e.target.value) || 0 })}
                    className="w-20 h-8 text-xs"
                  />
                </div>
                <div>
                  <Label className="text-xs">Home order</Label>
                  <Input
                    type="number"
                    value={w.orderHome}
                    onChange={(e) => updateWindowLocal(w.id, { orderHome: parseInt(e.target.value) || 0 })}
                    className="w-20 h-8 text-xs"
                  />
                </div>
              </div>
            </div>

            <div>
              <Label className="text-xs">Window content</Label>
              <Textarea
                value={w.content || ""}
                onChange={(e) => updateWindowLocal(w.id, { content: e.target.value })}
                rows={3}
                className="text-sm mt-1"
              />
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2">
              <div className="flex items-center gap-2 text-xs">
                <Label className="text-xs">Layout</Label>
                <select
                  value={w.layout || "content"}
                  onChange={(e) =>
                    updateWindowLocal(w.id, {
                      layout: e.target.value as WindowConfig["layout"],
                    })
                  }
                  className="border rounded h-8 text-xs px-1"
                >
                  <option value="content">Simple content (like About)</option>
                  <option value="projects">Projects-style</option>
                  <option value="faq">FAQ-style</option>
                </select>
                <Label className="text-xs ml-4">Icon</Label>
                <select
                  value={w.icon || "folder"}
                  onChange={(e) => updateWindowLocal(w.id, { icon: e.target.value })}
                  className="border rounded h-8 text-xs px-1"
                >
                  <option value="user">User</option>
                  <option value="rocket">Rocket</option>
                  <option value="gamepad2">Gamepad</option>
                  <option value="palette">Palette</option>
                  <option value="mail">Mail</option>
                  <option value="help-circle">Help</option>
                  <option value="folder">Folder</option>
                </select>
              </div>
              <div className="flex flex-col gap-1">
                <Label className="text-xs">Custom Icon Upload</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null
                    if (file) {
                      setIconFiles({ ...iconFiles, [w.id]: file })
                      const reader = new FileReader()
                      reader.onloadend = () => {
                        setIconPreviews({ ...iconPreviews, [w.id]: reader.result as string })
                      }
                      reader.readAsDataURL(file)
                    }
                  }}
                  className="h-8 text-xs"
                />
                {(iconPreviews[w.id] || w.customIconUrl) && (
                  <img
                    src={iconPreviews[w.id] || w.customIconUrl || ""}
                    alt="Icon preview"
                    className="w-12 h-12 object-contain border rounded mt-1"
                  />
                )}
              </div>
              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => deleteWindow(w.id)} disabled={savingId === w.id}>
                <Trash2 className="w-3 h-3 mr-1" />
                Delete
              </Button>
              <Button size="sm" onClick={() => saveWindow(w)} disabled={savingId === w.id}>
                <Save className="w-3 h-3 mr-1" />
                Save
              </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

// Custom Panel Editor Component
function CustomPanelEditor({
  window,
  onUpdate,
}: {
  window: WindowConfig
  onUpdate: () => void
}) {
  const [formData, setFormData] = useState(window)
  const [iconFile, setIconFile] = useState<File | null>(null)
  const [iconPreview, setIconPreview] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [customProjects, setCustomProjects] = useState<Project[]>([])
  const [editingCustomProject, setEditingCustomProject] = useState<Project | null>(null)
  const [isCustomProjectDialogOpen, setIsCustomProjectDialogOpen] = useState(false)
  const [customFaqItems, setCustomFaqItems] = useState<FaqItem[]>([])
  const [editingCustomFaq, setEditingCustomFaq] = useState<FaqItem | null>(null)
  const [isCustomFaqDialogOpen, setIsCustomFaqDialogOpen] = useState(false)

  useEffect(() => {
    setFormData(window)
    // Load custom projects for this tab if layout is projects
    if (window.layout === "projects") {
      loadCustomProjects()
    }
    // Load custom FAQ items for this tab if layout is faq
    if (window.layout === "faq") {
      loadCustomFaqItems()
    }
  }, [window])

  const loadCustomProjects = async () => {
    try {
      const res = await fetch("/api/projects")
      const rawProjects = await res.json()
      const allProjects: Project[] = rawProjects.map((p: any) => ({
        ...p,
        photos: Array.isArray(p.photos) ? p.photos : [],
        keywords: Array.isArray(p.keywords) ? p.keywords : [],
        tags: Array.isArray(p.tags) ? p.tags : [],
      }))
      // Filter projects for this custom tab
      const filtered = allProjects.filter((p) => p.customTabKey === window.key)
      setCustomProjects(filtered)
    } catch (error) {
      console.error("Failed to load custom projects:", error)
    }
  }

  const handleSaveCustomProject = async ({ project, mainImageFile }: { project: Project; mainImageFile?: File | null }) => {
    try {
      const projectData = {
        ...project,
        customTabKey: window.key,
        category: "engineering" as const, // Default category for custom projects
      }

      const method = projectData.id ? "PUT" : "POST"
      let response: Response

      if (mainImageFile) {
        const formData = new FormData()
        Object.entries(projectData).forEach(([key, value]) => {
          if (value === undefined || value === null) return
          const finalKey = key === "image_url" ? "imageUrl" : key === "order_index" ? "orderIndex" : key === "is_active" ? "isActive" : key
          if (Array.isArray(value)) {
            formData.append(finalKey, JSON.stringify(value))
          } else {
            formData.append(finalKey, String(value))
          }
        })
        formData.append("image", mainImageFile)

        response = await fetch("/api/projects", {
          method,
          body: formData,
        })
      } else {
        // Map fields for JSON payload
        const payloadJson: any = { ...projectData }
        if ("image_url" in payloadJson) {
          payloadJson.imageUrl = payloadJson.image_url
          delete payloadJson.image_url
        }
        if ("order_index" in payloadJson) {
          payloadJson.orderIndex = payloadJson.order_index
          delete payloadJson.order_index
        }
        if ("is_active" in payloadJson) {
          payloadJson.isActive = payloadJson.is_active
          delete payloadJson.is_active
        }
        response = await fetch("/api/projects", {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadJson),
        })
      }

      if (response.ok) {
        await loadCustomProjects()
        setIsCustomProjectDialogOpen(false)
        setEditingCustomProject(null)
      } else {
        alert("Failed to save project")
      }
    } catch (error) {
      alert("Failed to save project")
    }
  }

  const handleDeleteCustomProject = async (id: number) => {
    if (!confirm("Delete this project?")) return
    try {
      const res = await fetch(`/api/projects?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        alert("Failed to delete project")
        return
      }
      await loadCustomProjects()
    } catch (error) {
      alert("Failed to delete project")
    }
  }

  const loadCustomFaqItems = async () => {
    try {
      const res = await fetch("/api/faq")
      const allFaqItems = await res.json()
      // Filter FAQ items for this custom tab
      const filtered = allFaqItems.filter((item: FaqItem) => item.customTabKey === window.key)
      setCustomFaqItems(filtered)
    } catch (error) {
      console.error("Failed to load custom FAQ items:", error)
    }
  }

  const handleSaveCustomFaq = async (item: FaqItem | Omit<FaqItem, "id"> & { id?: number }) => {
    try {
      const faqData = {
        ...item,
        customTabKey: window.key,
      }

      const method = item.id ? "PUT" : "POST"
      const res = await fetch("/api/faq", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(faqData),
      })

      if (!res.ok) {
        alert("Failed to save FAQ item")
        return
      }

      await loadCustomFaqItems()
      setIsCustomFaqDialogOpen(false)
      setEditingCustomFaq(null)
    } catch (error) {
      alert("Failed to save FAQ item")
    }
  }

  const handleDeleteCustomFaq = async (id: number) => {
    if (!confirm("Delete this FAQ item?")) return
    try {
      const res = await fetch(`/api/faq?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        alert("Failed to delete FAQ item")
        return
      }
      await loadCustomFaqItems()
    } catch (error) {
      alert("Failed to delete FAQ item")
    }
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      if (iconFile) {
        const formDataObj = new FormData()
        formDataObj.append("key", formData.key)
        formDataObj.append("label", formData.label)
        formDataObj.append("content", formData.content || "")
        formDataObj.append("layout", formData.layout || "content")
        formDataObj.append("icon", formData.icon || "folder")
        formDataObj.append("icon", iconFile)

        const res = await fetch("/api/custom-panels", {
          method: "PUT",
          body: formDataObj,
        })
        if (!res.ok) {
          alert("Failed to save panel")
          return
        }
      } else {
        const res = await fetch("/api/custom-panels", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            key: formData.key,
            label: formData.label,
            content: formData.content,
            layout: formData.layout,
            icon: formData.icon,
          }),
        })
        if (!res.ok) {
          alert("Failed to save panel")
          return
        }
      }

      onUpdate()
      setIconFile(null)
      setIconPreview(null)
    } finally {
      setSaving(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formData.label || "Unnamed Panel"}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label>Panel Label</Label>
          <Input
            value={formData.label}
            onChange={(e) => setFormData({ ...formData, label: e.target.value })}
            placeholder="Panel name"
          />
        </div>

        <div>
          <Label>Layout Type</Label>
          <Select
            value={formData.layout || "content"}
            onValueChange={(value: "content" | "projects" | "faq") =>
              setFormData({ ...formData, layout: value })
            }
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="content">Simple Content (like About)</SelectItem>
              <SelectItem value="projects">Projects List (like Engineering/Games/Art)</SelectItem>
              <SelectItem value="faq">FAQ Style</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label>Icon</Label>
          <div className="space-y-2">
            <Select
              value={formData.icon || "folder"}
              onValueChange={(value) => setFormData({ ...formData, icon: value })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="user">User</SelectItem>
                <SelectItem value="rocket">Rocket</SelectItem>
                <SelectItem value="gamepad">Gamepad</SelectItem>
                <SelectItem value="palette">Palette</SelectItem>
                <SelectItem value="mail">Mail</SelectItem>
                <SelectItem value="help">Help</SelectItem>
                <SelectItem value="folder">Folder</SelectItem>
              </SelectContent>
            </Select>
            <div>
              <Label className="text-xs text-gray-600">Or upload custom icon image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = e.target.files?.[0] || null
                  setIconFile(file)
                  if (file) {
                    const reader = new FileReader()
                    reader.onloadend = () => {
                      setIconPreview(reader.result as string)
                    }
                    reader.readAsDataURL(file)
                  } else {
                    setIconPreview(null)
                  }
                }}
                className="mt-1"
              />
              {(iconPreview || formData.customIconUrl) && (
                <div className="mt-2 flex items-center gap-2">
                  <img
                    src={iconPreview || formData.customIconUrl || ""}
                    alt="Custom icon preview"
                    className="w-16 h-16 object-contain border rounded p-1"
                  />
                  <span className="text-xs text-gray-500">
                    {iconFile ? `New: ${iconFile.name}` : "Current icon"}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>

        {formData.layout === "projects" ? (
          // Projects Layout - Show project management interface
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold">Projects for this tab</Label>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCustomProject({
                    id: 0,
                    title: "",
                    description: "",
                    category: "engineering",
                    photos: [],
                    keywords: [],
                    projectLink: "",
                    tags: [],
                    order_index: customProjects.length + 1,
                    is_active: true,
                    customTabKey: window.key,
                  })
                  setIsCustomProjectDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {customProjects.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No projects yet. Click "Add Project" to get started.</p>
              ) : (
                customProjects.map((project) => (
                  <Card key={project.id}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{project.title}</CardTitle>
                          <Badge variant="secondary" className="mt-1">
                            {formData.label}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-2">{project.description}</p>
                      <div className="flex flex-wrap gap-1 mb-4">
                        {project.tags.map((tag, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => {
                            setEditingCustomProject(project)
                            setIsCustomProjectDialogOpen(true)
                          }}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomProject(project.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : formData.layout === "faq" ? (
          // FAQ Layout - Show FAQ management interface
          <div>
            <div className="flex justify-between items-center mb-4">
              <Label className="text-lg font-semibold">FAQ Items for this tab</Label>
              <Button
                size="sm"
                onClick={() => {
                  setEditingCustomFaq({
                    id: 0,
                    question: "",
                    answer: "",
                    order: customFaqItems.length + 1,
                    isActive: true,
                    customTabKey: window.key,
                  })
                  setIsCustomFaqDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add FAQ Item
              </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {customFaqItems.length === 0 ? (
                <p className="text-sm text-gray-500 col-span-full">No FAQ items yet. Click "Add FAQ Item" to get started.</p>
              ) : (
                customFaqItems.map((item) => (
                  <Card key={item.id}>
                    <CardHeader>
                      <CardTitle className="text-lg">{item.question}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600 mb-4 line-clamp-3">{item.answer}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500">Order: {item.order}</span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => {
                              setEditingCustomFaq(item)
                              setIsCustomFaqDialogOpen(true)
                            }}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleDeleteCustomFaq(item.id)}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        ) : (
          // Content Layout - Show textarea
          <div>
            <Label>Content</Label>
            <Textarea
              value={formData.content || ""}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={8}
              placeholder="Enter content for this panel..."
            />
          </div>
        )}

        <div className="flex justify-end">
          <Button onClick={handleSave} disabled={saving}>
            <Save className="w-4 h-4 mr-2" />
            {saving ? "Saving..." : "Save Panel"}
          </Button>
        </div>
      </CardContent>

      {/* Custom Project Dialog */}
      <Dialog open={isCustomProjectDialogOpen} onOpenChange={setIsCustomProjectDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingCustomProject?.id ? "Edit Project" : "Add Project"}</DialogTitle>
          </DialogHeader>
          {editingCustomProject && (
            <ProjectForm
              project={editingCustomProject}
              onSave={handleSaveCustomProject}
              onCancel={() => {
                setIsCustomProjectDialogOpen(false)
                setEditingCustomProject(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Custom FAQ Dialog */}
      <Dialog open={isCustomFaqDialogOpen} onOpenChange={setIsCustomFaqDialogOpen}>
        <DialogContent className="max-w-xl">
          <DialogHeader>
            <DialogTitle>{editingCustomFaq?.id ? "Edit FAQ Item" : "Add FAQ Item"}</DialogTitle>
          </DialogHeader>
          {editingCustomFaq && (
            <FaqForm
              item={editingCustomFaq}
              onSave={handleSaveCustomFaq}
              onCancel={() => {
                setIsCustomFaqDialogOpen(false)
                setEditingCustomFaq(null)
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </Card>
  )
}




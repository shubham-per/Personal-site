"use client"

import type React from "react"
import { useState } from "react"
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
  FolderOpen,
  BarChart3,
  Plus,
  Edit,
  Trash2,
  Save,
  LogOut,
  Eye,
  Users,
  MousePointer,
} from "lucide-react"

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

// Mock data for demo
const mockProjects: Project[] = [
  {
    id: 1,
    title: "Aerodynamic Analysis",
    description: "Computational fluid dynamics analysis of aircraft components using ANSYS Fluent.",
    category: "engineering",
    imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
    photos: [],
    keywords: ["CFD", "Aerospace", "ANSYS"],
    projectLink: "",
    tags: ["CFD", "Aerospace", "ANSYS"],
    orderIndex: 1,
    isActive: true,
    cardStyle: "style1",
  },
  {
    id: 2,
    title: "2D Platformer Game",
    description: "A side-scrolling platformer game developed in Unity with C#.",
    category: "games",
    imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
    photos: [],
    keywords: ["Unity", "C#", "2D"],
    projectLink: "",
    tags: ["Unity", "C#", "2D"],
    orderIndex: 1,
    isActive: true,
    cardStyle: "style1",
  },
  {
    id: 3,
    title: "Digital Art Collection",
    description: "A collection of digital artwork created using Photoshop and digital painting techniques.",
    category: "art",
    imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
    photos: [],
    keywords: ["Digital Art", "Illustration", "Photoshop"],
    projectLink: "",
    tags: ["Digital Art", "Illustration", "Photoshop"],
    orderIndex: 1,
    isActive: true,
    cardStyle: "style1",
  },
]

const mockContent: Record<string, Content> = {
  about: {
    id: 1,
    section: "about",
    title: "About Me",
    content: "I'm an aerospace engineer with a passion for game development and digital art. I love creating innovative solutions and bringing ideas to life through code and creativity.",
  },
  contact: {
    id: 2,
    section: "contact",
    title: "Get in Touch",
    content: "Feel free to reach out to me at contact@shubham.dev for collaborations, questions, or just to say hello!",
  },
  faq: {
    id: 3,
    section: "faq",
    title: "Frequently Asked Questions",
    content: "Q: What technologies do you use?\nA: I work with various technologies including CFD software, Unity, and digital art tools.\n\nQ: Do you take freelance work?\nA: Yes, I'm always open to interesting projects!",
  },
}

const mockAnalytics: Analytics = {
  pageViews: [
    { page: "Home", views: 150 },
    { page: "Engineering", views: 89 },
    { page: "Games", views: 67 },
    { page: "Art", views: 45 },
  ],
  dailyVisits: [
    { date: "2024-01-01", unique_visitors: 12, total_views: 25 },
    { date: "2024-01-02", unique_visitors: 18, total_views: 34 },
    { date: "2024-01-03", unique_visitors: 15, total_views: 28 },
    { date: "2024-01-04", unique_visitors: 22, total_views: 41 },
    { date: "2024-01-05", unique_visitors: 19, total_views: 35 },
  ],
  topReferrers: [
    { referrer: "Google", visits: 45 },
    { referrer: "LinkedIn", visits: 23 },
    { referrer: "Twitter", visits: 18 },
    { referrer: "Direct", visits: 12 },
  ],
}

export default function AdminPanelDemo() {
  const [projects, setProjects] = useState<Project[]>([
    {
      id: 1,
      title: "Aerodynamic Analysis",
      description: "Computational fluid dynamics analysis of aircraft components using ANSYS Fluent.",
      category: "engineering",
      imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
      photos: [],
      keywords: ["CFD", "Aerospace", "ANSYS"],
      projectLink: "",
      tags: ["CFD", "Aerospace", "ANSYS"],
      orderIndex: 1,
      isActive: true,
      cardStyle: "style1",
    },
    {
      id: 2,
      title: "2D Platformer Game",
      description: "A side-scrolling platformer game developed in Unity with C#.",
      category: "games",
      imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
      photos: [],
      keywords: ["Unity", "C#", "2D"],
      projectLink: "",
      tags: ["Unity", "C#", "2D"],
      orderIndex: 1,
      isActive: true,
      cardStyle: "style1",
    },
    {
      id: 3,
      title: "Digital Art Collection",
      description: "A collection of digital artwork created using Photoshop and digital painting techniques.",
      category: "art",
      imageUrl: "https://i.imgur.com/IA838Yd.jpeg",
      photos: [],
      keywords: ["Digital Art", "Illustration", "Photoshop"],
      projectLink: "",
      tags: ["Digital Art", "Illustration", "Photoshop"],
      orderIndex: 1,
      isActive: true,
      cardStyle: "style1",
    },
  ])
  const [content, setContent] = useState<Record<string, Content>>(mockContent)
  const [analytics] = useState<Analytics>(mockAnalytics)
  const [editingProject, setEditingProject] = useState<Project | null>(null)
  const [editingContent, setEditingContent] = useState<Content | null>(null)
  const [isProjectDialogOpen, setIsProjectDialogOpen] = useState(false)
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)

  const handleSaveProject = (project: Omit<Project, "id"> & { id?: number }) => {
    if (project.id) {
      setProjects(projects.map(p => p.id === project.id ? { ...project, id: project.id } as Project : p))
    } else {
      const newProject = { ...project, id: Math.max(...projects.map(p => p.id)) + 1 } as Project
      setProjects([...projects, newProject])
    }
    setIsProjectDialogOpen(false)
    setEditingProject(null)
  }

  const handleDeleteProject = (id: number) => {
    setProjects(projects.filter(p => p.id !== id))
  }

  const handleSaveContent = (content: Content) => {
    setContent(prev => ({ ...prev, [content.section]: content }))
    setIsContentDialogOpen(false)
    setEditingContent(null)
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <h1 className="text-2xl font-bold text-gray-900">Admin Panel (Demo Mode)</h1>
            <div className="flex items-center space-x-4">
              <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">
                Demo Mode - No Database
              </Badge>
              <Button variant="outline">
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="analytics" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="analytics">
              <BarChart3 className="w-4 h-4 mr-2" />
              Analytics
            </TabsTrigger>
            <TabsTrigger value="content">
              <FileText className="w-4 h-4 mr-2" />
              Content
            </TabsTrigger>
            <TabsTrigger value="projects">
              <FolderOpen className="w-4 h-4 mr-2" />
              Projects
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </TabsTrigger>
          </TabsList>

          {/* Analytics Tab */}
          <TabsContent value="analytics" className="space-y-6">
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
          </TabsContent>

          {/* Content Tab */}
          <TabsContent value="content" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {Object.entries(content).map(([section, data]) => (
                <Card key={section}>
                  <CardHeader>
                    <CardTitle className="capitalize">{section}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-gray-600 mb-4 line-clamp-3">{data.content.substring(0, 100)}...</p>
                    <Button
                      onClick={() => {
                        setEditingContent(data)
                        setIsContentDialogOpen(true)
                      }}
                      size="sm"
                    >
                      <Edit className="w-4 h-4 mr-2" />
                      Edit
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold">Projects</h2>
              <Button
                onClick={() => {
                  setEditingProject({
                    id: 0,
                    title: "",
                    description: "",
                    category: "engineering",
                    imageUrl: "",
                    photos: [],
                    keywords: [],
                    projectLink: "",
                    tags: [],
                    orderIndex: 0,
                    isActive: true,
                    cardStyle: "style1",
                  } as Project)
                  setIsProjectDialogOpen(true)
                }}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Project
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <Card key={project.id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge variant="secondary" className="mt-1">
                          {project.category}
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
                  <CardTitle>System Status</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span>Database Connection</span>
                    <Badge variant="destructive" className="bg-red-100 text-red-800">Demo Mode</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Analytics Tracking</span>
                    <Badge variant="default" className="bg-green-100 text-green-800">Active</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Total Projects</span>
                    <span className="text-sm font-medium">{projects.length}</span>
                  </div>
                </CardContent>
              </Card>
            </div>
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
  onSave: (project: Project) => void
  onCancel: () => void
}) {
  const [formData, setFormData] = useState(project)
  const [tagInput, setTagInput] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    onSave(formData)
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
          rows={3}
          required
        />
      </div>

      <div>
        <Label htmlFor="category">Category</Label>
        <Select
          value={formData.category}
          onValueChange={(value: "engineering" | "games" | "art") => setFormData({ ...formData, category: value })}
        >
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
        <Label htmlFor="image_url">Image URL</Label>
        <Input
          id="image_url"
          value={formData.imageUrl || ""}
          onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
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
          <Button type="button" onClick={addTag}>
            Add
          </Button>
        </div>
        <div className="flex flex-wrap gap-2">
          {formData.tags.map((tag, index) => (
            <Badge key={index} variant="secondary" className="cursor-pointer" onClick={() => removeTag(tag)}>
              {tag} ×
            </Badge>
          ))}
        </div>
      </div>

      <div>
        <Label htmlFor="order_index">Order</Label>
        <Input
          id="order_index"
          type="number"
          value={formData.orderIndex}
          onChange={(e) => setFormData({ ...formData, orderIndex: Number.parseInt(e.target.value) })}
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
          rows={10}
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
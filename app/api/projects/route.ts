import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { requireAuth } from '@/lib/auth';

const DATA_DIR = path.join(process.cwd(), 'data');
const PROJECTS_FILE = path.join(DATA_DIR, 'projects.json');
const UPLOADS_DIR = path.join(process.cwd(), 'public', 'uploads');

if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
if (!fs.existsSync(UPLOADS_DIR)) fs.mkdirSync(UPLOADS_DIR, { recursive: true });
if (!fs.existsSync(PROJECTS_FILE)) fs.writeFileSync(PROJECTS_FILE, '[]');

function readProjects() {
  return JSON.parse(fs.readFileSync(PROJECTS_FILE, 'utf8'));
}
function writeProjects(projects: any) {
  fs.writeFileSync(PROJECTS_FILE, JSON.stringify(projects, null, 2));
}

function getExtension(filename: string) {
  return filename.split('.').pop()?.toLowerCase();
}
function isAllowedImageType(filename: string) {
  const ext = getExtension(filename);
  return ext === 'jpg' || ext === 'jpeg' || ext === 'png' || ext === 'gif';
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    let projects = readProjects().filter((p: any) => p.isActive !== false);
    if (category) projects = projects.filter((p: any) => p.category === category);
    return NextResponse.json(projects);
  } catch (error) {
    console.error('Projects GET error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Require authentication for creating projects
    try {
      requireAuth(request);
    } catch {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.startsWith('multipart/form-data')) {
      // @ts-ignore
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          data[key] = value;
        } else if (value instanceof File && isAllowedImageType(value.name)) {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const filename = `${Date.now()}-${value.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const filePath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filePath, buffer);
          data.imageUrl = `/uploads/${filename}`;
        }
      }
      ['tags', 'keywords', 'photos'].forEach((arrKey) => {
        if (data[arrKey] && typeof data[arrKey] === 'string') {
          try { data[arrKey] = JSON.parse(data[arrKey]); } catch { data[arrKey] = [data[arrKey]]; }
        }
      });
      if (data.orderIndex) data.orderIndex = parseInt(data.orderIndex);
    } else {
      data = await request.json();
    }
    if (!data.title || !data.description || !data.category) {
      return NextResponse.json({ error: 'Title, description, and category are required' }, { status: 400 });
    }
    const projects = readProjects();
    const newProject = {
      id: Math.max(0, ...projects.map((p: any) => p.id || 0)) + 1,
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl || '',
      photos: data.photos || [],
      keywords: data.keywords || [],
      projectLink: data.projectLink || '',
      tags: data.tags || [],
      orderIndex: data.orderIndex || 0,
      isActive: true,
      cardStyle: data.cardStyle || 'style1',
      customTabKey: data.customTabKey || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    projects.push(newProject);
    writeProjects(projects);
    return NextResponse.json(newProject, { status: 201 });
  } catch (error) {
    console.error('Projects POST error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require authentication for updating projects
    try {
      requireAuth(request);
    } catch {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const contentType = request.headers.get('content-type') || '';
    let data: any = {};
    if (contentType.startsWith('multipart/form-data')) {
      // @ts-ignore
      const formData = await request.formData();
      for (const [key, value] of formData.entries()) {
        if (typeof value === 'string') {
          data[key] = value;
        } else if (value instanceof File && isAllowedImageType(value.name)) {
          const arrayBuffer = await value.arrayBuffer();
          const buffer = Buffer.from(arrayBuffer);
          const filename = `${Date.now()}-${value.name.replace(/[^a-zA-Z0-9.]/g, '_')}`;
          const filePath = path.join(UPLOADS_DIR, filename);
          fs.writeFileSync(filePath, buffer);
          data.imageUrl = `/uploads/${filename}`;
        }
      }
      ['tags', 'keywords', 'photos'].forEach((arrKey) => {
        if (data[arrKey] && typeof data[arrKey] === 'string') {
          try { data[arrKey] = JSON.parse(data[arrKey]); } catch { data[arrKey] = [data[arrKey]]; }
        }
      });
      if (data.orderIndex) data.orderIndex = parseInt(data.orderIndex);
    } else {
      data = await request.json();
    }
    if (!data.id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    const projects = readProjects();
    const idx = projects.findIndex((p: any) => p.id === parseInt(data.id));
    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    projects[idx] = {
      ...projects[idx],
      ...data,
      id: projects[idx].id,
      updatedAt: new Date().toISOString(),
    };
    writeProjects(projects);
    return NextResponse.json(projects[idx]);
  } catch (error) {
    console.error('Projects PUT error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // Require authentication for deleting projects
    try {
      requireAuth(request);
    } catch {
      return NextResponse.json({ error: 'Authentication required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Project ID is required' }, { status: 400 });
    }
    const projects = readProjects();
    const idx = projects.findIndex((p: any) => p.id === parseInt(id));
    if (idx === -1) {
      return NextResponse.json({ error: 'Project not found' }, { status: 404 });
    }
    projects[idx].isActive = false;
    projects[idx].updatedAt = new Date().toISOString();
    writeProjects(projects);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Projects DELETE error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

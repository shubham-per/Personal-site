import { NextRequest, NextResponse } from 'next/server';
import { getContent, updateContent } from '@/lib/data';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const section = searchParams.get('section');

    if (!section) {
      return NextResponse.json(
        { error: 'Section parameter is required' },
        { status: 400 }
      );
    }

    const content = getContent(section);
    
    if (!content) {
      return NextResponse.json(
        { error: 'Content not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(content);

  } catch (error) {
    console.error('Content GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Require authentication for content updates
    try {
      requireAuth(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { section, title, content } = await request.json();

    if (!section || !title || !content) {
      return NextResponse.json(
        { error: 'Section, title, and content are required' },
        { status: 400 }
      );
    }

    const success = updateContent(section, title, content);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Failed to update content' },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Content PUT error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

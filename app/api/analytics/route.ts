import { NextRequest, NextResponse } from 'next/server';
import { trackVisit, getAnalytics } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { page, action } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    
    // Get client IP
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    // Generate visitor ID (in a real app, you'd use a more sophisticated approach)
    const visitorId = uuidv4();
    const sessionId = uuidv4();

    await trackVisit({
      visitor_id: visitorId,
      page: page || '/',
      action: action || 'pageview',
      user_agent: userAgent,
      ip_address: ip,
      referrer: referrer || undefined,
      session_id: sessionId
    });

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('Analytics POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    // Require authentication for viewing analytics
    try {
      requireAuth(request);
    } catch (error) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const analytics = getAnalytics(days);
    return NextResponse.json(analytics);

  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

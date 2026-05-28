import { NextRequest, NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { requireAuth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { page, action } = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    const referrer = request.headers.get('referer') || '';
    
    const forwarded = request.headers.get('x-forwarded-for');
    const ip = forwarded ? forwarded.split(',')[0] : '127.0.0.1';

    const visitorId = uuidv4();
    const sessionId = uuidv4();

    const { error } = await supabase
      .from('analytics')
      .insert({
        visitor_id: visitorId,
        page: page || '/',
        action: action || 'pageview',
        user_agent: userAgent,
        ip_address: ip,
        referrer: referrer || null,
        session_id: sessionId,
      });

    if (error) {
      console.error('Analytics POST error:', error);
      return NextResponse.json({ error: 'Failed to track visit' }, { status: 500 });
    }

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
    try {
      requireAuth(request);
    } catch {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const days = parseInt(searchParams.get('days') || '30');

    const { data: pageViews, error: pvError } = await supabase
      .rpc('get_page_views', { days_param: days });

    let finalPageViews: { page: string; count: number }[];

    if (pvError) {
      const { data: pageViewsFallback, error: pvFallbackError } = await supabase
        .from('analytics')
        .select('page, count:page.count()')
        .gte('timestamp', new Date(Date.now() - days * 86400000).toISOString())
        .order('count', { ascending: false });

      if (pvFallbackError) {
        console.error('Analytics GET page views error:', pvFallbackError);
        return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
      }

      finalPageViews = pageViewsFallback;
    } else {
      finalPageViews = pageViews;
    }

    const { data: dailyVisits, error: dvError } = await supabase
      .from('analytics')
      .select('timestamp, visitor_id')
      .gte('timestamp', new Date(Date.now() - days * 86400000).toISOString());

    if (dvError) {
      console.error('Analytics GET daily visits error:', dvError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    const dailyMap = new Map<string, { unique_visitors: Set<string>; total_views: number }>();
    for (const visit of dailyVisits || []) {
      const date = new Date(visit.timestamp).toISOString().split('T')[0];
      if (!dailyMap.has(date)) {
        dailyMap.set(date, { unique_visitors: new Set(), total_views: 0 });
      }
      const entry = dailyMap.get(date)!;
      entry.unique_visitors.add(visit.visitor_id);
      entry.total_views++;
    }

    const { data: topReferrers, error: refError } = await supabase
      .from('analytics')
      .select('referrer, count:referrer.count()')
      .not('referrer', 'is', null)
      .gte('timestamp', new Date(Date.now() - days * 86400000).toISOString())
      .order('count', { ascending: false })
      .limit(10);

    if (refError) {
      console.error('Analytics GET referrers error:', refError);
      return NextResponse.json({ error: 'Failed to fetch analytics' }, { status: 500 });
    }

    return NextResponse.json({
      pageViews: finalPageViews || [],
      dailyVisits: Array.from(dailyMap.entries()).map(([date, data]) => ({
        date,
        unique_visitors: data.unique_visitors.size,
        total_views: data.total_views,
      })),
      topReferrers: topReferrers || [],
    });

  } catch (error) {
    console.error('Analytics GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

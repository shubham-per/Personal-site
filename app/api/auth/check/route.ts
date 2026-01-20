import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('auth-token')?.value;

    if (!token) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    // Verify JWT token
    const decoded = verify(token, JWT_SECRET) as any;
    
    if (!decoded || !decoded.userId) {
      return NextResponse.json(
        { isAuthenticated: false },
        { status: 401 }
      );
    }

    return NextResponse.json({
      isAuthenticated: true,
      user: {
        id: decoded.userId,
        email: decoded.email,
        role: decoded.role
      }
    });

  } catch (error) {
    console.error('Auth check error:', error);
    return NextResponse.json(
      { isAuthenticated: false },
      { status: 401 }
    );
  }
}

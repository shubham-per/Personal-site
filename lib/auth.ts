import { NextRequest, NextResponse } from 'next/server';
import { verify } from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export function requireAuth(request: NextRequest) {
  const token = request.cookies.get('auth-token')?.value;

  if (!token) {
    throw new Error('Authentication required');
  }

  try {
    const decoded = verify(token, JWT_SECRET) as any;
    if (!decoded || !decoded.userId) {
      throw new Error('Invalid token');
    }
    return decoded;
  } catch (error) {
    throw new Error('Authentication failed');
  }
}

export function createAuthError() {
  return NextResponse.json(
    { error: 'Authentication required' },
    { status: 401 }
  );
}

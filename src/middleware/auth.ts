import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifyIdToken } from '../../firebase/firebaseAdmin';

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token');
  if (!token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  try {
    const decodedToken = await verifyIdToken(token);
    if (decodedToken.role !== 'admin') {
      return NextResponse.redirect(new URL('/unauthorized', request.url));
    }
  } catch (error) {
    console.error('Error verifying ID token:', error);
    return NextResponse.redirect(new URL('/login', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'],
};
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  const isAuthPage = request.nextUrl.pathname === '/login' || request.nextUrl.pathname === '/register';
  const isProtectedPage = request.nextUrl.pathname.startsWith('/dashboard') || 
                         request.nextUrl.pathname.startsWith('/profile');
  
  // Allow access to auth pages if not logged in
  if (isAuthPage && !token) {
    return NextResponse.next();
  }
  
  // Redirect to home if trying to access auth pages while logged in
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/', request.url));
  }
  
  // Redirect to login if trying to access protected pages without being logged in
  if (isProtectedPage && !token) {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/login',
    '/register',
    '/dashboard/:path*',
    '/profile/:path*'
  ]
};
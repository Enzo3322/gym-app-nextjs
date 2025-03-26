import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Define which paths are public and which need authentication
const publicPaths = ['/login', '/register', '/forgot-password'];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check if the path is public
  const isPublicPath = publicPaths.some(path => pathname.startsWith(path));
  
  // Check if user has a valid session
  const token = request.cookies.get('token')?.value;
  
  // If the path is not public and the user is not authenticated, redirect to login
  if (!isPublicPath && !token) {
    const loginUrl = new URL('/login', request.url);
    // Add the current URL as a redirect parameter
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If the user is authenticated and trying to access a public path (like login), redirect to dashboard
  if (isPublicPath && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }
  
  return NextResponse.next();
}

// Configure the middleware to run only on specific paths
export const config = {
  matcher: [
    // Exclude static files, api routes, and _next internal paths
    '/((?!_next/static|_next/image|api|favicon.ico).*)',
  ],
}; 
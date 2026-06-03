import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const role = request.cookies.get('user_role')?.value;
  const path = request.nextUrl.pathname;

  if (path === '/login' || path.startsWith('/api/login')) {
    if (role && path === '/login') {
      return NextResponse.redirect(new URL(role === 'B2B' ? '/portal' : '/', request.url));
    }
    return NextResponse.next();
  }

  if (!role) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  if (role === 'B2B') {
    if (
      !path.startsWith('/portal') && 
      !path.startsWith('/api/b2b') && 
      !path.startsWith('/api/logout') && 
      !path.startsWith('/api/inventory') &&
      !path.includes('/invoice') &&
      !path.startsWith('/api/orders/')
    ) {
      return NextResponse.redirect(new URL('/portal', request.url));
    }
    return NextResponse.next();
  }

  // Admin/Sales/Warehouse roles cannot access B2B portal
  if (path.startsWith('/portal')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (role === 'Warehouse' && (path.startsWith('/clients') || path.startsWith('/orders') || path.startsWith('/pos'))) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (role === 'Sales' && path.startsWith('/inventory')) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};

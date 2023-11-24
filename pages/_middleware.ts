import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {   
  const url = request.nextUrl.clone()   
  if (url.pathname === '/blog') {
    url.pathname = '/b'
    return NextResponse.redirect(url)   
  } 

  // if url.pathname starts with /blog/ redirect to /b/
  if (url.pathname.startsWith('/blog/')) {
    url.pathname = url.pathname.replace('/blog/', '')
    return NextResponse.redirect(url)   
  }
}
/**
 * The external imports
 */
import { NextResponse } from 'next/server'

export function middleware(req, res) {
  const { pathname } = req.nextUrl

  // No restriction for auth pages
  if (pathname.startsWith('/auth') || pathname.startsWith('/_next')) {
    return NextResponse.next()
  }

  const session = req.cookies.get('session')

  // Restricted routes if user aren't authenticated
  if (!session) {
    return NextResponse.redirect(
      new URL(`/auth/sign-in?from=${pathname}`, req.url)
    )
  }

  return NextResponse.next()
}

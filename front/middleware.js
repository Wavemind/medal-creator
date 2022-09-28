/**
 * The external imports
 */
import { NextResponse } from 'next/server'

export function middleware(req, res) {
  const session = req.cookies.get('session', { req, res })
  const pathname = req.nextUrl.pathname

  // No restriction for auth pages
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Restricted routes if user aren't authenticated
  if (
    !pathname.startsWith('/auth') &&
    !pathname.startsWith('/_next') &&
    !pathname.includes('.')
  ) {
    if (!session) {
      return NextResponse.redirect(
        new URL(`/auth/sign-in?from=${pathname}`, req.url)
      )
    }
  }

  return NextResponse.next()
}

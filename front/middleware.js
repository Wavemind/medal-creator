// https://nextjs.org/docs/messages/nested-middleware
import { NextResponse } from 'next/server'

export function middleware(req, res) {
  const sessions = req.cookies.get('sessions', { req, res })
  const pathname = req.nextUrl.pathname

  // No restriction for auth pages
  if (pathname.startsWith('/auth')) {
    return NextResponse.next()
  }

  // Restricted routes if user aren't authenticated
  if (!pathname.startsWith('/auth') && !pathname.startsWith('/_next') && !pathname.includes('.')) {
    if (!sessions) {
      return NextResponse.redirect(
        new URL(`/auth/signin?from=${pathname}`, req.url)
      )
    }
  }

  return NextResponse.next()
}
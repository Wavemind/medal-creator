/**
 * The external imports
 */
export { default } from 'next-auth/middleware'

export const config = {
  // Matcher ignoring `/_next/` and `/api/ /auth/*`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/*).*)'],
}

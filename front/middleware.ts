/**
 * The external imports
 */
// export { default } from 'next-auth/middleware'
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { i18n } from 'next-i18next'
import { NextResponse } from 'next/server'

export default withAuth(async function middleware(req) {
  const token = await getToken({ req })

  if (token) {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/validate_token`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept-Language': i18n?.language || 'en',
          'access-token': token.accessToken!,
          client: token.client!,
          expiry: String(token.expiry!),
          uid: token.uid!,
        },
      }
    )

    if (response.status === 401) {
      // TODO : We gotta do it manually cos signOut from nextAuth is client-side
      const signOutResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/sign_out`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            'Accept-Language': i18n?.language || 'en',
            uid: token.uid!,
            client: token.client!,
            'access-token': token.accessToken!,
          },
        }
      )

      if (signOutResponse) {
        return NextResponse.redirect(
          new URL('/auth/sign-in?notifications=session-expired', req.url)
        )
      }
    }
  } else {
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }
})

// TODO : Check the matcher. It doesn't seem to include the root ('/')
export const config = {
  // Matcher ignoring `/_next/` and `/api/ /auth/*`
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|auth/*).*)'],
}

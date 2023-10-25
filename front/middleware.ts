/**
 * The external imports
 */
import { getToken } from 'next-auth/jwt'
import { withAuth } from 'next-auth/middleware'
import { i18n } from 'next-i18next'
import { NextResponse } from 'next/server'

/**
 * The internal imports
 */
import { RoleEnum } from '@/types'

export default withAuth(async function middleware(req) {
  const token = await getToken({ req })

  // If nextAuth contains a token
  if (token) {
    const role = token.user.role

    const tokenValidityRequest = await fetch(
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

    const tokenValidityResponse = await tokenValidityRequest.json()

    // If the token is valid
    if (tokenValidityResponse.success) {
      // Only Admins are allowed to access /users
      if (req.nextUrl.pathname === '/users') {
        if (role === RoleEnum.Admin) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/404', req.url))
      }

      // If the user is navigating in a specific project tree
      if (req.nextUrl.pathname.includes('projects')) {
        // Only Admins are allowed to access /projects/new
        if (req.nextUrl.pathname === '/projects/new') {
          if (role === RoleEnum.Admin) {
            return NextResponse.next()
          }
          return NextResponse.redirect(new URL('/404', req.url))
        }

        const matchedText = req.nextUrl.pathname.match(/\/projects\/(\d+)/)

        // If the pathname contains numbers after project/
        if (matchedText) {
          const projectId = matchedText[1]

          const projectRequest = await fetch(
            `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
            {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Accept-Language': i18n?.language || 'en',
                'access-token': token.accessToken!,
                client: token.client!,
                expiry: String(token.expiry!),
                uid: token.uid!,
              },
              body: JSON.stringify({
                query: `
                  query getProject($id: ID!) {
                    getProject(id: $id) {
                      id
                      isCurrentUserAdmin
                    }
                  }
                `,
                variables: {
                  id: projectId,
                },
              }),
            }
          )

          const projectResponse = await projectRequest.json()

          // If the project response is successful and data is not null
          if (projectResponse.data) {
            const { isCurrentUserAdmin } = projectResponse.data.getProject

            // Only Admins and Project Admins are allowed to access /projects/:id/edit
            if (req.nextUrl.pathname.includes('/edit')) {
              if (isCurrentUserAdmin) {
                return NextResponse.next()
              }
              return NextResponse.redirect(new URL('/404', req.url))
            }

            // Only Admins, Project Admins and Deployment Managers are allowed to access /projects/:id/publication
            if (req.nextUrl.pathname.includes('publication')) {
              if (isCurrentUserAdmin || role === RoleEnum.DeploymentManager) {
                return NextResponse.next()
              }
              return NextResponse.redirect(new URL('/404', req.url))
            }

            // Only Admins, Project Admins and Clinicians are allowed to access /projects/:id/algorithms/:id/exports
            if (req.nextUrl.pathname.includes('exports')) {
              if (isCurrentUserAdmin || role === RoleEnum.Clinician) {
                return NextResponse.next()
              }
              return NextResponse.redirect(new URL('/404', req.url))
            }

            // Only Admins and Project Admins are allowed to access /projects/:id/algorithms/:id/medal-data-config
            if (req.nextUrl.pathname.includes('medal-data-config')) {
              if (isCurrentUserAdmin) {
                return NextResponse.next()
              }
              return NextResponse.redirect(new URL('/404', req.url))
            }

            return NextResponse.next()
          }
          // If the project response is unsuccessful and data is null
          return NextResponse.redirect(new URL('/404', req.url))
        }

        // If there is something other than numbers after project/
        return NextResponse.redirect(new URL('/404', req.url))
      }

      // If the user is navigating outside of a project tree
      return NextResponse.next()
    } else {
      // Sign out from nextAuth and API
      await fetch(`${process.env.NEXT_PUBLIC_FRONT_URL}/api/auth/signout`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })
      return NextResponse.redirect(
        new URL('/auth/sign-in?notifications=session-expired', req.url)
      )
    }
  } else {
    // If nextAuth does not contain a token
    return NextResponse.redirect(new URL('/auth/sign-in', req.url))
  }
})

export const config = {
  // Matcher ignoring `/_next/` and `/api/ /auth/*`
  matcher: ['/', '/((?!api|_next/static|_next/image|favicon.ico|auth/*).*)'],
}

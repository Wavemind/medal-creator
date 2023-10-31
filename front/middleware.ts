/**
 * The external imports
 */
import { getToken, JWT } from 'next-auth/jwt'
import { NextRequestWithAuth, withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'

/**
 * The internal imports
 */
import { RoleEnum } from '@/types'

// Validate token by the api
async function validateToken(token: JWT) {
  try {
    const tokenValidityRequest = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/validate_token`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'access-token': token.accessToken!,
          client: token.client!,
          expiry: String(token.expiry!),
          uid: token.uid!,
        },
      }
    )

    const tokenValidityResponse = await tokenValidityRequest.json()
    return tokenValidityResponse.success
  } catch {
    return false
  }
}

// Fetch the current project from the api
async function getProjectRole(
  token: JWT,
  projectId: string,
  req: NextRequestWithAuth
) {
  try {
    const projectRequest = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/graphql`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
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
    if (projectResponse.data) {
      return projectResponse.data.getProject.isCurrentUserAdmin
    }
    return null
  } catch {
    // If the project response is unsuccessful
    return NextResponse.redirect(new URL('/500', req.url))
  }
}

// Sign out from nextAuth and API
async function logout(req: NextRequestWithAuth) {
  try {
    const nextAuthSignoutRequest = await fetch(
      `${process.env.NEXT_PUBLIC_FRONT_URL}/api/auth/signout`,
      {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: req.cookies.get('next-auth.csrf-token').value,
      }
    )
    console.log('nextAuthSignoutRequest', nextAuthSignoutRequest)
    // CA a l'air de bugger ici *********************************
    const nextAuthSignoutResponse = await nextAuthSignoutRequest.json()
    console.log('nextAuthSignoutResponse', nextAuthSignoutResponse)

    const apiSignoutRequest = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/api/v2/auth/sign_out`,
      {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )

    if (nextAuthSignoutResponse) {
      return true
    }
  } catch {
    return false
  }
}

export default withAuth(async function middleware(req) {
  const token = await getToken({ req })

  // If nextAuth contains a token
  if (token) {
    // Check token validity
    const isTokenValid = await validateToken(token)

    // If the token is valid
    if (isTokenValid) {
      const role = token.user.role
      const pathname = req.nextUrl.pathname

      // Only Admins are allowed to access /users and /projects/new
      if (['/users', '/projects/new'].includes(pathname)) {
        if (role === RoleEnum.Admin) {
          return NextResponse.next()
        }
        return NextResponse.redirect(new URL('/404', req.url))
      }

      // If the user is navigating in a specific project tree
      if (pathname.includes('projects')) {
        const matchedText = pathname.match(/\/projects\/(\d+)/)

        // If the pathname contains numbers after project/
        if (matchedText) {
          const projectId = matchedText[1]
          const isCurrentUserAdmin = await getProjectRole(token, projectId, req)

          if (isCurrentUserAdmin === null) {
            return NextResponse.redirect(new URL('/404', req.url))
          }

          // Only Admins and Project Admins are allowed to access /projects/:id/edit
          // and /projects/:id/algorithms/:id/medal-data-config
          if (
            ['/edit', '/medal-data-config'].some(path =>
              pathname.includes(path)
            )
          ) {
            if (isCurrentUserAdmin) {
              return NextResponse.next()
            }
            return NextResponse.redirect(new URL('/404', req.url))
          }

          // Only Admins, Project Admins and Deployment Managers are allowed to access /projects/:id/publication
          if (pathname.includes('/publication')) {
            if (isCurrentUserAdmin || role === RoleEnum.DeploymentManager) {
              return NextResponse.next()
            }
            return NextResponse.redirect(new URL('/404', req.url))
          }

          // Only Admins, Project Admins and Clinicians are allowed to access /projects/:id/algorithms/:id/exports
          if (pathname.includes('/exports')) {
            if (isCurrentUserAdmin || role === RoleEnum.Clinician) {
              return NextResponse.next()
            }
            return NextResponse.redirect(new URL('/404', req.url))
          }

          return NextResponse.next()
        }

        // If there is something other than numbers after project/
        return NextResponse.redirect(new URL('/404', req.url))
      }

      // If the user is navigating outside of a project tree
      return NextResponse.next()
    } else {
      // Sign out from nextAuth and API
      await logout(req)
      return NextResponse.redirect(new URL('/auth/sign-in', req.url))
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

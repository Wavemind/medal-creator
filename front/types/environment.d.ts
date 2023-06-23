declare global {
  namespace NodeJS {
    interface ProcessEnv {
      NEXT_PUBLIC_FRONT_URL: string
      NEXT_PUBLIC_API_URL: string
      NEXT_PUBLIC_SENTRY_DSN: string
      SENTRY_DSN: string
      SENTRY_AUTH_TOKEN: string
      NEXTAUTH_URL: string
      NEXTAUTH_SECRET: string
    }
  }
}

// If this file has no import/export statements (i.e. is a script)
// convert it into a module by adding an empty export statement.
export {}

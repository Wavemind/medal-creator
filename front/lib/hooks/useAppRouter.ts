/**
 * The external imports
 */
// eslint-disable-next-line @typescript-eslint/no-restricted-imports
import { useRouter } from 'next/router'

/**
 * The internal imports
 */
import type { CustomQuery } from '@/types'

export const useAppRouter = () => {
  const router = useRouter()

  // Function to cast query values as strings
  const castQueryValues = (query: typeof router.query): CustomQuery => {
    const updatedQuery: CustomQuery = {}

    if (Object.values(query).every(value => typeof value === 'string')) {
      for (const key in query) {
        updatedQuery[key] = String(query[key])
      }
    }

    return updatedQuery
  }

  // Overriding the query property of the router object
  const query = castQueryValues(router.query)

  return { ...router, query }
}

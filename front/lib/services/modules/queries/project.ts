export const getProjectsQueryString = `
  query ($searchTerm: String) {
    getProjects(searchTerm: $searchTerm) {
      pageInfo {
        hasNextPage
        hasPreviousPage
        endCursor
        startCursor
      }
      totalCount
      edges {
        node {
          id
          name
          isCurrentUserAdmin
        }
      }
    }
  }
`

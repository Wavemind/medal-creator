export const getUsersQueryString = `
  query (
    $projectId: ID
    $after: String
    $before: String
    $first: Int
    $last: Int
    $searchTerm: String
  ) {
    getUsers(
      projectId: $projectId
      after: $after
      before: $before
      first: $first
      last: $last
      searchTerm: $searchTerm
    ) {
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
          firstName
          lastName
          email
          role
          lockedAt
        }
      }
    }
  }
`

export const getUserQueryString = `
  query ($id: ID!) {
    getUser(id: $id) {
      id
      email
      firstName
      lastName
      role
      userProjects {
        id
        projectId
        isAdmin
        project {
          name
        }
      }
    }
  }
`

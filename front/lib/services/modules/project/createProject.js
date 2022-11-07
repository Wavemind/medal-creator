// /**
//  * The external imports
//  */
// import { gql } from 'graphql-request'

// export default build =>
//   build.mutation({
//     query: values => ({
//       document: gql`
//         mutation {
//           createProject(input: {
//             params: {
//               name: "${values.name}"
//               description: "${values.description}"
//               consentManagement: ${values.consentManagement}
//               trackReferral: ${values.trackReferral}
//               languageId: "${values.languageId}"
//               emergencyContentTranslations: ${values.emergencyContentTranslations}
//               userProjectsAttributes: "${values.userProjectsAttributes}"
//             }
//           }) {
//             project {
//               id
//               }
//             }
//           }
//          `,
//     }),
//     transformResponse: response => response.createProject,
//     invalidatesTags: ['Project'],
//   })

/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
        mutation {
          createProject(
            input: { params: { name: name, description: description } }
          ) {
            project {
              id
            }
          }
        }
      `,
      variables: {
        name: values.name,
        description: values.description,
      },
    }),
    transformResponse: response => response.createProject,
    invalidatesTags: ['Project'],
  })

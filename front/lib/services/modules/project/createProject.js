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
//               name: "${values.name}",
//               description: "${values.description}",
//               consentManagement: ${values.consentManagement},
//               trackReferral: ${values.trackReferral},
//               languageId: "${values.languageId}",
//               emergencyContentTranslations: [{fr: "connard"}],
//               userProjectsAttributes: [{userId: 1, isAdmin: true}]
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
            input: {
              params: {
                name: "New project"
                consentManagement: true
                languageId: 1
                emergencyContentTranslations: {
                  en: "This is my new project"
                  fr: "Ceci est mon nouveau projet"
                }
                userProjectsAttributes: [{ userId: 1, isAdmin: true }]
              }
            }
          ) {
            project {
              id
              name
            }
          }
        }
      `,
    }),
    transformResponse: response => response.createProject,
    invalidatesTags: ['Project'],
  })

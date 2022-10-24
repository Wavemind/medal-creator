/**
 * The external imports
 */
import { gql } from 'graphql-request'

export default build =>
  build.mutation({
    query: values => ({
      document: gql`
         mutation {
           updateUser(input: {
             params: {
               id: ${values.id},
               password: "${values.password}",
               passwordConfirmation: "${values.passwordConfirmation}",
             }
           }) {
             user {
               id
               firstName
               lastName
               email
             }
           }
         }
       `,
    }),
    transformResponse: response => response.updateUser,
    invalidatesTags: ['User'],
  })

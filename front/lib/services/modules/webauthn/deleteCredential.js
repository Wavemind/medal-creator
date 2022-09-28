export default build =>
  build.mutation({
    query: ({ id }) => ({
      url: `/v1/webauthn/credentials/${id}`,
      method: 'DELETE',
    }),
    invalidatesTags: ['Credential'],
  })

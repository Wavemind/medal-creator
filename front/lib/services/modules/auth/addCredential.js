export default build =>
  build.mutation({
    query: ({ name, credential, challenge }) => ({
      url: '/auth/add-credential',
      method: 'POST',
      body: {
        name,
        credential,
        challenge,
      },
    }),
    invalidatesTags: ['Credential'],
  })

export default build =>
  build.mutation({
    query: ({ name, credential, challenge }) => ({
      url: '/credentials',
      method: 'POST',
      body: {
        name,
        credential,
        challenge,
      },
    }),
    invalidatesTags: ['Credential'],
  })

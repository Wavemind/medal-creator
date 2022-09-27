export default build =>
  build.mutation({
    query: ({ id }) => ({
      url: '/credentials',
      method: 'DELETE',
      body: {
        id,
      },
    }),
    invalidatesTags: ['Credential'],
  })

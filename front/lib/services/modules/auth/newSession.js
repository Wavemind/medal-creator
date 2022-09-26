export default build =>
  build.mutation({
    query: ({ email, password }) => ({
      url: '/auth/new',
      method: 'POST',
      body: {
        email,
        password,
      },
    }),
  })

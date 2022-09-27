export default build =>
  build.mutation({
    query: ({ email, password }) => ({
      url: '/sessions',
      method: 'POST',
      body: {
        email,
        password,
      },
    }),
  })

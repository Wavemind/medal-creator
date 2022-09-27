export default build =>
  build.mutation({
    query: ({ credentials, email }) => ({
      url: '/credentials/authentification',
      method: 'POST',
      body: {
        credentials,
        email,
      },
    }),
  })

export default build =>
  build.mutation({
    query: ({ email }) => ({
      url: '/v1/auth/password',
      method: 'POST',
      body: {
        email,
        redirect_url: `${process.env.NEXT_PUBLIC_FRONT_URL}/auth/new-password`,
      },
    }),
  })

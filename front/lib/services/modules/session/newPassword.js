export default build =>
  build.mutation({
    query: ({ values, query }) => ({
      url: '/v1/auth/password',
      method: 'PUT',
      body: {
        password: values.password,
        password_confirmation: values.passwordConfirmation,
      },
      headers: query,
    }),
  })

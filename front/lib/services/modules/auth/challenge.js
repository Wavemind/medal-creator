export default build =>
  build.mutation({
    query: () => ({
      url: '/auth/challenge',
      method: 'POST',
    }),
  })

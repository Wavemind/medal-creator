export default build =>
  build.mutation({
    query: () => ({
      url: '/credentials/challenge',
      method: 'POST',
    }),
  })

export default build =>
  build.mutation({
    query: () => ({
      url: '/sessions',
      method: 'DELETE',
    }),
  })

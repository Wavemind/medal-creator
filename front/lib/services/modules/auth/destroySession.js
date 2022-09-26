export default (build) =>
  build.mutation({
    query: () => ({
      url: '/auth/destroy',
      method: 'POST',
    }),
  })

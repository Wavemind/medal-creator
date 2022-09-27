export default build =>
  build.query({
    query: () => ({
      url: '/credentials',
      method: 'GET',
    }),
    providesTags: ['Credential'],
  })

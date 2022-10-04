export default build =>
  build.mutation({
    query: () => ({
      url: '/v1/webauthn/challenges',
      method: 'POST',
    }),
  })

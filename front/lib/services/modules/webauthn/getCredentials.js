export default build =>
  build.query({
    query: () => '/v1/webauthn/credentials',
    providesTags: ['Credential'],
  })

export default build =>
  build.mutation({
    query: ({ name, credential, challenge }) => ({
      url: `/v1/webauthn/credentials?name=${name}`,
      method: 'POST',
      body: {
        credential,
        challenge,
      },
    }),
    invalidatesTags: ['Credential'],
  })

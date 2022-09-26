class Api::V1::Webauthn::AuthenticationsController < Api::V1::ApplicationController
  skip_before_action :authenticate_api_v1_user!

  def create
    # prepare needed data
    webauthn_credential = WebAuthn::Credential.from_get(params[:credentials])
    user = User.find_by_email(params[:email])
    credential = user.webauthn_credentials.find_by(external_id: webauthn_credential.id)

    begin
      # verification
      webauthn_credential.verify(
        $redis.hget(user.id, 'authentication_challenge'),
        public_key: credential.public_key,
        sign_count: credential.sign_count
      )

      # update the sign count
      credential.update!(sign_count: webauthn_credential.sign_count)

      # extract client from auth header
      client = request.headers['client']

      # update token, generate updated auth headers for response
      new_auth_header = user.create_new_auth_token(client)

      # update response with the header that will be required by the next request
      response.headers.merge!(new_auth_header)

      # signing the user in manually
      sign_in(:user, user)

      render json: { data: user }

    rescue WebAuthn::Error => e
      render json: "Verification failed: #{e.message}", status: :unprocessable_entity
    ensure
      $redis.hdel(user.id, 'authentication_challenge')
    end
  end
end

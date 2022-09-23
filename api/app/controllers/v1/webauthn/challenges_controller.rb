class Api::V1::Webauthn::ChallengesController < Api::V1::ApplicationController
  def create
    # Generate WebAuthn ID if the user does not have any yet
    current_api_v1_user.update(webauthn_id: WebAuthn.generate_user_id) unless current_api_v1_user.webauthn_id

    # Prepare the needed data for a challenge
    create_options = WebAuthn::Credential.options_for_create(
      user: {
        id: current_api_v1_user.webauthn_id,
        display_name: current_api_v1_user.email, # we have only the email
        name: current_api_v1_user.email # we have only the email
      },
      exclude: current_api_v1_user.webauthn_credentials.pluck(:external_id)
    )

    # Generate the challenge and save it into the session
    $redis.hmset(current_api_v1_user.id, 'webauthn_credential_register_challenge', create_options.challenge)

    render json: create_options
  end
end

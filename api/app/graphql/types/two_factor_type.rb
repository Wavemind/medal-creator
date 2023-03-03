module Types
  class TwoFactorType < Types::BaseObject
    field :otp_required_for_login, Boolean
    field :otp_provisioning_uri, String
    field :otp_secret, String
  end
end

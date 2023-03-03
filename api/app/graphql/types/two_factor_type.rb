module Types
  class TwoFactorType < Types::BaseObject
    field :otp_required_for_login, Boolean
    field :otp_provisioning_uri, String
  end
end

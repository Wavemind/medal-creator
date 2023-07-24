module Queries
  module TwoFactor
    class GetQrCodeUri < Queries::BaseQuery
      type Types::UserType, null: false
      argument :user_id, ID

      # Works with current_user
      def authorized?(user_id:)
        return true if context[:current_api_v1_user].id == user_id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(user_id:)
        user = User.find(user_id)
        user.generate_two_factor_secret_if_missing!

        { otp_provisioning_uri: user.two_factor_qr_code_uri, otp_secret: user.otp_secret }
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

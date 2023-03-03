module Queries
  module TwoFactor
    class GetOtpRequiredForLogin < Queries::BaseQuery
      type Types::TwoFactorType, null: false
      argument :user_id, ID

      # Works with current_user
      def authorized?(user_id:)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].id == user_id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(user_id:)
        user = User.find(user_id)
        { otp_required_for_login: user.otp_required_for_login }
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

module Queries
  module Users
    class GetCredentials < Queries::BaseQuery
      type Types::UserType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].id == id.to_i

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(id:)
        user = User.find(id)
        issuer = 'medAl-creator'
        label = "#{issuer}:#{user.email}"
        otp_provisioning_uri = user.otp_provisioning_uri(label, issuer: issuer)
        { id: user.id, otp_provisioning_uri: otp_provisioning_uri }
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

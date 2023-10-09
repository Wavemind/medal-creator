module Mutations
  module Users
    class ResendInvitation < Mutations::BaseMutation
      # Fields
      field :user, Types::UserType

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        return true if context[:current_api_v1_user].admin?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(id:)
        begin
          user = User.find(id)
          if user.invite!
            { user: user }
          else
            GraphQL::ExecutionError.new(user.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

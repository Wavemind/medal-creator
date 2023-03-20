module Mutations
  module Users
    class UnlockUser < Mutations::BaseMutation
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
        user = User.find(id)
        if user.unlock_access!
          { user: user }
        else
          GraphQL::ExecutionError.new(user.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

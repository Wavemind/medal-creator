module Mutations
  module Users
    class CreateUser < Mutations::BaseMutation
      # Fields
      field :user, Types::UserType, null: false

      # Arguments
      argument :params, Types::Input::UserInputType, required: true

      # Works with current_user
      def authorized?(params:)
        return true if context[:current_api_v1_user].admin?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:)
        user_params = Hash params
        begin
          user = User.new(user_params)
          if user.valid?
            { user: User.invite!(user_params) }
          else
            GraphQL::ExecutionError.new(user.errors.full_messages.join(', '))
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

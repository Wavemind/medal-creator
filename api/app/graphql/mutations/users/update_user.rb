module Mutations
  module Users
    class UpdateUser < Mutations::BaseMutation
      # Fields
      field :user, Types::UserType, null: false

      # Arguments
      argument :params, Types::Input::UserInputType, required: true

      # Works with current_user
      def authorized?(id:)
        return true if context[:current_api_v1_user].admin?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:)
        user_params = Hash params
        begin
          user = User.find(user_params[:id])
          user.update!(user_params)
          { user: user }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

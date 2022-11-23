module Mutations
  module Users
    class AcceptInvitation < Mutations::BaseMutation
      # Fields
      field :user, Types::UserType, null: false

      # Arguments
      argument :params, Types::Input::UserInputType, required: true

      # Resolve
      def resolve(params:)
        user_params = Hash params
        begin
          user = User.accept_invitation!(user_params)
          user.update!(user_params)
          { user: user }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

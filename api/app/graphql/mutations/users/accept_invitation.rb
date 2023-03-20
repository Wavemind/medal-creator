module Mutations
  module Users
    class AcceptInvitation < Mutations::BaseMutation
      # Fields
      field :user, Types::UserType

      # Arguments
      argument :params, Types::Input::UserInputType, required: true

      # Resolve
      def resolve(params:)
        user_params = Hash params
        begin
          user = User.accept_invitation!(user_params)
          if user.update(user_params)
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

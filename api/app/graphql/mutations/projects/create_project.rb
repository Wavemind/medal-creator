module Mutations
  module Projects
    class CreateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :params, Types::Input::UserInputType, required: true

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
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end
end

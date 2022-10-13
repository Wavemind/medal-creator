module Queries
  module Users
    class GetUser < Queries::BaseQuery
      type Types::UserType, null: false
      argument :id, ID

      def resolve(id:)
        User.find(id)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('User does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

module Queries
  module Users
    class GetUsers < Queries::BaseQuery
      type [Types::UserType], null: false

      def resolve
        User.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

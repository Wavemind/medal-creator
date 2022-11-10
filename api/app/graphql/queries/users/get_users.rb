module Queries
  module Users
    class GetUsers < Queries::BaseQuery
      type [Types::UserType], null: false

      def resolve
        User.all.order(:id)
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

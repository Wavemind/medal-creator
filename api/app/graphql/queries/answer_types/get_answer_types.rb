module Queries
  module AnswerTypes
    class GetAnswerTypes < Queries::BaseQuery
      type [Types::AnswerTypeType], null: false

      def resolve
        AnswerType.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

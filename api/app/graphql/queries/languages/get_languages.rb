module Queries
  module Languages
    class GetLanguages < Queries::BaseQuery
      type [Types::LanguageType], null: false

      def resolve
        Language.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

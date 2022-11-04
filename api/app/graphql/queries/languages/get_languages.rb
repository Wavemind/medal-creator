module Queries
  module Languages
    class GetLanguages < Queries::BaseQuery
      type [Types::LanguageType], null: false

      def resolve
        Language.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

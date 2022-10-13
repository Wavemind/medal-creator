module Queries
  module Projects
    class GetProject < Queries::BaseQuery
      type Types::ProjectType, null: false
      argument :name, String

      def resolve(name:)
        Project.find_by_name(name)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('Project does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

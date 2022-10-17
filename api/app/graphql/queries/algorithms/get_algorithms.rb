module Queries
  module Algorithms
    class GetAlgorithms < Queries::BaseQuery
      type [Types::AlgorithmType], null: false
      argument :project_id, String

      def resolve(project_id:)
        project = Project.find(project_id)
        project.algorithms
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('Project does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

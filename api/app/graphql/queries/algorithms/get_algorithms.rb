module Queries
  module Algorithms
    class GetAlgorithms < Queries::BaseQuery
      type Types::AlgorithmType.connection_type, null: false
      argument :project_id, ID
      argument :search_term, String, required: false

      def resolve(project_id:, search_term: "")
        project = Project.find(project_id)
        if search_term.present?
          project.algorithms.ransack("name_cont": search_term).result
        else
          project.algorithms
        end
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('Project does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

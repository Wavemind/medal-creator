module Queries
  module Algorithms
    class GetAlgorithms < Queries::BaseQuery
      type [Types::AlgorithmType], null: false
      argument :project_id, ID

      # Works with current_user
      def authorized?(project_id:)
        return true if context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
        raise GraphQL::ExecutionError, "You do not have access to this project"
      end

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

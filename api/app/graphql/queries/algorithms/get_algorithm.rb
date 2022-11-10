module Queries
  module Algorithms
    class GetAlgorithm < Queries::BaseQuery
      type Types::AlgorithmType, null: true
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        algo = Algorithm.find(id)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algo.project_id).any?
        raise GraphQL::ExecutionError, "You do not have access to this project"
      end

      def resolve(id:)
        Algorithm.find(id)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('Algorithm does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

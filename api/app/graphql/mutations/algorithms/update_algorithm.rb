module Mutations
  module Algorithms
    class UpdateAlgorithm < Mutations::BaseMutation
      # Fields
      field :algorithm, Types::AlgorithmType, null: false

      # Arguments
      argument :params, Types::Input::AlgorithmInputType, required: true

      # Works with current_user
      def authorized?(params:)
        project_id = Hash(params)[:project_id]
        return true if context[:current_api_v1_user].user_projects.where(project_id: project_id, is_admin: true).any?
        raise GraphQL::ExecutionError, "You do not have admin accesses to this project"
      end

      # Resolve
      def resolve(params:)
        algorithm_params = Hash params
        begin
          algorithm = Algorithm.find(algorithm_params[:id])
          algorithm.update!(algorithm_params)
          { algorithm: algorithm }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

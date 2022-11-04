module Mutations
  module Algorithms
    class CreateAlgorithm < Mutations::BaseMutation
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
          algorithm = Algorithm.new(algorithm_params)
          if algorithm.save
            { algorithm: algorithm }
          else
            GraphQL::ExecutionError.new(algorithm.errors.full_messages.join(', '))
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end
end

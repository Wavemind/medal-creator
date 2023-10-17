module Mutations
  module Algorithms
    class CreateAlgorithm < Mutations::BaseMutation
      # Fields
      field :algorithm, Types::AlgorithmType

      # Arguments
      argument :params, Types::Input::AlgorithmInputType, required: true

      # Works with current_user
      def authorized?(params:)
        project_id = Hash(params)[:project_id]
        return true if context[:current_api_v2_user].project_clinician?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        algorithm_params = Hash params
        begin
          algorithm = Algorithm.new(algorithm_params)
          if algorithm.save
            { algorithm: algorithm }
          else
            GraphQL::ExecutionError.new(algorithm.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

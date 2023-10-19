module Mutations
  module Algorithms
    class UpdateAlgorithm < Mutations::BaseMutation
      # Fields
      field :algorithm, Types::AlgorithmType

      # Arguments
      argument :params, Types::Input::AlgorithmInputType, required: true

      # Works with current_user
      def authorized?(params:)
        algorithm = Algorithm.find(Hash(params)[:id])
        return true if context[:current_api_v2_user].project_clinician?(algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(params:)
        algorithm_params = Hash params
        begin
          algorithm = Algorithm.find(algorithm_params[:id])
          if algorithm.update(algorithm_params)
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

module Mutations
  module Algorithms
    class UpdateAlgorithm < Mutations::BaseMutation
      # Fields
      field :algorithm, Types::AlgorithmType

      # Arguments
      argument :params, Types::Input::AlgorithmInputType, required: true

      # Works with current_user
      def authorized?(params:)
        params = Hash(params)

        algorithm = Algorithm.find(params[:id])

        if algorithm.prod? && !params.key?(:medal_data_config_variables_attributes) && !params.key?(:full_order_json)
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: algorithm.status)
        end

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

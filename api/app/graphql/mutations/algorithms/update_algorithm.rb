module Mutations
  module Algorithms
    class UpdateAlgorithm < Mutations::BaseMutation
      # Fields
      field :algorithm, Types::AlgorithmType, null: false

      # Arguments
      argument :params, Types::Input::AlgorithmInputType, required: true

      # Works with current_user
      def authorized?(params:)
        algorithm = Algorithm.find(Hash(params)[:id])
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algorithm.project_id, is_admin: true).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
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

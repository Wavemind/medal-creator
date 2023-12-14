module Mutations
  module Algorithms
    class DestroyAlgorithm < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        algorithm = Algorithm.find(id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: algorithm.status) unless algorithm.draft?

        return true if context[:current_api_v2_user].project_clinician?(algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        algorithm = Algorithm.find(id)
        if algorithm.update(status: :archived)
          { id: id }
        else
          GraphQL::ExecutionError.new(algorithm.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

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
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algorithm.project_id, is_admin: true).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      end

      # Resolve
      def resolve(id:)
        begin
          algorithm = Algorithm.find(id)
          algorithm.destroy!
          { id: id }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

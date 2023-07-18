module Queries
  module DecisionTrees
    class GetLastUpdatedDecisionTrees < Queries::BaseQuery
      type Types::DecisionTreeType.connection_type, null: false
      argument :project_id, ID, required: true

      # Works with current_user
      def authorized?(project_id:)
        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:)
        project = Project.find(project_id)
        DecisionTree.where(algorithm: project.algorithms).includes(:algorithm, :node).order(updated_at: :desc)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

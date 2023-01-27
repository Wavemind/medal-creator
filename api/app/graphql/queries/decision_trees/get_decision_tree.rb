module Queries
  module DecisionTrees
    class GetDecisionTree < Queries::BaseQuery
      type Types::DecisionTreeType, null: true
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        decision_tree = DecisionTree.find(id)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: decision_tree.algorithm.project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'DecisionTree')
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      end

      def resolve(id:)
        DecisionTree.find(id)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

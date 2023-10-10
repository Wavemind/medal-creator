module Queries
  module DecisionTrees
    class GetDecisionTree < Queries::BaseQuery
      type Types::DecisionTreeType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        decision_tree = DecisionTree.find(id)
        if context[:current_api_v2_user].admin? || context[:current_api_v2_user].user_projects.where(project_id: decision_tree.algorithm.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'DecisionTree')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        DecisionTree.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Mutations
  module DecisionTrees
    class DestroyDecisionTree < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        decision_tree = DecisionTree.find(id)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          project_id: decision_tree.algorithm.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'DecisionTree')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        decision_tree = DecisionTree.find(id)
        if decision_tree.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(decision_tree.errors.to_json)
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

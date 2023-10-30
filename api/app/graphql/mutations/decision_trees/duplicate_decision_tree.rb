module Mutations
  module DecisionTrees
    class DuplicateDecisionTree < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        decision_tree = DecisionTree.find(id)
        return true if context[:current_api_v2_user].project_clinician?(decision_tree.algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'DecisionTree')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        begin
          new_decision_tree = DecisionTree.find(id).duplicate
          { id: new_decision_tree.id }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        rescue ActiveRecord::RecordNotFound => e
          GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
        end
      end
    end
  end
end

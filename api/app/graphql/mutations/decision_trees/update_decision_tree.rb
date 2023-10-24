module Mutations
  module DecisionTrees
    class UpdateDecisionTree < Mutations::BaseMutation
      # Fields
      field :decision_tree, Types::DecisionTreeType

      # Arguments
      argument :params, Types::Input::DecisionTreeInputType, required: true

      # Works with current_user
      def authorized?(params:)
        decision_tree = DecisionTree.find(Hash(params)[:id])
        return true if context[:current_api_v2_user].project_clinician?(decision_tree.algorithm.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'DecisionTree')
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      end

      # Resolve
      def resolve(params:)
        decision_tree_params = Hash params
        begin
          decision_tree = DecisionTree.find(decision_tree_params[:id])
          if decision_tree.update(decision_tree_params)
            { decision_tree: decision_tree }
          else
            GraphQL::ExecutionError.new(decision_tree.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

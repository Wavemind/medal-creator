module Mutations
  module DecisionTrees
    class CreateDecisionTree < Mutations::BaseMutation
      # Fields
      field :decision_tree, Types::DecisionTreeType

      # Arguments
      argument :params, Types::Input::DecisionTreeInputType, required: true

      # Works with current_user
      def authorized?(params:)
        algorithm = Hash(params)[:algorithm_id]
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          project_id: algorithm.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        decision_tree_params = Hash params
        begin
          decision_tree = DecisionTree.new(decision_tree_params)
          if decision_tree.save
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

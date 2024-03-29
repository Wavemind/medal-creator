module Queries
  module Diagrams
    class GetComponents < Queries::BaseQuery
      type [Types::InstanceType], null: false

      argument :instanceable_id, ID
      argument :instanceable_type, Types::Enum::DiagramEnum # Can be Algorithm, DecisionTree or Node (for Diagnosis and QuestionsSequence)

      # Works with current_user
      def authorized?(instanceable_id:, instanceable_type:)
        diagram = Object.const_get(instanceable_type).find(instanceable_id)

        project_id = diagram.is_a?(DecisionTree) ? diagram.algorithm.project_id : diagram.project_id

        return true if context[:current_api_v2_user].has_access_to_project?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(instanceable_id:, instanceable_type:)
        diagram = Object.const_get(instanceable_type).find(instanceable_id)
        diagram.is_a?(DecisionTree) ? diagram.components.includes([node: [:answers, :excluding_nodes], conditions: :answer]).decision_tree_diagram : diagram.components
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

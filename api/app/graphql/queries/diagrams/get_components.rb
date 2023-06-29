module Queries
  module Diagrams
    class GetComponents < Queries::BaseQuery
      type [Types::InstanceType], null: false

      argument :instanceable_id, ID
      argument :instanceable_type, String # Can be Algorithm, DecisionTree or Node (for Diagnosis and QuestionsSequence)

      # Works with current_user
      def authorized?(instanceable_id:, instanceable_type:)
        diagram = Object.const_get(instanceable_type).find(instanceable_id)

        project_id = diagram.is_a?(DecisionTree) ? diagram.algorithm.project_id : diagram.project_id

        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(instanceable_id:, instanceable_type:)
        diagram = Object.const_get(instanceable_type).find(instanceable_id)
        diagram.is_a?(DecisionTree) ? diagram.components.decision_tree_diagram : diagram.components
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

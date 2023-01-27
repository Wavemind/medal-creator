module Queries
  module DecisionTrees
    class GetDecisionTrees < Queries::BaseQuery
      type Types::DecisionTreeType.connection_type, null: false
      argument :algorithm_id, ID
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(algorithm_id:, search_term: "")
        algorithm = Algorithm.find(algorithm_id)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algorithm.project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.record.class))
      end

      def resolve(algorithm_id:, search_term: "")
        algorithm = Algorithm.find(algorithm_id)
        search_term.present? ? algorithm.decision_trees.ransack("name_cont": search_term).result : algorithm.decision_trees
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

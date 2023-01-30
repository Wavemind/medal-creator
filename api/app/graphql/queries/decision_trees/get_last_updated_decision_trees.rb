module Queries
  module DecisionTrees
    class GetLastUpdatedDecisionTrees < Queries::BaseQuery
      type Types::DecisionTreeType.connection_type, null: false
      argument :project_id, ID
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id:, search_term: '')
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:, search_term: '')
        project = Project.find(project_id)

        if search_term.present?
          project.algorithms.map(&:decision_trees).flatten.ransack("name_cont": search_term).result.sort_by{|dt| dt['updated_at']}.reverse
        else
          project.algorithms.map(&:decision_trees).flatten.sort_by{|dt| dt['updated_at']}.reverse
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

module Queries
  module Projects
    class GetProjectLastUpdatedDecisionTrees < Queries::BaseQuery
      type Types::ProjectLastUpdatedDecisionTreesType.connection_type, null: false
      argument :project_id, ID

      # Works with current_user
      # def authorized?(project_id:)
      #   return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
      #   raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      # end

      def resolve(project_id:)
        project = Project.find(project_id)
        project.algorithms.map(&:decision_trees).flatten.sort { |a, b| b.updated_at <=> a.updated_at }
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

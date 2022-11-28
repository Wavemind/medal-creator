module Queries
  module Algorithms
    class GetAlgorithms < Queries::BaseQuery
      type Types::AlgorithmType.connection_type, null: false
      argument :project_id, ID
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id:, search_term: "")
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:, search_term: "")
        project = Project.find(project_id)
        if search_term.present?
          project.algorithms.ransack("name_cont": search_term).result
        else
          project.algorithms
        end
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

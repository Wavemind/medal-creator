module Queries
  module Nodes
    class GetVariables < Queries::BaseQuery
      type Types::VariableType.connection_type, null: false
      argument :project_id, ID
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id:, search_term: '')
        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:, search_term: '')
        project = Project.find(project_id)
        if search_term.present?
          project.variables.includes(:answer_type).search(search_term,
                                   project.language.code)
        else
          project.variables.includes(:answer_type).order(
            updated_at: :desc
          )
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

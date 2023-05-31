module Queries
  module Users
    class GetUsers < Queries::BaseQuery
      type Types::UserType.connection_type, null: false

      argument :project_id, ID, required: false
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id: nil, search_term: '')
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          is_admin: true, project_id: project_id
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(project_id: nil, search_term: '')
        if project_id.present?
          project = Project.find(project_id)
          project.users
        elsif search_term.present?
          User.ransack("#{User.ransackable_attributes.join('_or_')}_cont": search_term).result
        else
          User.order(:last_name)
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

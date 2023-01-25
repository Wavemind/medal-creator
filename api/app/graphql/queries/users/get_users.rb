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

      def resolve(search_term: '')
        if search_term.present?
          User.ransack("first_name_or_last_name_or_email_cont": search_term).result
        else
          User.order(:last_name)
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

module Queries
  module Users
    class GetUsers < Queries::BaseQuery
      type [Types::UserType], null: false

      argument :id, ID, required: false

      # Works with current_user
      def authorized?(project_id: nil)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(is_admin: true, project_id: project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(project_id: nil)
        User.all
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

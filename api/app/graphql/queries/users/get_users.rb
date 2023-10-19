module Queries
  module Users
    class GetUsers < Queries::BaseQuery
      type Types::UserType.connection_type, null: false

      argument :project_id, ID, required: false
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id: nil, search_term: '')
        return true if context[:current_api_v2_user].project_admin?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(project_id: nil, search_term: '')
        if search_term.present?
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

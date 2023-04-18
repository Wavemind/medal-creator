module Queries
  module Instances
    class GetInstances < Queries::BaseQuery
      type Types::InstanceType.connection_type, null: false

      argument :node_id, ID, required: true
      argument :algorithm_id, ID, required: false
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(node_id:, algorithm_id: nil, search_term: '')
        node = Node.find(node_id)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          is_admin: true, project_id: node.project_id
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      def resolve(node_id:, algorithm_id: nil, search_term: '')
        if algorithm_id.present?
          project = Project.find(project_id)
          project.users
        elsif search_term.present?
          User.ransack("first_name_or_last_name_or_email_cont": search_term).result
        else
          User.order(:last_name)
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

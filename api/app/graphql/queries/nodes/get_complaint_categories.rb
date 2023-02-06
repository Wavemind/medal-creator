module Queries
  module Nodes
    class GetComplaintCategories < Queries::BaseQuery
      type Types::NodeType.connection_type, null: false
      argument :project_id, ID

      # Works with current_user
      def authorized?(project_id:)
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: project_id).any?
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(project_id:)
        project = Project.find(project_id)
        project.nodes.where(type: 'Questions::ComplaintCategory')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

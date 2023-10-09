module Queries
  module Managements
    class GetManagement < Queries::BaseQuery
      type Types::ManagementType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        management = HealthCares::Management.find(id)

        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: management.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Management')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        HealthCares::Management.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

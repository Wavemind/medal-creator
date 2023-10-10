module Queries
  module Projects
    class GetProject < Queries::BaseQuery
      type Types::ProjectType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        if context[:current_api_v2_user].admin? || context[:current_api_v2_user].user_projects.where(project_id: id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(id:)
        Project.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

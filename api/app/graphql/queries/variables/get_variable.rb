module Queries
  module Variables
    class GetVariable < Queries::BaseQuery
      type Types::VariableType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        variable = Variable.find(id)

        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: variable.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Variable')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        Variable.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

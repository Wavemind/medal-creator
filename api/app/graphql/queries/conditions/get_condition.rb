module Queries
  module Conditions
    class GetCondition < Queries::BaseQuery
      type Types::ConditionType, null: true
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        condition = Condition.find(id)
        return true if context[:current_api_v2_user].has_access_to_project?(condition.instance.node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Condition')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        Condition.find(id)
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Mutations
  module Conditions
    class CreateCondition < Mutations::BaseMutation
      # Fields
      field :condition, Types::ConditionType

      # Arguments
      argument :params, Types::Input::ConditionInputType, required: true

      # Works with current_user
      def authorized?(params:)
        node = Node.find(Hash(params)[:node_id])
        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: node.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        condition_params = Hash params

        begin
          condition = Condition.new(condition_params)
          if condition.save
            { condition: condition }
          else
            GraphQL::ExecutionError.new(condition.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

module Mutations
  module Conditions
    class UpdateCondition < Mutations::BaseMutation
      # Fields
      field :condition, Types::ConditionType

      # Arguments
      argument :params, Types::Input::ConditionInputType, required: true

      # Works with current_user
      def authorized?(params:)
        condition = Condition.find(Hash(params)[:id])
        return true if context[:current_api_v2_user].project_clinician?(condition.instance.node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        condition_params = Hash params
        begin
          condition = Condition.find(condition_params[:id])
          if condition.update!(condition_params)
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

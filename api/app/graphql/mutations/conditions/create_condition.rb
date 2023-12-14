module Mutations
  module Conditions
    class CreateCondition < Mutations::BaseMutation
      # Fields
      field :condition, Types::ConditionType, null: false

      # Arguments
      argument :params, Types::Input::ConditionInputType, required: true

      # Works with current_user
      def authorized?(params:)
        instance = Instance.find(Hash(params)[:instance_id])

        if instance.instanceable_type == 'Algorithm'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.status) if instance.instanceable.prod?
        elsif instance.instanceable_type == 'DecisionTree'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.algorithm.status) if instance.instanceable.algorithm.prod?
        else
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if instance.instanceable.is_deployed?
        end

        return true if context[:current_api_v2_user].project_clinician?(instance.node.project_id)

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

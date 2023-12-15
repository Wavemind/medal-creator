module Mutations
  module Conditions
    class DestroyCondition < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        condition = Condition.find(id)
        instance = condition.instance

        if instance.instanceable_type == 'Algorithm'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.status) if instance.instanceable.prod?
        elsif instance.instanceable_type == 'DecisionTree'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.algorithm.status) if instance.instanceable.algorithm.prod?
        else
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if instance.instanceable.is_deployed?
        end

        return true if context[:current_api_v2_user].project_clinician?(condition.instance.node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Condition')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        condition = Condition.find(id)
        if condition.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(condition.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

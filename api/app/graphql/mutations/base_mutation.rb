module Mutations
  class BaseMutation < GraphQL::Schema::RelayClassicMutation
    argument_class Types::BaseArgument
    field_class Types::BaseField
    input_object_class Types::BaseInputObject
    object_class Types::BaseObject

    def check_deployed_instance(instance)
      if instance.instanceable_type == 'Algorithm'
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.status) if instance.instanceable.prod?
      elsif instance.instanceable_type == 'DecisionTree'
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: instance.instanceable.algorithm.status) if instance.instanceable.algorithm.prod?
      else
        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if instance.instanceable.is_deployed?
      end
    end
  end
end

module Mutations
  module Instances
    class CreateInstance < Mutations::BaseMutation
      # Fields
      field :instance, Types::InstanceType, null: false
      
      # Arguments
      argument :params, Types::Input::InstanceInputType, required: true

      # Works with current_user
      def authorized?(params:)
        params = Hash(params)
        node = Node.find(params[:node_id])

        diagram = Object.const_get(params[:instanceable_type]).find(params[:instanceable_id])

        if params[:instanceable_type] == 'Algorithm'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: diagram.status) if diagram.prod?
        elsif params[:instanceable_type] == 'DecisionTree'
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: diagram.algorithm.status) if diagram.algorithm.prod?
        else
          raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_node') if diagram.is_deployed?
        end

        return true if context[:current_api_v2_user].project_clinician?(node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(params:)
        instance_params = Hash params
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            instance = Instance.new(instance_params)
            if instance.save
              { instance: instance }
            else
              raise GraphQL::ExecutionError.new(instance.errors.to_json)
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end

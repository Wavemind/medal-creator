module Mutations
  module Instances
    class UpdateInstance < Mutations::BaseMutation
      # Fields
      field :instance, Types::InstanceType, null: false
      # Arguments
      argument :params, Types::Input::InstanceInputType, required: true

      # Works with current_user
      def authorized?(params:)
        node = Node.find(Hash(params)[:id])

        return true if context[:current_api_v2_user].project_clinician?(node.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(params:)
        instance_params = Hash params
        begin
          instance = Instance.find(instance_params[:id])
          if instance.update!(instance_params)
            { instance: instance }
          else
            GraphQL::ExecutionError.new(instance.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

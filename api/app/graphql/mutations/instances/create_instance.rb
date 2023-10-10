module Mutations
  module Instances
    class CreateInstance < Mutations::BaseMutation
      # Fields
      field :instance, Types::InstanceType, null: false
      
      # Arguments
      argument :params, Types::Input::InstanceInputType, required: true

      # Works with current_user
      def authorized?(params:)
        node = Node.find(Hash(params)[:node_id])

        return true if context[:current_api_v2_user].clinician? || context[:current_api_v2_user].user_projects.where(
          project_id: node.project_id, is_admin: true
        ).any?

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

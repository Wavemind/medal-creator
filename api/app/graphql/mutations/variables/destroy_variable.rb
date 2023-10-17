module Mutations
  module Variables
    class DestroyVariable < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        variable = Variable.find(id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.variables.has_instances') if variable.instances.any?

        return true if context[:current_api_v2_user].project_clinician?(variable.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'variable')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        variable = Variable.find(id)

        if variable.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(variable.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Mutations
  module Managements
    class DestroyManagement < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        management = HealthCares::Management.find(id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.managements.has_instances') if management.instances.any?

        return true if context[:current_api_v2_user].project_clinician?(management.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Management')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        management = HealthCares::Management.find(id)
        if management.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(management.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

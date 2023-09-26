module Mutations
  module Drugs
    class DestroyDrug < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        drug = HealthCares::Drug.find(id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.drugs.has_instances') if drug.instances.any?

        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: drug.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        drug = HealthCares::Drug.find(id)
        if drug.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(drug.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

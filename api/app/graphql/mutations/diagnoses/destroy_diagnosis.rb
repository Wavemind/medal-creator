module Mutations
  module Diagnoses
    class DestroyDiagnosis < Mutations::BaseMutation
      # Fields
      field :id, ID, null: true

      # Arguments
      argument :id, ID, required: true

      # Works with current_user
      def authorized?(id:)
        diagnosis = Diagnosis.find(id)
        algorithm = diagnosis.decision_tree.algorithm

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.deployed_algorithm', status: algorithm.status) unless algorithm.draft?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.diagnoses.has_instances') if diagnosis.instances.any?

        return true if context[:current_api_v2_user].project_clinician?(diagnosis.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Diagnosis')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:)
        diagnosis = Diagnosis.find(id)
        if diagnosis.destroy
          { id: id }
        else
          GraphQL::ExecutionError.new(diagnosis.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Mutations
  module Diagnoses
    class UpdateDiagnosis < Mutations::BaseMutation
      # Fields
      field :diagnosis, Types::DiagnosisType, null: false

      # Arguments
      argument :params, Types::Input::DiagnosisInputType, required: true

      # Works with current_user
      def authorized?(params:)
        diagnosis = Hash(params)[:id]
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          project_id: diagnosis.decision_tree.algorithm.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        diagnosis_params = Hash params
        begin
          diagnosis = Diagnosis.find(diagnosis_params[:id])
          diagnosis.update!(diagnosis_params)
          { diagnosis: diagnosis }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

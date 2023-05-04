module Mutations
  module Diagnoses
    class UpdateDiagnosis < Mutations::BaseMutation
      # Fields
      field :diagnosis, Types::DiagnosisType

      # Arguments
      argument :params, Types::Input::DiagnosisInputType, required: true
      argument :files_to_add, [ApolloUploadServer::Upload], required: false
      argument :existing_files_to_remove, [Int], required: false

      # Works with current_user
      def authorized?(params:, files_to_add:, existing_files_to_remove:)
        diagnosis = Hash(params)[:id]
        return true if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(
          project_id: diagnosis.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:, files_to_add:, existing_files_to_remove:)
        diagnosis_params = Hash params
        begin
          diagnosis = Diagnosis.find(diagnosis_params[:id])
          if diagnosis.update!(diagnosis_params)
            files_to_add.each do |file|
              diagnosis.files.attach(io: file, filename: file.original_filename)
            end
            ActiveStorage::Attachment.destroy(existing_files_to_remove) if existing_files_to_remove.any?
            { diagnosis: diagnosis }
          else
            GraphQL::ExecutionError.new(diagnosis.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

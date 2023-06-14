module Mutations
  module Drugs
    class UpdateDrug < Mutations::BaseMutation
      # Fields
      field :drug, Types::DrugType

      # Arguments
      argument :params, Types::Input::DrugInputType, required: true
      argument :files_to_add, [ApolloUploadServer::Upload], required: false
      argument :existing_files_to_remove, [Int], required: false

      # Works with current_user
      def authorized?(params:, files_to_add:, existing_files_to_remove:)
        project_id = Hash(params)[:project_id]
        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:, files_to_add:, existing_files_to_remove:)
        drug_params = Hash params
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            drug = HealthCares::Drug.find(drug_params[:id])
            if drug.update!(drug_params)
              files_to_add.each do |file|
                drug.files.attach(io: file, filename: file.original_filename)
              end
              ActiveStorage::Attachment.destroy(existing_files_to_remove) if existing_files_to_remove.any?
              { drug: drug }
            else
              GraphQL::ExecutionError.new(drug.errors.to_json)
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end

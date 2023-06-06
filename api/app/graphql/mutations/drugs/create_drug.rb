module Mutations
  module Drugs
    class CreateDrug < Mutations::BaseMutation
      # Fields
      field :drug, Types::DrugType

      # Arguments
      argument :params, Types::Input::DrugInputType, required: true
      argument :files, [ApolloUploadServer::Upload], required: false

      # Works with current_user
      def authorized?(params:, files:)
        project_id = Hash(params)[:project_id]
        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:, files:)
        drug_params = Hash params
        begin
          ActiveRecord::Base.transaction(requires_new: true) do
            drug = HealthCares::Drug.new(drug_params.except(:formulations_attributes))

            # We save first so the drug has an ID for formulations
            if drug.save && drug.update(drug_params)
              files.each do |file|
                drug.files.attach(io: file, filename: file.original_filename)
              end
              { drug: drug }
            else
              GraphQL::ExecutionError.new(drug.errors.to_json)
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

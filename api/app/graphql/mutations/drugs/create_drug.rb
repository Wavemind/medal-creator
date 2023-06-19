module Mutations
  module Drugs
    class CreateDrug < Mutations::BaseMutation
      # Fields
      field :drug, Types::DrugType

      # Arguments
      argument :params, Types::Input::DrugInputType, required: true

      # Works with current_user
      def authorized?(params:)
        project_id = Hash(params)[:project_id]
        puts '###############################'
        puts Hash(params).inspect
        puts '###############################'
        return true if context[:current_api_v1_user].clinician? || context[:current_api_v1_user].user_projects.where(
          project_id: project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        drug_params = Hash params
        begin
          ActiveRecord::Base.transaction(requires_new: true) do
            drug = HealthCares::Drug.new(drug_params.except(:formulations_attributes))

            # We save first so the drug has an ID for formulations
            raise GraphQL::ExecutionError, drug.errors.to_json unless drug.save

            { drug: drug }
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

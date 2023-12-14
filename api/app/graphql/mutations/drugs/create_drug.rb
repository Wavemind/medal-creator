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

        return true if context[:current_api_v2_user].project_clinician?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:)
        drug_params = Hash params
        begin
          ActiveRecord::Base.transaction(requires_new: true) do
            drug = HealthCares::Drug.new(drug_params.except(:formulations_attributes))

            # We save first so the drug has an ID for formulations
            if drug.save && drug.update(drug_params)
              { drug: drug }
            else
              raise GraphQL::ExecutionError.new(drug.errors.to_json)
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

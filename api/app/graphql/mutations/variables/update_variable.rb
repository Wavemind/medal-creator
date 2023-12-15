module Mutations
  module Variables
    class UpdateVariable < Mutations::BaseMutation
      # Fields
      field :variable, Types::VariableType

      # Arguments
      argument :params, Types::Input::VariableInputType, required: true
      argument :files_to_add, [ApolloUploadServer::Upload], required: false
      argument :existing_files_to_remove, [Int], required: false

      # Works with current_user
      def authorized?(params:, files_to_add:, existing_files_to_remove:)
        variable = Variable.find(Hash(params)[:id])

        return true if context[:current_api_v2_user].project_clinician?(variable.project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      # Resolve
      def resolve(params:, files_to_add:, existing_files_to_remove:)
        variable_params = Hash params
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            variable = Variable.find(variable_params[:id])
            if variable.update!(variable_params)
              files_to_add.each do |file|
                variable.files.attach(io: file, filename: file.original_filename)
              end
              ActiveStorage::Attachment.destroy(existing_files_to_remove) if existing_files_to_remove.any?
              { variable: variable }
            else
              raise GraphQL::ExecutionError.new(variable.errors.to_json)
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end

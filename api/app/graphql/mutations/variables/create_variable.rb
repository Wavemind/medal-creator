module Mutations
  module Variables
    class CreateVariable < Mutations::BaseMutation
      # Fields
      field :variable, Types::VariableType

      # Arguments
      argument :params, Types::Input::VariableInputType, required: true
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
        variable_params = Hash params
        begin
          ActiveRecord::Base.transaction(requires_new: true) do
            variable = Variable.new(variable_params.except(:answers_attributes))
            # We save first so the variable has an ID for answers
            if variable.save && variable.update(variable_params)
              files.each do |file|
                variable.files.attach(io: file, filename: file.original_filename)
              end
              { variable: variable }
            else
              GraphQL::ExecutionError.new(variable.errors.to_json)
            end
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

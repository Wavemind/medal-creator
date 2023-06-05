module Mutations
  module Managements
    class UpdateManagement < Mutations::BaseMutation
      # Fields
      field :management, Types::ManagementType

      # Arguments
      argument :params, Types::Input::ManagementInputType, required: true
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
        management_params = Hash params
        begin
          management = HealthCares::Management.find(management_params[:id])
          if management.update!(management_params)
            files_to_add.each do |file|
              management.files.attach(io: file, filename: file.original_filename)
            end
            ActiveStorage::Attachment.destroy(existing_files_to_remove) if existing_files_to_remove.any?
            { management: management }
          else
            GraphQL::ExecutionError.new(management.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

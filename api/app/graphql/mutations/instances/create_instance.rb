module Mutations
  module Instances
    class CreateInstance < Mutations::BaseMutation
      # Fields
      field :instance, Types::InstanceType

      # Arguments
      argument :params, Types::Input::InstanceInputType, required: true
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
        instance_params = Hash params
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            instance = Instance.new(instance_params)
            if instance.save
              files.each do |file|
                instance.files.attach(io: file, filename: file.original_filename)
              end
              { instance: instance }
            else
              raise GraphQL::ExecutionError.new(instance.errors.to_json)
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end

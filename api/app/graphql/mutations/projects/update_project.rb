module Mutations
  module Projects
    class UpdateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true
      argument :villages, ApolloUploadServer::Upload, required: false

      # Works with current_user
      def authorized?(params:, villages: nil)
        id = Hash(params)[:id]
        return true if context[:current_api_v1_user].projects.map(&:id).include?(id) || context[:current_api_v1_user].admin?
        raise GraphQL::ExecutionError, "You do not have access to this project"
      end

      # Resolve
      def resolve(params:, villages: nil)
        project_params = Hash params
        begin
          project = Project.find(project_params[:id])
          project.village_json = File.read(villages) if villages.present?

          if project.update(project_params)
            { project: project }
          else
            GraphQL::ExecutionError.new(project.errors.full_messages.join(', '))
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end
end

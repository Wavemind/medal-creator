module Mutations
  module Projects
    class UpdateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true
      argument :villages, ApolloUploadServer::Upload, required: false

      # Works with current_user
      def authorized?(params:, villages: nil)
        id = Hash(params)[:id]
        if context[:current_api_v1_user].projects.map(&:id).include?(id) || context[:current_api_v1_user].admin?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
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
            GraphQL::ExecutionError.new(project.errors.to_json)
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.to_json)
        end
      end
    end
  end
end

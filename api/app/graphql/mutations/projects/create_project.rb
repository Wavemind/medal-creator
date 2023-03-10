module Mutations
  module Projects
    class CreateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: true

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true
      argument :villages, ApolloUploadServer::Upload, required: false

      # Works with current_user
      def authorized?(params:, villages: nil)
        return true if context[:current_api_v1_user].admin?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.admin_needed')
      end

      # Resolve
      def resolve(params:, villages: nil)
        project_params = Hash params
        begin
          project = Project.new(project_params)
          project.village_json = File.read(villages) if villages.present?

          if project.save
            { project: project }
          else
            error = GraphQL::ExecutionError.new(project.errors.full_messages.join(', '))
            puts "**********************************"
            puts error
            error
          end
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
        end
      end
    end
  end
end

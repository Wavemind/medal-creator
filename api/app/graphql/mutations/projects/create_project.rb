module Mutations
  module Projects
    class CreateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true
      argument :villages, ApolloUploadServer::Upload, required: false

      # Works with current_user
      def authorized?(params:, villages: nil)
        return true if context[:current_api_v1_user].admin?

        raise GraphQL::ExecutionError, 'You cannot create projects.'
      end

      # Resolve
      def resolve(params:, villages: nil)
        puts '######################################'
        puts '######################################'
        puts '######################################'
        puts '######################################'
        puts '######################################'
        puts File.read villages
        puts '######################################'
        puts '######################################'
        puts '######################################'
        puts '######################################'
        puts '######################################'
        project_params = Hash params
        begin
          project = Project.new(project_params)
          if project.save
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

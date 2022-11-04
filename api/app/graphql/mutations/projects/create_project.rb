module Mutations
  module Projects
    class CreateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true

      # Resolve
      def resolve(params:)
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

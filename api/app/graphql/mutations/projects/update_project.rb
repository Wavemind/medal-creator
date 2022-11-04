module Mutations
  module Projects
    class UpdateProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :params, Types::Input::ProjectInputType, required: true

      # Resolve
      def resolve(params:)
        project_params = Hash params
        begin
          project = Project.find(project_params[:id])
          project.update(project_params)
          { project: project }
        rescue ActiveRecord::RecordInvalid => e
          GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
            " #{e.record.errors.full_messages.join(', ')}")
        end
      end
    end
  end
end

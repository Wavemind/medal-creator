module Mutations
  module Projects
    class UnsubscribeFromProject < Mutations::BaseMutation
      # Fields
      field :project, Types::ProjectType, null: false

      # Arguments
      argument :id, ID, required: true

      # Resolve
      def resolve(id:)
        user_project = context[:current_api_v1_user].user_projects.find_by(project_id: id)
        if user_project.destroy
          { id: user_project.id }
        else
          GraphQL::ExecutionError.new(user_project.errors.to_json)
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

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
        user_project.destroy
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: _e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.full_messages.join(', '))
      end
    end
  end
end

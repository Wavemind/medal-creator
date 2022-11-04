module Queries
  module Projects
    class GetProject < Queries::BaseQuery
      type Types::ProjectType, null: false
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        return true if context[:current_api_v1_user].user_projects.where(project_id: id).any?
        raise GraphQL::ExecutionError, "You do not have access to this project"
      end

      def resolve(id:)
        Project.find(id)
      rescue ActiveRecord::RecordNotFound => _e
        GraphQL::ExecutionError.new('Project does not exist.')
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

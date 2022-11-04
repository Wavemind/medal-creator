module Queries
  module Projects
    class GetProjects < Queries::BaseQuery
      type [Types::ProjectType], null: false

      def resolve
        context[:current_api_v1_user].admin? ? Project.all : context[:current_api_v1_user].projects
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new("Invalid attributes for #{e.record.class}:"\
          " #{e.record.errors.full_messages.join(', ')}")
      end
    end
  end
end

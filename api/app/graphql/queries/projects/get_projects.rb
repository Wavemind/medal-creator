module Queries
  module Projects
    class GetProjects < Queries::BaseQuery
      type Types::ProjectType.connection_type, null: false

      argument :search_term, String, required: false

      def resolve(search_term: '')
        if search_term.present?
          context[:current_api_v1_user].admin? ? Project.ransack("name_cont": search_term).result : context[:current_api_v1_user].projects.ransack("name_cont": search_term).result
        else
          context[:current_api_v1_user].admin? ? Project.all : context[:current_api_v1_user].projects
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

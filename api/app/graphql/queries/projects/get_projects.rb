module Queries
  module Projects
    class GetProjects < Queries::BaseQuery
      type Types::ProjectType.connection_type, null: false

      argument :search_term, String, required: false

      def resolve(search_term: '')
        if search_term.present?
          context[:current_api_v2_user].admin? ? Project.ransack("#{Project.ransackable_attributes.join('_or_')}_cont": search_term).result : context[:current_api_v2_user].projects.ransack("#{Project.ransackable_attributes.join('_or_')}_cont": search_term).result
        else
          context[:current_api_v2_user].admin? ? Project.all : context[:current_api_v2_user].projects
        end
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Queries
  module HealthCares
    class GetHealthCaresExclusions < Queries::BaseQuery
      type Types::NodeExclusionType.connection_type, null: false

      argument :project_id, ID, required: true
      argument :type, Types::Enum::NodeExclusionTypeEnum, required: true
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id:, type:, search_term: '')
        return true if context[:current_api_v2_user].has_access_to_project?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      end

      def resolve(project_id:, type:, search_term: '')
        project = Project.find(project_id)

        if search_term.present?
          health_cares = project.send(type.pluralize).search(search_term, project.language.code)
        else
          health_cares = project.send(type.pluralize)
        end

        NodeExclusion.where(excluding_node: health_cares).or(NodeExclusion.where(excluded_node: health_cares))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

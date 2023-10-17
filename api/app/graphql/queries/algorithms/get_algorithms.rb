module Queries
  module Algorithms
    class GetAlgorithms < Queries::BaseQuery
      type Types::AlgorithmType.connection_type, null: false
      argument :project_id, ID
      argument :search_term, String, required: false

      # Works with current_user
      def authorized?(project_id:, search_term: '')
        return true if context[:current_api_v2_user].has_access_to_project?(project_id)

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Project')
      end

      def resolve(project_id:, search_term: '')
        project = Project.find(project_id)
        if search_term.present?
          project.algorithms.ransack("#{Algorithm.ransackable_attributes.join('_or_')}_cont": search_term).result
        else
          project.algorithms.order(
            updated_at: :desc
          )
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.record.class))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

module Queries
  module Algorithms
    class ExportVariables < Queries::BaseQuery
      type String, null: true
      argument :id, ID

      # Works with current_user
      def authorized?(id:)
        algo = Algorithm.find(id)
        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algo.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:)
        file_path = ExportVariablesService.process(id)

        if file_path.present?
          "/exports/#{File.basename(file_path)}"
        else
          nil
        end
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

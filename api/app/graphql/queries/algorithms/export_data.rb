module Queries
  module Algorithms
    class ExportData < Queries::BaseQuery
      type Types::ResponseDataType, null: false
      argument :id, ID
      argument :export_type, String

      # Works with current_user
      def authorized?(id:, export_type:)
        algo = Algorithm.find(id)
        if context[:current_api_v1_user].admin? || context[:current_api_v1_user].user_projects.where(project_id: algo.project_id).any?
          return true
        end

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      def resolve(id:, export_type:)
        # Detect the export type asked and return nil if no type or if the export failed
        if export_type == 'variables'
          file_path = ExportVariablesService.process(id)
        elsif export_type == 'translations'
          file_path = ExportTranslationsService.process(id)
        else
          file_path = nil
        end

        # Why do we need to return whether it's success or not ?
        { success: file_path.present?, url: file_path}
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      rescue ActiveRecord::RecordInvalid => e
        GraphQL::ExecutionError.new(e.record.errors.to_json)
      end
    end
  end
end

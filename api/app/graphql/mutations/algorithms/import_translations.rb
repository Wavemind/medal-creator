module Mutations
  module Algorithms
    class ImportTranslations < Mutations::BaseMutation
      # Fields
      field :id, ID

      # Arguments
      argument :id, ID, required: true
      argument :translations_file, ApolloUploadServer::Upload, required: true

      # Works with current_user
      def authorized?(id:, translations_file:)
        algorithm = Algorithm.find(id)
        return true if context[:current_api_v2_user].clinician? || context[:current_api_v2_user].user_projects.where(
          project_id: algorithm.project_id, is_admin: true
        ).any?

        raise GraphQL::ExecutionError, I18n.t('graphql.errors.wrong_access', class_name: 'Algorithm')
      rescue ActiveRecord::RecordNotFound => e
        GraphQL::ExecutionError.new(I18n.t('graphql.errors.object_not_found', class_name: e.model))
      end

      # Resolve
      def resolve(id:, translations_file:)
        ActiveRecord::Base.transaction(requires_new: true) do
          begin
            if File.extname(translations_file.original_filename).include?('xls')
              ImportTranslationsService.process(translations_file)
            else
              raise GraphQL::ExecutionError, I18n.t('graphql.errors.xl_format')
            end
          rescue ActiveRecord::RecordInvalid => e
            GraphQL::ExecutionError.new(e.record.errors.to_json)
          end
        end
      end
    end
  end
end